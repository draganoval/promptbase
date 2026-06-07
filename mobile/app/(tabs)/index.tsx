import { useCallback, useState, type ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';

type ScreenName = 'login' | 'prompts' | 'details' | 'favorites' | 'profile';

type User = {
  id?: string | number;
  name?: string;
  email?: string;
  role?: string;
  [key: string]: unknown;
};

type Prompt = {
  id?: string | number;
  title?: string;
  description?: string;
  content?: string;
  category?: string;
  tags?: string[];
  isFavorite?: boolean;
  [key: string]: unknown;
};

type LoginResponse = {
  token?: string;
  accessToken?: string;
  user?: User;
  message?: string;
  data?: {
    token?: string;
    accessToken?: string;
    user?: User;
    message?: string;
  };
};

const LOGIN_URL = 'http://192.168.0.138:3000/api/auth/login';
const PROMPTS_URL = 'http://192.168.0.138:3000/api/prompts?page=1&limit=20';
const FAVORITES_URL = 'http://192.168.0.138:3000/api/favorites';

const screenLabels: Record<ScreenName, string> = {
  login: 'Login',
  prompts: 'Prompt List',
  details: 'Prompt Details',
  favorites: 'Favorites',
  profile: 'Profile',
};

function normalizePrompts(payload: unknown): Prompt[] {
  if (Array.isArray(payload)) {
    return payload as Prompt[];
  }

  if (payload && typeof payload === 'object') {
    const data = payload as {
      prompts?: unknown;
      items?: unknown;
      data?: unknown;
      results?: unknown;
    };

    for (const value of [data.prompts, data.items, data.data, data.results]) {
      if (Array.isArray(value)) {
        return value as Prompt[];
      }
    }
  }

  return [];
}

function promptKey(prompt: Prompt, index: number) {
  return String(prompt.id ?? prompt.title ?? index);
}

function getPromptTitle(prompt: Prompt) {
  return prompt.title ?? 'Untitled prompt';
}

export default function HomeScreen() {
  const [screen, setScreen] = useState<ScreenName>('login');
  const [previousScreen, setPreviousScreen] = useState<Exclude<ScreenName, 'details'> | null>(
    null,
  );
  const [token, setToken] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginBusy, setLoginBusy] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [promptBusy, setPromptBusy] = useState(false);
  const [promptError, setPromptError] = useState('');
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [favorites, setFavorites] = useState<Prompt[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [favoritesBusy, setFavoritesBusy] = useState(false);
  const [favoritesError, setFavoritesError] = useState('');

  function buildHeaders(accessToken?: string) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    return headers;
  }

  const loadPrompts = useCallback(async (accessToken?: string) => {
    setPromptBusy(true);
    setPromptError('');

    try {
      const response = await fetch(PROMPTS_URL, {
        headers: buildHeaders(accessToken ?? token),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error('Unable to load prompts');
      }

      setPrompts(normalizePrompts(payload));
    } catch (error) {
      setPromptError(error instanceof Error ? error.message : 'Unable to load prompts');
    } finally {
      setPromptBusy(false);
    }
  }, [token]);

  const loadFavorites = useCallback(async (accessToken?: string) => {
    setFavoritesBusy(true);
    setFavoritesError('');

    try {
      const response = await fetch(FAVORITES_URL, {
        headers: buildHeaders(accessToken ?? token),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error('Unable to load favorites');
      }

      setFavorites(normalizePrompts(payload));
    } catch (error) {
      setFavoritesError(error instanceof Error ? error.message : 'Unable to load favorites');
    } finally {
      setFavoritesBusy(false);
    }
  }, [token]);

  async function login() {
    setLoginBusy(true);
    setLoginError('');

    try {
      const response = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginForm),
      });

      const payload = (await response.json().catch(() => ({}))) as LoginResponse;
      const responseBody = payload.data ?? payload;

      if (!response.ok) {
        throw new Error(responseBody.message ?? 'Login failed');
      }

      const nextToken =
        responseBody.token ?? responseBody.accessToken ?? payload.token ?? payload.accessToken ?? '';
      const nextUser = responseBody.user ?? payload.user ?? { email: loginForm.email };

      setToken(nextToken);
      setUser(nextUser);
      void loadPrompts(nextToken);
      setScreen('prompts');
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setLoginBusy(false);
    }
  }

  function openPromptDetails(prompt: Prompt, source: Exclude<ScreenName, 'details'>) {
    setPreviousScreen(source);
    setSelectedPrompt(prompt);
    setScreen('details');
  }

  function goTo(screenName: Exclude<ScreenName, 'details'>) {
    if (screenName === 'prompts') {
      void loadPrompts();
    }

    if (screenName === 'favorites') {
      if (token) {
        void loadFavorites();
      } else {
        setFavorites([]);
        setFavoritesError('Login to view favorites.');
      }
    }

    setScreen(screenName);
  }

  function signOut() {
    setToken('');
    setUser(null);
    setPrompts([]);
    setFavorites([]);
    setSelectedPrompt(null);
    setLoginForm({ email: '', password: '' });
    setScreen('login');
  }

  const currentPrompt = selectedPrompt;

  return (
    <View style={styles.shell}>
      <View style={styles.topGlow} />
      <View style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View>
              <Text style={styles.brand}>PromptBase</Text>
              <Text style={styles.subtitle}>{screenLabels[screen]}</Text>
            </View>
            {screen !== 'login' ? (
              <Pressable style={styles.ghostButton} onPress={signOut}>
                <Text style={styles.ghostButtonText}>Logout</Text>
              </Pressable>
            ) : null}
          </View>

          <View style={styles.navRow}>
            <NavButton label="Login" active={screen === 'login'} onPress={() => goTo('login')} />
            <NavButton label="Prompts" active={screen === 'prompts'} onPress={() => goTo('prompts')} />
            <NavButton
              label="Favorites"
              active={screen === 'favorites'}
              onPress={() => goTo('favorites')}
            />
            <NavButton label="Profile" active={screen === 'profile'} onPress={() => goTo('profile')} />
          </View>

          {screen === 'login' ? (
            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
              <Card>
                <Text style={styles.cardTitle}>Sign in</Text>
                <Text style={styles.cardCopy}>
                  Connect to the local PromptBase API and load your workspace.
                </Text>
                <Field
                  label="Email"
                  value={loginForm.email}
                  onChangeText={(text) => setLoginForm((current) => ({ ...current, email: text }))}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="you@example.com"
                />
                <Field
                  label="Password"
                  value={loginForm.password}
                  onChangeText={(text) =>
                    setLoginForm((current) => ({ ...current, password: text }))
                  }
                  secureTextEntry
                  placeholder="••••••••"
                />
                {loginError ? <Text style={styles.errorText}>{loginError}</Text> : null}
                <Pressable style={styles.primaryButton} onPress={login} disabled={loginBusy}>
                  {loginBusy ? (
                    <ActivityIndicator color="#F8FAFC" />
                  ) : (
                    <Text style={styles.primaryButtonText}>Login</Text>
                  )}
                </Pressable>
              </Card>
            </ScrollView>
          ) : null}

          {screen === 'prompts' ? (
            <PromptList
              title="Latest prompts"
              prompts={prompts}
              loading={promptBusy}
              error={promptError}
              onRefresh={loadPrompts}
              onPressPrompt={(prompt) => openPromptDetails(prompt, 'prompts')}
            />
          ) : null}

          {screen === 'favorites' ? (
            <PromptList
              title="Your favorites"
              prompts={favorites}
              loading={favoritesBusy}
              error={favoritesError}
              onRefresh={loadFavorites}
              onPressPrompt={(prompt) => openPromptDetails(prompt, 'favorites')}
            />
          ) : null}

          {screen === 'details' ? (
            <ScrollView contentContainerStyle={styles.content}>
              <Card>
                <Pressable
                  style={styles.backButton}
                  onPress={() => setScreen(previousScreen ?? 'prompts')}
                >
                  <Text style={styles.backButtonText}>Back</Text>
                </Pressable>
                <Text style={styles.cardTitle}>
                  {currentPrompt ? getPromptTitle(currentPrompt) : 'Prompt'}
                </Text>
                <Text style={styles.muted}>{currentPrompt?.category ?? 'Prompt details'}</Text>
                <Section
                  label="Description"
                  value={currentPrompt?.description ?? 'No description provided.'}
                />
                <Section label="Content" value={currentPrompt?.content ?? 'No content available.'} />
                <Section label="Tags" value={formatTags(currentPrompt?.tags)} />
                <Section label="Favorite" value={currentPrompt?.isFavorite ? 'Yes' : 'No'} />
              </Card>
            </ScrollView>
          ) : null}

          {screen === 'profile' ? (
            <ScrollView contentContainerStyle={styles.content}>
              <Card>
                <Text style={styles.cardTitle}>Profile</Text>
                <ProfileRow label="Name" value={user?.name ?? 'Unknown'} />
                <ProfileRow label="Email" value={user?.email ?? loginForm.email ?? 'Not signed in'} />
                <ProfileRow label="Role" value={user?.role ?? 'Member'} />
                <ProfileRow label="Token" value={token ? 'Stored in state' : 'No token yet'} />
                <Pressable style={styles.secondaryButton} onPress={() => goTo('prompts')}>
                  <Text style={styles.secondaryButtonText}>Open prompt list</Text>
                </Pressable>
              </Card>
            </ScrollView>
          ) : null}
        </View>
      </View>
    </View>
  );
}

function PromptList({
  title,
  prompts,
  loading,
  error,
  onRefresh,
  onPressPrompt,
}: {
  title: string;
  prompts: Prompt[];
  loading: boolean;
  error: string;
  onRefresh: () => void;
  onPressPrompt: (prompt: Prompt) => void;
}) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Card>
        <View style={styles.rowBetween}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Pressable style={styles.smallButton} onPress={onRefresh}>
            <Text style={styles.smallButtonText}>Refresh</Text>
          </Pressable>
        </View>
        {loading ? <ActivityIndicator style={styles.loader} color="#0F172A" /> : null}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {!loading && !error && prompts.length === 0 ? (
          <Text style={styles.muted}>No prompts returned yet.</Text>
        ) : null}
        <View style={styles.list}>
          {prompts.map((prompt, index) => (
            <Pressable
              key={promptKey(prompt, index)}
              style={styles.promptItem}
              onPress={() => onPressPrompt(prompt)}
            >
              <Text style={styles.promptTitle}>{getPromptTitle(prompt)}</Text>
              <Text style={styles.promptMeta}>{prompt.category ?? 'General'}</Text>
              <Text style={styles.promptBody} numberOfLines={3}>
                {prompt.description ?? prompt.content ?? 'Tap to inspect this prompt.'}
              </Text>
            </Pressable>
          ))}
        </View>
      </Card>
    </ScrollView>
  );
}

function NavButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={[styles.navButton, active && styles.navButtonActive]} onPress={onPress}>
      <Text style={[styles.navButtonText, active && styles.navButtonTextActive]}>{label}</Text>
    </Pressable>
  );
}

function Card({ children }: { children: ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

function Field({
  label,
  ...props
}: {
  label: string;
} & TextInputProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput {...props} style={styles.input} placeholderTextColor="#94A3B8" />
    </View>
  );
}

function Section({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{label}</Text>
      <Text style={styles.sectionValue}>{value}</Text>
    </View>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.profileRow}>
      <Text style={styles.profileLabel}>{label}</Text>
      <Text style={styles.profileValue}>{value}</Text>
    </View>
  );
}

function formatTags(tags: Prompt['tags']) {
  if (!Array.isArray(tags) || tags.length === 0) {
    return 'No tags';
  }

  return tags.join(', ');
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: '#F4F7FB',
  },
  safeArea: {
    flex: 1,
    paddingTop: 12,
  },
  topGlow: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#D9EAFE',
    opacity: 0.7,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    fontSize: 30,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    marginTop: 2,
    fontSize: 14,
    color: '#64748B',
  },
  ghostButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#E2E8F0',
  },
  ghostButtonText: {
    color: '#0F172A',
    fontWeight: '700',
  },
  navRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  navButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D8E0EA',
  },
  navButtonActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  navButtonText: {
    color: '#334155',
    fontWeight: '700',
  },
  navButtonTextActive: {
    color: '#FFFFFF',
  },
  content: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  cardCopy: {
    marginTop: 8,
    marginBottom: 16,
    color: '#64748B',
    lineHeight: 20,
  },
  field: {
    marginBottom: 14,
  },
  fieldLabel: {
    marginBottom: 8,
    color: '#334155',
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
  },
  primaryButton: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  secondaryButton: {
    marginTop: 14,
    backgroundColor: '#E2E8F0',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#0F172A',
    fontWeight: '800',
  },
  errorText: {
    color: '#B91C1C',
    marginBottom: 12,
    fontWeight: '600',
  },
  muted: {
    color: '#64748B',
    marginTop: 8,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  smallButton: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
  },
  smallButtonText: {
    color: '#0F172A',
    fontWeight: '700',
  },
  loader: {
    marginTop: 12,
  },
  list: {
    marginTop: 14,
    gap: 12,
  },
  promptItem: {
    padding: 16,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  promptTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  promptMeta: {
    marginTop: 4,
    color: '#475569',
    fontWeight: '600',
  },
  promptBody: {
    marginTop: 8,
    color: '#64748B',
    lineHeight: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#E2E8F0',
  },
  backButtonText: {
    color: '#0F172A',
    fontWeight: '700',
  },
  section: {
    marginTop: 14,
  },
  sectionLabel: {
    color: '#475569',
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionValue: {
    color: '#0F172A',
    lineHeight: 22,
  },
  profileRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  profileLabel: {
    color: '#64748B',
    fontWeight: '700',
    marginBottom: 4,
  },
  profileValue: {
    color: '#0F172A',
  },
});

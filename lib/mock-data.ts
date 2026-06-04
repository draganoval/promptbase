export type NavItem = {
  label: string;
  href: string;
  description: string;
};

export type Prompt = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  status: string;
  owner: string;
  updatedAt: string;
  favorites: number;
  usage: number;
  tags: string[];
  content: string;
  steps: string[];
};

export const primaryNavItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    description: "Workspace overview and team activity",
  },
  {
    label: "Library",
    href: "/library",
    description: "Browse reusable prompts",
  },
  {
    label: "Favorites",
    href: "/favorites",
    description: "Saved prompts and quick access",
  },
  {
    label: "Profile",
    href: "/profile",
    description: "Personal settings and preferences",
  },
];

export const adminNavItems: NavItem[] = [
  {
    label: "Admin Users",
    href: "/admin/users",
    description: "Review team access and roles",
  },
  {
    label: "Admin Categories",
    href: "/admin/categories",
    description: "Manage taxonomy and prompt grouping",
  },
];

export const mockStats = [
  {
    label: "Active prompts",
    value: "128",
    description: "Reusable prompt templates across the workspace.",
  },
  {
    label: "Weekly favorites",
    value: "1.2k",
    description: "Prompts marked useful by the team this week.",
  },
  {
    label: "Teams onboarded",
    value: "12",
    description: "Departments already using PromptBase daily.",
  },
];

export const mockPrompts: Prompt[] = [
  {
    slug: "quarterly-business-review",
    title: "Quarterly business review summary",
    summary:
      "Create an executive-ready summary that highlights wins, risks, and next actions.",
    category: "Operations",
    status: "Published",
    owner: "Ava Chen",
    updatedAt: "Updated 2 hours ago",
    favorites: 42,
    usage: 118,
    tags: ["reporting", "leadership", "summary"],
    content:
      "You are preparing a quarterly business review for an executive audience. Summarize the business performance, note risks, and end with clear next steps.",
    steps: [
      "Add the key business metrics and context.",
      "Include wins, blockers, and notable customer feedback.",
      "Finish with a short action plan and owners.",
    ],
  },
  {
    slug: "client-onboarding-email",
    title: "Client onboarding welcome email",
    summary:
      "Draft a polished welcome email that sets expectations for a smooth client kickoff.",
    category: "Customer Success",
    status: "Published",
    owner: "Jordan Lee",
    updatedAt: "Updated yesterday",
    favorites: 65,
    usage: 204,
    tags: ["email", "onboarding", "client-facing"],
    content:
      "Write a warm, professional welcome email for a new client. Confirm the kickoff timeline, key stakeholders, and what they should prepare before the first meeting.",
    steps: [
      "Confirm the relationship owner and kickoff date.",
      "List preparation items and expected deliverables.",
      "Keep the tone warm, calm, and concise.",
    ],
  },
  {
    slug: "meeting-recap-format",
    title: "Meeting recap format",
    summary:
      "Turn meeting notes into a concise recap with owners, deadlines, and follow-ups.",
    category: "Operations",
    status: "Draft",
    owner: "Priya Patel",
    updatedAt: "Updated 6 days ago",
    favorites: 28,
    usage: 91,
    tags: ["notes", "recap", "action-items"],
    content:
      "Convert rough meeting notes into a crisp recap. Include decisions, unresolved questions, and a task list with owners and deadlines.",
    steps: [
      "Pull out decisions and action items.",
      "Call out open questions and blockers.",
      "Use bullet points and short sentences.",
    ],
  },
  {
    slug: "support-escalation-response",
    title: "Support escalation response",
    summary:
      "Create a calm, empathetic support response for urgent customer issues.",
    category: "Support",
    status: "Published",
    owner: "Maya Torres",
    updatedAt: "Updated 3 days ago",
    favorites: 53,
    usage: 152,
    tags: ["support", "escalation", "customer"],
    content:
      "You are responding to an escalated support case. Acknowledge the issue, explain the next update window, and reassure the customer that ownership is clear.",
    steps: [
      "Lead with empathy and acknowledgement.",
      "Set expectation on the next update time.",
      "Provide a direct path for follow-up questions.",
    ],
  },
  {
    slug: "launch-announcement",
    title: "Internal launch announcement",
    summary:
      "Announce a new feature launch to the team with crisp context and next steps.",
    category: "Product",
    status: "Review",
    owner: "Nora Singh",
    updatedAt: "Updated today",
    favorites: 19,
    usage: 67,
    tags: ["launch", "internal", "announcement"],
    content:
      "Draft an internal launch announcement for a new product feature. Explain the customer value, rollout plan, and what each team should do next.",
    steps: [
      "Summarize the feature and customer value.",
      "Mention rollout timing and dependencies.",
      "Add a short section with team-specific actions.",
    ],
  },
  {
    slug: "policy-update-email",
    title: "Policy update communication",
    summary:
      "Communicate a policy change to employees in a clear and respectful tone.",
    category: "HR",
    status: "Published",
    owner: "Elena Brooks",
    updatedAt: "Updated 8 days ago",
    favorites: 31,
    usage: 88,
    tags: ["policy", "HR", "communications"],
    content:
      "Write an internal policy update message. Explain what changed, why it changed, when it takes effect, and where employees can ask questions.",
    steps: [
      "State the policy change plainly.",
      "Give the effective date and any exceptions.",
      "Close with a contact for questions.",
    ],
  },
];

export const categories = [
  { name: "Operations", prompts: 32, owner: "Ava Chen", color: "teal" },
  { name: "Customer Success", prompts: 24, owner: "Jordan Lee", color: "blue" },
  { name: "Support", prompts: 18, owner: "Maya Torres", color: "amber" },
  { name: "Product", prompts: 17, owner: "Nora Singh", color: "emerald" },
  { name: "HR", prompts: 11, owner: "Elena Brooks", color: "slate" },
];

export const users = [
  { name: "Ava Chen", role: "Admin", team: "Operations", prompts: 28, status: "Active" },
  { name: "Jordan Lee", role: "Editor", team: "Customer Success", prompts: 19, status: "Active" },
  { name: "Priya Patel", role: "Editor", team: "Operations", prompts: 14, status: "Invited" },
  { name: "Maya Torres", role: "Reviewer", team: "Support", prompts: 16, status: "Active" },
  { name: "Nora Singh", role: "Editor", team: "Product", prompts: 12, status: "Pending" },
];

export const favorites = mockPrompts.filter((prompt) => prompt.favorites >= 30);

export const dashboardHighlights = [
  "Prompt usage grew 18% this month.",
  "Three prompts are currently in review.",
  "Two teams added new workspace owners.",
];

export function getPromptBySlug(slug: string) {
  return mockPrompts.find((prompt) => prompt.slug === slug) ?? mockPrompts[0];
}
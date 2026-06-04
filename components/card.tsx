type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-3xl border border-slate-200/80 bg-white/90 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.2)] backdrop-blur ${className}`.trim()}
    >
      {children}
    </div>
  );
}
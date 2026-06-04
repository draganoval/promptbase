type BadgeVariant = "default" | "teal" | "outline" | "amber" | "blue";

type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

const badgeStyles: Record<BadgeVariant, string> = {
  default: "bg-slate-100 text-slate-700",
  teal: "bg-teal-50 text-teal-800 ring-1 ring-inset ring-teal-200",
  outline: "border border-slate-200 bg-transparent text-slate-600",
  amber: "bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200",
  blue: "bg-sky-50 text-sky-800 ring-1 ring-inset ring-sky-200",
};

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${badgeStyles[variant]} ${className}`.trim()}
    >
      {children}
    </span>
  );
}
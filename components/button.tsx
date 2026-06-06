import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type CommonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
};

type LinkButtonProps = CommonProps & {
  href: string;
  type?: never;
};

type NativeButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: never;
  };

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-slate-950 !text-white shadow-sm shadow-slate-950/15 hover:-translate-y-0.5 hover:bg-slate-800 hover:!text-white",
  secondary:
    "border border-slate-300 bg-white text-slate-950 hover:border-slate-400 hover:bg-slate-50",
  ghost: "text-slate-800 hover:bg-slate-100 hover:text-slate-950",
};

const sizeStyles = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-sm",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  ...props
}: LinkButtonProps | NativeButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:pointer-events-none disabled:opacity-60";
  const classes = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`.trim();

  if ("href" in props) {
    const { href, ...linkProps } = props as LinkButtonProps;

    return (
      <Link aria-disabled={disabled} className={classes} href={href} {...(linkProps as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </Link>
    );
  }

  const buttonProps = props as NativeButtonProps;

  return (
    <button className={classes} disabled={disabled} {...buttonProps}>
      {children}
    </button>
  );
}
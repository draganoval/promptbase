import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      {...props}
      className={`h-11 w-full min-w-0 rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-950 placeholder:text-slate-500 shadow-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 ${className}`.trim()}
    />
  );
}
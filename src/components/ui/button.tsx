import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

const base = "inline-flex items-center justify-center rounded-md font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<string, string> = {
  primary: "bg-emerald-600 text-white hover:bg-emerald-700",
  secondary: "bg-white text-slate-900 border border-slate-200 hover:border-emerald-500",
  ghost: "text-slate-600 hover:text-emerald-600"
};

const sizes: Record<string, string> = {
  sm: "px-3 py-1 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-3 text-base"
};

export function Button({ variant = "primary", size = "md", className, ...props }: ButtonProps) {
  return <button className={clsx(base, variants[variant], sizes[size], className)} {...props} />;
}

"use client";

import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "quiet" | "ghost";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const VARIANTS: Record<Variant, string> = {
  primary: "border-transparent bg-accent text-paper-raised hover:bg-accent-soft",
  quiet: "border-line bg-paper-raised text-ink hover:border-ink-faint",
  ghost: "border-transparent bg-transparent text-ink-soft hover:text-ink",
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { className, variant = "quiet", disabled, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40",
        VARIANTS[variant],
        className
      )}
      {...props}
    />
  );
});

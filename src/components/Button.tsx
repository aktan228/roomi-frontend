import { ComponentProps } from "react";

type Variant = "primary" | "secondary";

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<"button"> & { variant?: Variant }) {
  const base =
    "inline-flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-semibold transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50";
  const variants: Record<Variant, string> = {
    primary:
      "bg-coral text-white shadow-lg shadow-coral/30 hover:bg-coral-dark",
    secondary:
      "border border-border bg-background text-foreground hover:bg-card",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props} />
  );
}

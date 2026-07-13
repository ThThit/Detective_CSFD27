import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "ghost" | "danger";
type Size = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary: "border border-[#A86A2A] text-[#A86A2A] bg-transparent hover:bg-[rgba(168,106,42,0.08)]",
  ghost: "border-none text-[#7A6A58] bg-transparent hover:bg-[rgba(122,106,88,0.08)]",
  danger: "border-none bg-[#8b2020] text-[#EDE1C4] hover:bg-[#7a1c1c]",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
};

export function Button({ variant = "primary", size = "md", className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center transition-colors disabled:opacity-50 disabled:pointer-events-none uppercase tracking-[2px]",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      style={{ fontFamily: "'Special Elite', monospace" }}
      {...props}
    />
  );
}

import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children: ReactNode;
};

export function Button({ variant = "primary", className, children, ...props }: ButtonProps) {
  const classList = ["vp-button", `vp-button--${variant}`, className].filter(Boolean).join(" ");

  return (
    <button className={classList} {...props}>
      {children}
    </button>
  );
}

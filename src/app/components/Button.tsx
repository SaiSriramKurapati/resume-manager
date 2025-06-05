import { forwardRef, ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
};

const base = "flex items-center justify-center rounded px-4 py-2 font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

const variants = {
  primary: "bg-blue-500 text-text-inverse hover:bg-blue-600",
  secondary: "bg-gray-200 text-text-secondary hover:bg-gray-300",
  danger: "bg-red-500 text-text-inverse hover:bg-red-600",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className, ...props }, ref) => (
    <button
      ref={ref}
      className={clsx(base, variants[variant], className)}
      {...props}
    />
  )
);

Button.displayName = "Button";
export default Button; 
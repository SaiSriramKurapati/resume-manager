import { forwardRef, SelectHTMLAttributes } from "react";
import clsx from "clsx";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  error?: string;
  label?: string;
};

const base = "w-full rounded backdrop-blur-sm border border-gray-200/50 shadow-sm px-3 py-2 text-text-primary focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-text-muted disabled:cursor-not-allowed";

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, label, children, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-1 text-text-primary">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={clsx(
          base,
          error && "border-red-500 focus:border-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
);

Select.displayName = "Select";

export default Select; 
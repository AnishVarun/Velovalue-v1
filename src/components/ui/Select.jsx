import React from 'react';
import { cn } from '../../utils';
import { ChevronDown } from 'lucide-react';

/**
 * Select component with label and error handling
 */
const Select = React.forwardRef(
  ({ className, children, error, label, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            className={cn(
              "flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-red-500 focus-visible:ring-red-500",
              className
            )}
            ref={ref}
            id={id}
            {...props}
          >
            {children}
          </select>
          <ChevronDown className="absolute right-3 top-3 h-4 w-4 opacity-50" />
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;

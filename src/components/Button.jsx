import React from 'react';
import { cn } from '../utils';

const Button = React.forwardRef(
  ({ className, children, variant = "primary", ...props }, ref) => {
    return (
      <button
        className={cn(
          "button",
          variant === "primary" && "button-primary",
          variant === "secondary" && "button-secondary",
          variant === "outline" && "button-outline",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export default Button;

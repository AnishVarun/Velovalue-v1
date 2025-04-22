import React from 'react';
import { cn } from '../../utils';
import { Loader2 } from 'lucide-react';

/**
 * Button component with multiple variants and states
 */
const Button = React.forwardRef(
  ({ 
    className, 
    children, 
    variant = "primary", 
    size = "default", 
    isLoading = false,
    icon,
    iconPosition = "left",
    disabled,
    ...props 
  }, ref) => {
    // Base button styles
    const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    
    // Size variations
    const sizeStyles = {
      default: "h-10 py-2 px-4",
      sm: "h-9 px-3",
      lg: "h-11 px-8",
      icon: "h-10 w-10",
    };
    
    // Variant styles
    const variantStyles = {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
      destructive: "bg-red-500 text-white hover:bg-red-600",
      success: "bg-green-500 text-white hover:bg-green-600",
    };

    // Icon rendering
    const renderIcon = () => {
      if (!icon) return null;
      return React.cloneElement(icon, { 
        className: cn("h-4 w-4", isLoading && "hidden") 
      });
    };

    return (
      <button
        className={cn(
          baseStyles,
          sizeStyles[size],
          variantStyles[variant],
          isLoading && "relative",
          className
        )}
        disabled={disabled || isLoading}
        ref={ref}
        {...props}
      >
        {isLoading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {icon && iconPosition === "left" && !isLoading && (
          <span className="mr-2">{renderIcon()}</span>
        )}
        {children}
        {icon && iconPosition === "right" && !isLoading && (
          <span className="ml-2">{renderIcon()}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;

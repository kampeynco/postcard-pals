import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  fullPage?: boolean;
  color?: "default" | "primary" | "secondary";
  ariaLabel?: string;
}

export function LoadingSpinner({ 
  className,
  size = "md",
  fullPage = false,
  color = "default",
  ariaLabel = "Loading..."
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16"
  };

  const colorClasses = {
    default: "text-gray-600",
    primary: "text-primary",
    secondary: "text-secondary"
  };

  const spinner = (
    <svg
      className={cn(
        "animate-spin",
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      role="status"
      aria-label={ariaLabel}
      data-testid="loading-spinner"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  if (fullPage) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        role="status"
        aria-label={ariaLabel}
      >
        {spinner}
      </div>
    );
  }

  return spinner;
}
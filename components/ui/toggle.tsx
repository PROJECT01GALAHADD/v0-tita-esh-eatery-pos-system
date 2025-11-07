"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

export const toggleVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-muted text-foreground hover:bg-muted/80",
        outline: "border bg-transparent hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-2",
        sm: "h-8 px-1.5",
        lg: "h-12 px-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ToggleProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof toggleVariants> {}

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        data-slot="toggle"
        data-variant={variant}
        data-size={size}
        className={toggleVariants({ variant, size, className })}
        {...props}
      />
    )
  }
)

Toggle.displayName = "Toggle"


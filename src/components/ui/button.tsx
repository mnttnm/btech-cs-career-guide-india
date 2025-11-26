import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        // Primary - magnetic hover effect (Linear-style)
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm active:scale-[0.98] transition-[transform,box-shadow,background-color] duration-150",

        // Destructive - warning/delete actions
        destructive:
          "bg-destructive text-white shadow-sm hover:bg-destructive/90 hover:shadow-lg hover:shadow-destructive/20 hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm active:scale-[0.98] focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 transition-[transform,box-shadow,background-color] duration-150",

        // Outline - secondary actions with border
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground hover:shadow-sm dark:bg-input/30 dark:border-input dark:hover:bg-input/50 active:scale-[0.98] transition-[transform,box-shadow,background-color] duration-150",

        // Secondary - less prominent actions
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-[0.98] transition-[transform,background-color] duration-150",

        // Subtle - for backgrounds where secondary is too prominent
        subtle:
          "bg-secondary/50 text-secondary-foreground hover:bg-secondary/80 active:scale-[0.98] transition-[transform,background-color] duration-150",

        // Ghost - minimal, just hover background
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 active:scale-[0.98] transition-[transform,background-color] duration-150",

        // Ghost-primary - ghost with primary color on hover (for icon buttons)
        "ghost-primary":
          "hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 active:scale-[0.98] transition-[transform,background-color,color] duration-150",

        // Link - text-only, underline on hover
        link: "text-primary underline-offset-4 hover:underline active:opacity-80 transition-opacity duration-150",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        // Compact - for dense UIs like toolbars
        compact: "h-7 px-2 text-xs rounded gap-1 has-[>svg]:px-1.5",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
        // Compact icon for dense toolbars
        "icon-compact": "size-7",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ButtonProps extends React.ComponentProps<"button">,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          <span className="sr-only">Loading</span>
          {children}
        </>
      ) : (
        children
      )}
    </Comp>
  )
}

export { Button, buttonVariants }

import * as React from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { type MenubarProps } from "./types";

export const menubarVariants = cva(
  "flex h-10 items-center space-x-1 rounded-md border bg-background p-1",
  {
    variants: {
      variant: {
        default: "border-border",
        outline: "border-input",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Menubar = React.forwardRef<HTMLDivElement, MenubarProps>(
  ({ className, variant, ...props }, ref) => (
    <MenubarPrimitive.Root
      ref={ref}
      className={cn(menubarVariants({ variant }), className)}
      {...props}
    />
  )
);
Menubar.displayName = MenubarPrimitive.Root.displayName;

export { Menubar };
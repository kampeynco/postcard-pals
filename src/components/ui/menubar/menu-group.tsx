import * as React from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";

const MenubarGroup = MenubarPrimitive.Group;
const MenubarLabel = MenubarPrimitive.Label;
const MenubarSeparator = MenubarPrimitive.Separator;
const MenubarShortcut = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className="ml-auto text-xs tracking-widest text-muted-foreground"
    {...props}
  />
));
MenubarShortcut.displayName = "MenubarShortcut";

export { MenubarGroup, MenubarLabel, MenubarSeparator, MenubarShortcut };
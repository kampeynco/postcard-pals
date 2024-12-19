import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { ComponentPropsWithoutRef, ElementRef } from "react";

export type DropdownMenuCheckboxItemProps = ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem> & {
  checked?: boolean;
};

export type DropdownMenuRadioItemProps = ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>;

export type DropdownMenuLabelProps = ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean;
};

export type DropdownMenuItemProps = ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean;
};
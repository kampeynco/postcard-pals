import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { menubarVariants } from "./menubar";

export interface MenubarProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: VariantProps<typeof menubarVariants>["variant"];
  defaultValue?: string;
  dir?: "ltr" | "rtl";
}

export interface MenubarMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  trigger: React.ReactNode;
  children: React.ReactNode;
}

export interface MenubarTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  inset?: boolean;
}

export interface MenubarContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "end" | "center";
  alignOffset?: number;
  sideOffset?: number;
  hideWhenDetached?: boolean;
}

export interface MenubarItemProps extends React.HTMLAttributes<HTMLDivElement> {
  inset?: boolean;
  disabled?: boolean;
  onSelect?: (event: React.SyntheticEvent<HTMLDivElement, Event>) => void;
}

export interface MenubarCheckboxItemProps extends MenubarItemProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export interface MenubarRadioItemProps extends MenubarItemProps {
  checked?: boolean;
  value: string;
  onCheckedChange?: (checked: boolean) => void;
}
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { ComponentPropsWithoutRef, HTMLAttributes } from "react"

export type DialogHeaderProps = HTMLAttributes<HTMLDivElement>
export type DialogFooterProps = HTMLAttributes<HTMLDivElement>
export type DialogContentProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
export type DialogTitleProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
export type DialogDescriptionProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
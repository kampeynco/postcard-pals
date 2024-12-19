import * as DialogPrimitive from "@radix-ui/react-dialog"
import { DialogContent } from "./dialog-content"
import { DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "./dialog-parts"

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogClose = DialogPrimitive.Close

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
}
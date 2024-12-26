import { useEffect, useState } from "react";
import { toastStore } from "./store";
import { ToastState, ToasterToast } from "./types";

export function useToast() {
  const [state, setState] = useState<ToastState>(toastStore.memoryState);

  useEffect(() => {
    return toastStore.subscribe(setState);
  }, []);

  return {
    ...state,
    toast: (props: Omit<ToasterToast, "id">) => {
      const id = toastStore.addToast(props);
      return {
        id,
        dismiss: () => toastStore.dismissToast(id),
        update: (props: Partial<ToasterToast>) => toastStore.updateToast(id, props),
      };
    },
    dismiss: toastStore.dismissToast.bind(toastStore),
  };
}

export const toast = {
  success: (message: string) => toastStore.addToast({ title: message, variant: "default" }),
  error: (message: string) => toastStore.addToast({ title: message, variant: "destructive" }),
  info: (message: string) => toastStore.addToast({ title: message }),
  dismiss: toastStore.dismissToast.bind(toastStore),
};
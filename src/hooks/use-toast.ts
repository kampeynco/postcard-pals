import * as React from "react";
import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

type State = {
  toasts: ToasterToast[];
};

let count = 0;
const listeners: Array<(state: State) => void> = [];
let memoryState: State = { toasts: [] };

const genId = () => {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
};

const addToast = (props: Omit<ToasterToast, "id">) => {
  const id = genId();
  const toast = { ...props, id, open: true };
  
  memoryState = {
    ...memoryState,
    toasts: [toast, ...memoryState.toasts].slice(0, TOAST_LIMIT),
  };
  
  listeners.forEach((listener) => {
    listener(memoryState);
  });

  return {
    id,
    dismiss: () => dismissToast(id),
    update: (props: ToasterToast) => updateToast(id, props),
  };
};

const dismissToast = (toastId?: string) => {
  memoryState = {
    ...memoryState,
    toasts: memoryState.toasts.map((t) =>
      (t.id === toastId || toastId === undefined) ? { ...t, open: false } : t
    ),
  };

  listeners.forEach((listener) => {
    listener(memoryState);
  });

  setTimeout(() => {
    memoryState = {
      ...memoryState,
      toasts: toastId === undefined ? [] : memoryState.toasts.filter((t) => t.id !== toastId),
    };
    listeners.forEach((listener) => {
      listener(memoryState);
    });
  }, TOAST_REMOVE_DELAY);
};

const updateToast = (toastId: string, props: Partial<ToasterToast>) => {
  memoryState = {
    ...memoryState,
    toasts: memoryState.toasts.map((t) =>
      t.id === toastId ? { ...t, ...props } : t
    ),
  };

  listeners.forEach((listener) => {
    listener(memoryState);
  });
};

export function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast: addToast,
    dismiss: dismissToast,
  };
}

export const toast = {
  success: (message: string) => addToast({ title: message, variant: "default" }),
  error: (message: string) => addToast({ title: message, variant: "destructive" }),
  info: (message: string) => addToast({ title: message }),
  dismiss: dismissToast,
};
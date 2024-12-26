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

const toastState = {
  count: 0,
  listeners: [] as Array<(state: State) => void>,
  memoryState: { toasts: [] } as State,
};

const genId = () => {
  toastState.count = (toastState.count + 1) % Number.MAX_SAFE_INTEGER;
  return toastState.count.toString();
};

const addToast = (props: Omit<ToasterToast, "id">) => {
  const id = genId();
  const toast = { ...props, id, open: true };
  
  toastState.memoryState = {
    ...toastState.memoryState,
    toasts: [toast, ...toastState.memoryState.toasts].slice(0, TOAST_LIMIT),
  };
  
  toastState.listeners.forEach((listener) => {
    listener(toastState.memoryState);
  });

  return {
    id,
    dismiss: () => dismissToast(id),
    update: (props: ToasterToast) => updateToast(id, props),
  };
};

const dismissToast = (toastId?: string) => {
  toastState.memoryState = {
    ...toastState.memoryState,
    toasts: toastState.memoryState.toasts.map((t) =>
      (t.id === toastId || toastId === undefined) ? { ...t, open: false } : t
    ),
  };

  toastState.listeners.forEach((listener) => {
    listener(toastState.memoryState);
  });

  setTimeout(() => {
    toastState.memoryState = {
      ...toastState.memoryState,
      toasts: toastId === undefined ? [] : toastState.memoryState.toasts.filter((t) => t.id !== toastId),
    };
    toastState.listeners.forEach((listener) => {
      listener(toastState.memoryState);
    });
  }, TOAST_REMOVE_DELAY);
};

const updateToast = (toastId: string, props: Partial<ToasterToast>) => {
  toastState.memoryState = {
    ...toastState.memoryState,
    toasts: toastState.memoryState.toasts.map((t) =>
      t.id === toastId ? { ...t, ...props } : t
    ),
  };

  toastState.listeners.forEach((listener) => {
    listener(toastState.memoryState);
  });
};

export function useToast() {
  const [state, setState] = React.useState<State>(toastState.memoryState);

  React.useEffect(() => {
    toastState.listeners.push(setState);
    return () => {
      const index = toastState.listeners.indexOf(setState);
      if (index > -1) {
        toastState.listeners.splice(index, 1);
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
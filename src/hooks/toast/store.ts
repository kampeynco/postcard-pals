import { ToastState, ToasterToast } from "./types";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

export const toastStore = {
  count: 0,
  listeners: [] as Array<(state: ToastState) => void>,
  memoryState: { toasts: [] } as ToastState,

  subscribe(listener: (state: ToastState) => void) {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  },

  notify() {
    this.listeners.forEach((listener) => {
      listener(this.memoryState);
    });
  },

  genId() {
    this.count = (this.count + 1) % Number.MAX_SAFE_INTEGER;
    return this.count.toString();
  },

  addToast(props: Omit<ToasterToast, "id">) {
    const id = this.genId();
    const toast = { ...props, id, open: true };
    
    this.memoryState = {
      ...this.memoryState,
      toasts: [toast, ...this.memoryState.toasts].slice(0, TOAST_LIMIT),
    };
    
    this.notify();
    return id;
  },

  dismissToast(toastId?: string) {
    this.memoryState = {
      ...this.memoryState,
      toasts: this.memoryState.toasts.map((t) =>
        (t.id === toastId || toastId === undefined) ? { ...t, open: false } : t
      ),
    };

    this.notify();

    setTimeout(() => {
      this.memoryState = {
        ...this.memoryState,
        toasts: toastId === undefined ? [] : this.memoryState.toasts.filter((t) => t.id !== toastId),
      };
      this.notify();
    }, TOAST_REMOVE_DELAY);
  },

  updateToast(toastId: string, props: Partial<ToasterToast>) {
    this.memoryState = {
      ...this.memoryState,
      toasts: this.memoryState.toasts.map((t) =>
        t.id === toastId ? { ...t, ...props } : t
      ),
    };

    this.notify();
  }
};
import { toast } from "sonner";

export const useToastNotifications = () => {
  const showSuccess = (message: string) => {
    toast.success(message);
  };

  const showError = (error: unknown) => {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return {
    showSuccess,
    showError,
  };
};
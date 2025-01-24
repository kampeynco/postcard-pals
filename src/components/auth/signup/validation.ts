import { toast } from 'sonner';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateSignUpForm = (email: string, password: string): ValidationResult => {
  const errors: string[] = [];

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    errors.push('A valid email is required.');
  }

  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long.');
  } else if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter.');
  } else if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number.');
  }

  const isValid = errors.length === 0;

  if (!isValid) {
    toast.error(errors.join(' '));
  }

  return { isValid, errors };
};
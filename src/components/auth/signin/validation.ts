import { toast } from 'sonner';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateAuthForm = (email: string, password: string): ValidationResult => {
  const errors: string[] = [];

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    errors.push('A valid email is required.');
  }
  
  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long.');
  }

  const isValid = errors.length === 0;

  if (!isValid) {
    toast.error(errors.join(' '));
  }

  return { isValid, errors };
};
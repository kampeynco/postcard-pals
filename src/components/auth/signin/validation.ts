import { toast } from 'sonner'; // Importing toast for notifications

export const validateAuthForm = (email: string, password: string): boolean => {
    let isValid = true;
    const errors: string[] = [];

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
        isValid = false;
        errors.push('A valid email is required.');
    }
    if (!password || password.length < 6) {
        isValid = false;
        errors.push('Password must be at least 6 characters long.');
    }

    if (!isValid) {
        toast.error(errors.join(' ')); // Display error messages
    }
    return isValid;
};

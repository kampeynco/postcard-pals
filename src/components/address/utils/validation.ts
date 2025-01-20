import { AddressInput } from "../types";
import { toast } from "sonner";

// Enhancing validation logic for address inputs
export const validateAddress = (address: AddressInput): boolean => {
    const { street, city, state, zip_code: zip } = address;
    let isValid = true;
    const errors: string[] = [];

    if (!street || street.trim() === '') {
        isValid = false;
        errors.push('Street address is required.');
    }
    if (!city || city.trim() === '') {
        isValid = false;
        errors.push('City is required.');
    }
    if (!state || state.trim() === '') {
        isValid = false;
        errors.push('State is required.');
    }
    if (!zip || !/^[0-9]{5}(-[0-9]{4})?$/.test(zip)) {
        isValid = false;
        errors.push('Valid ZIP code is required.');
    }

    if (!isValid) {
        toast.error(errors.join(' ')); // Display error messages
    }
    return isValid;
};
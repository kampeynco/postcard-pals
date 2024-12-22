import { AddressInput } from "../types";
import { toast } from "sonner";

export const validateAddress = (address: AddressInput): boolean => {
  if (!address.street || !address.city || !address.state || !address.zip_code) {
    toast.error("Please fill in all address fields");
    return false;
  }

  if (address.state.length !== 2) {
    toast.error("Please enter a valid 2-letter state code");
    return false;
  }

  if (!/^\d{5}(-\d{4})?$/.test(address.zip_code)) {
    toast.error("Please enter a valid ZIP code (e.g., 12345 or 12345-6789)");
    return false;
  }

  return true;
};
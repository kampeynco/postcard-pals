import { AddressInput } from "../types";
import { toast } from "sonner";

export const validateAddress = (address: AddressInput): boolean => {
  if (!address.street.trim()) {
    toast.error("Please enter a street address");
    return false;
  }

  if (!address.city.trim()) {
    toast.error("Please enter a city");
    return false;
  }

  if (!address.state) {
    toast.error("Please select a state");
    return false;
  }

  if (!/^\d{5}$/.test(address.zip_code)) {
    toast.error("Please enter a valid 5-digit ZIP code");
    return false;
  }

  return true;
};
export interface AddressInput {
  street: string;
  city: string;
  state: string;
  zip_code: string;
}

export interface AddressVerificationProps {
  onVerified: (verifiedAddress: AddressInput) => void;
}
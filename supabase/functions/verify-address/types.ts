export interface AddressVerificationRequest {
  address: {
    street: string;
    city: string;
    state: string;
    zip_code: string;
  }
}

export interface LobVerificationRequest {
  primary_line: string;
  city?: string;
  state?: string;
  zip_code?: string;
}

export interface VerificationResponse {
  is_verified: boolean;
  street: string;
  city: string;
  state: string;
  zip_code: string;
  deliverability: string;
  deliverability_analysis: any;
  lob_confidence: number;
  object: string;
}
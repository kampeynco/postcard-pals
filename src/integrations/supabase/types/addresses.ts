import { Json } from './database';

export interface Address {
  id: string;
  actblue_account_id: string | null;
  lob_id: string;
  address_data: Json;
  is_verified: boolean | null;
  last_verified_at: string | null;
  created_at: string | null;
}

export interface AddressesTable {
  Row: Address;
  Insert: Omit<Address, 'id' | 'created_at'> & {
    id?: string;
    created_at?: string;
  };
  Update: Partial<AddressesTable['Insert']>;
}
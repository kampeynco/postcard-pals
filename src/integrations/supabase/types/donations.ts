import { Json } from './json';

export interface Donation {
  id: string;
  user_id: string | null;
  donation_data: Json;
  source: string | null;
  processed: boolean | null;
  postcard_sent: boolean | null;
  created_at: string | null;
}

export interface DonationsTable {
  Row: Donation;
  Insert: Omit<Donation, 'id' | 'created_at'> & {
    id?: string;
    created_at?: string;
  };
  Update: Partial<DonationsTable['Insert']>;
}
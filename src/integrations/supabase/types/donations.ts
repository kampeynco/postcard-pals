import { Json } from './json';
import { QueueStatus } from './enums';

export interface Donation {
  id: string;
  user_id: string | null;
  donation_data: Json;
  source: string | null;
  processed: boolean | null;
  postcard_sent: boolean | null;
  created_at: string | null;
  queue_status: QueueStatus | null;
  queue_date: string | null;
  processing_attempts: number | null;
  last_attempt_at: string | null;
  error_message: string | null;
  timezone: string | null;
}

export interface DonationsTable {
  Row: Donation;
  Insert: Omit<Donation, 'id' | 'created_at'> & {
    id?: string;
    created_at?: string;
  };
  Update: Partial<DonationsTable['Insert']>;
}
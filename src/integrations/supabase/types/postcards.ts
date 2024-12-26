import { PostcardStatus } from './enums';

export interface Postcard {
  id: string;
  user_id: string;
  donation_id: string;
  template_id: string;
  lob_id: string;
  lob_webhook_id: string | null;
  tracking_number: string | null;
  status: PostcardStatus | null;
  expected_delivery_date: string | null;
  created_at: string | null;
}

export interface PostcardsTable {
  Row: Postcard;
  Insert: Omit<Postcard, 'id' | 'created_at'> & {
    id?: string;
    created_at?: string;
  };
  Update: Partial<PostcardsTable['Insert']>;
}
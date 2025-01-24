import { Json } from './json';

export interface WebhookLog {
  id: string;
  webhook_type: string;
  payload: Json;
  status: string;
  error_message: string | null;
  created_at: string | null;
  retry_count: number | null;
  last_retry_at: string | null;
}

export interface WebhookLogsTable {
  Row: WebhookLog;
  Insert: Omit<WebhookLog, 'id' | 'created_at'> & {
    id?: string;
    created_at?: string;
  };
  Update: Partial<WebhookLogsTable['Insert']>;
}
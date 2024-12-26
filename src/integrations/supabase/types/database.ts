export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

import { ActBlueAccountsTable } from './actblue';
import { AddressesTable } from './addresses';
import { DonationsTable } from './donations';
import { PostcardsTable } from './postcards';
import { ProfilesTable } from './profile';
import { TemplatesTable, DefaultTemplatesTable } from './templates';
import { WebhookLogsTable } from './webhooks';
import { CommitteeType, PostcardStatus } from './enums';

export interface Database {
  public: {
    Tables: {
      actblue_accounts: ActBlueAccountsTable;
      addresses: AddressesTable;
      donations: DonationsTable;
      postcards: PostcardsTable;
      profiles: ProfilesTable;
      templates: TemplatesTable;
      default_templates: DefaultTemplatesTable;
      webhook_logs: WebhookLogsTable;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      committee_type: CommitteeType;
      postcard_status: PostcardStatus;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
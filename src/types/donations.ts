import { Database } from "@/integrations/supabase/types";

export type Donation = Database['public']['Tables']['donations']['Row'];
export type Postcard = Database['public']['Tables']['postcards']['Row'];

export interface DonationActivity extends Omit<Donation, 'donation_data'> {
  donation_data: {
    amount: number;
    donor_name: string;
  };
}

export interface Stats {
  totalDonations: number;
  activeTemplates: number;
  failedPostcards: number;
  lastMonthDonations: number;
  lastMonthTemplates: number;
  lastMonthFailures: number;
}
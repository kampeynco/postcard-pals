import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, createSupabaseClient, verifyAddress, updateDonationStatus } from "./utils.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createSupabaseClient();

    const { data: donations, error: fetchError } = await supabase
      .from('donations')
      .select('*')
      .eq('queue_status', 'pending_verification')
      .order('created_at')
      .limit(50);

    if (fetchError) {
      throw new Error(`Failed to fetch donations: ${fetchError.message}`);
    }

    console.log(`Processing ${donations?.length ?? 0} donations for address verification`);

    const results = [];
    for (const donation of donations ?? []) {
      try {
        const address = donation.donation_data?.donor?.address;
        if (!address) {
          throw new Error('No address data found');
        }

        const verificationData = await verifyAddress(address);
        
        if (!verificationData.id) {
          throw new Error(`Address verification failed: ${verificationData.error?.message}`);
        }

        await updateDonationStatus(supabase, donation, 'verification_complete');
        results.push({ id: donation.id, status: 'success' });
      } catch (error) {
        console.error(`Error processing donation ${donation.id}:`, error);
        await updateDonationStatus(supabase, donation, 'verification_failed', error.message);
        results.push({ id: donation.id, status: 'error', message: error.message });
      }
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Queue processing error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
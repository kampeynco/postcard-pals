import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { 
  corsHeaders, 
  createSupabaseClient, 
  createPostcard, 
  savePostcardRecord, 
  updateDonationStatus 
} from "./utils.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createSupabaseClient();

    const { data: donations, error: fetchError } = await supabase
      .from('donations')
      .select(`
        *,
        actblue_accounts!inner(*)
      `)
      .eq('queue_status', 'verification_complete')
      .order('created_at')
      .limit(25);

    if (fetchError) {
      throw new Error(`Failed to fetch donations: ${fetchError.message}`);
    }

    console.log(`Processing ${donations?.length ?? 0} donations for postcard creation`);

    const results = [];
    for (const donation of donations ?? []) {
      try {
        const { data: template, error: templateError } = await supabase
          .from('default_templates')
          .select('*')
          .eq('user_id', donation.user_id)
          .eq('is_active', true)
          .single();

        if (templateError) {
          throw new Error(`Failed to fetch template: ${templateError.message}`);
        }

        const postcardData = await createPostcard(donation, template);
        
        if (!postcardData.id) {
          throw new Error(`Failed to create postcard: ${postcardData.error?.message}`);
        }

        const { error: postcardError } = await savePostcardRecord(supabase, {
          userId: donation.user_id,
          donationId: donation.id,
          templateId: template.id,
          lobId: postcardData.id,
          expectedDeliveryDate: postcardData.expected_delivery_date
        });

        if (postcardError) {
          throw new Error(`Failed to save postcard record: ${postcardError.message}`);
        }

        await updateDonationStatus(supabase, donation, 'processing_complete');
        results.push({ id: donation.id, status: 'success' });
      } catch (error) {
        console.error(`Error processing donation ${donation.id}:`, error);
        await updateDonationStatus(supabase, donation, 'failed', error.message);
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
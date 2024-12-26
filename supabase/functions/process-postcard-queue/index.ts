import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { format, addDays } from 'https://esm.sh/date-fns@3.3.1'
import { zonedTimeToUtc, utcToZonedTime } from 'https://esm.sh/date-fns-tz@2.0.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get verified donations ready for postcard creation
    const { data: donations, error: fetchError } = await supabase
      .from('donations')
      .select(`
        *,
        actblue_accounts!inner(*)
      `)
      .eq('queue_status', 'verification_complete')
      .order('created_at')
      .limit(25) // Process in smaller batches due to Lob API rate limits

    if (fetchError) {
      throw new Error(`Failed to fetch donations: ${fetchError.message}`)
    }

    console.log(`Processing ${donations?.length ?? 0} donations for postcard creation`)

    const results = []
    for (const donation of donations ?? []) {
      try {
        // Get default template for the user
        const { data: template, error: templateError } = await supabase
          .from('default_templates')
          .select('*')
          .eq('user_id', donation.user_id)
          .eq('is_active', true)
          .single()

        if (templateError) {
          throw new Error(`Failed to fetch template: ${templateError.message}`)
        }

        // Create postcard using Lob API
        const postcardResponse = await fetch('https://api.lob.com/v1/postcards', {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${btoa(Deno.env.get('LOB_API_KEY') + ':')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            description: `Thank you postcard for donation ${donation.id}`,
            to: donation.donation_data.donor.address,
            from: {
              name: donation.actblue_accounts.committee_name,
              address_line1: donation.actblue_accounts.street_address,
              address_city: donation.actblue_accounts.city,
              address_state: donation.actblue_accounts.state,
              address_zip: donation.actblue_accounts.zip_code
            },
            front: template.front_image_url,
            back: template.back_message,
            size: '4x6'
          }),
        })

        const postcardData = await postcardResponse.json()
        
        if (!postcardResponse.ok) {
          throw new Error(`Failed to create postcard: ${postcardData.error?.message}`)
        }

        // Create postcard record
        const { error: postcardError } = await supabase
          .from('postcards')
          .insert({
            user_id: donation.user_id,
            donation_id: donation.id,
            template_id: template.id,
            lob_id: postcardData.id,
            status: 'pending',
            expected_delivery_date: postcardData.expected_delivery_date
          })

        if (postcardError) {
          throw new Error(`Failed to save postcard record: ${postcardError.message}`)
        }

        // Update donation status
        const { error: updateError } = await supabase
          .from('donations')
          .update({
            queue_status: 'processing_complete',
            postcard_sent: true,
            processing_attempts: donation.processing_attempts + 1,
            last_attempt_at: new Date().toISOString()
          })
          .eq('id', donation.id)

        if (updateError) {
          throw new Error(`Failed to update donation: ${updateError.message}`)
        }

        results.push({ id: donation.id, status: 'success' })
      } catch (error) {
        console.error(`Error processing donation ${donation.id}:`, error)
        
        // Update donation with error status
        await supabase
          .from('donations')
          .update({
            queue_status: 'failed',
            processing_attempts: donation.processing_attempts + 1,
            last_attempt_at: new Date().toISOString(),
            error_message: error.message
          })
          .eq('id', donation.id)

        results.push({ id: donation.id, status: 'error', message: error.message })
      }
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Queue processing error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
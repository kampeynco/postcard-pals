import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { format, addDays, isSameDay } from 'https://esm.sh/date-fns@3.3.1'
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

    // Get donations that need address verification
    const { data: donations, error: fetchError } = await supabase
      .from('donations')
      .select('*')
      .eq('queue_status', 'pending_verification')
      .order('created_at')
      .limit(50) // Process in batches

    if (fetchError) {
      throw new Error(`Failed to fetch donations: ${fetchError.message}`)
    }

    console.log(`Processing ${donations?.length ?? 0} donations for address verification`)

    const results = []
    for (const donation of donations ?? []) {
      try {
        const address = donation.donation_data?.donor?.address
        if (!address) {
          throw new Error('No address data found')
        }

        // Verify address using Lob API
        const verificationResponse = await fetch('https://api.lob.com/v1/us_verifications', {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${btoa(Deno.env.get('LOB_API_KEY') + ':')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            primary_line: address.street,
            city: address.city,
            state: address.state,
            zip_code: address.zip_code,
          }),
        })

        const verificationData = await verificationResponse.json()
        
        if (!verificationResponse.ok) {
          throw new Error(`Address verification failed: ${verificationData.error?.message}`)
        }

        // Update donation status based on verification result
        const { error: updateError } = await supabase
          .from('donations')
          .update({
            queue_status: 'verification_complete',
            processing_attempts: donation.processing_attempts + 1,
            last_attempt_at: new Date().toISOString(),
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
            queue_status: 'verification_failed',
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
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { getLobClient } from '../_shared/lob-client.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { postcardId } = await req.json()
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the failed postcard details
    const { data: postcard, error: fetchError } = await supabase
      .from('postcards')
      .select('*, templates(*), donations(*)')
      .eq('id', postcardId)
      .single()

    if (fetchError) throw fetchError

    // Retry sending the postcard
    const lob = getLobClient()
    const newPostcard = await lob.postcards.create({
      description: `Retry: Postcard for donation ${postcard.donation_id}`,
      to: postcard.donations.donation_data.address,
      from: postcard.template_data.from_address,
      front: postcard.templates.template_data.front_html,
      back: postcard.templates.template_data.back_html,
      size: '4x6'
    })

    // Update the postcard record
    const { error: updateError } = await supabase
      .from('postcards')
      .update({
        lob_id: newPostcard.id,
        status: 'pending',
        tracking_number: null,
        expected_delivery_date: newPostcard.expected_delivery_date
      })
      .eq('id', postcardId)

    if (updateError) throw updateError

    // Log the retry attempt
    await supabase
      .from('webhook_logs')
      .insert({
        webhook_type: 'postcard_retry',
        payload: { original_id: postcardId, new_lob_id: newPostcard.id },
        status: 'success'
      })

    return new Response(
      JSON.stringify({ success: true, postcard: newPostcard }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
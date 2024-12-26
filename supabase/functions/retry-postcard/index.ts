import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from '@supabase/supabase-js'
import { corsHeaders } from '../_shared/cors.ts'
import { createLobClient } from '../_shared/lob-client.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { postcardId } = await req.json()
    
    if (!postcardId) {
      return new Response(
        JSON.stringify({ error: 'Postcard ID is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get failed postcard data
    const { data: postcard, error: postcardError } = await supabase
      .from('postcards')
      .select(`
        *,
        donations (
          donation_data
        ),
        templates (
          template_data
        )
      `)
      .eq('id', postcardId)
      .single()

    if (postcardError) throw postcardError

    const lob = createLobClient()
    
    // Retry sending postcard
    const newPostcard = await lob.postcards.create({
      description: `Retry: Thank you postcard for donation ${postcard.donation_id}`,
      to: {
        name: postcard.donations.donation_data.donor_name,
        address_line1: postcard.donations.donation_data.address.street,
        address_city: postcard.donations.donation_data.address.city,
        address_state: postcard.donations.donation_data.address.state,
        address_zip: postcard.donations.donation_data.address.zip_code
      },
      front: postcard.templates.template_data.front_html,
      back: postcard.templates.template_data.back_html,
      size: '4x6'
    })

    // Update postcard status
    const { error: updateError } = await supabase
      .from('postcards')
      .update({
        lob_id: newPostcard.id,
        status: 'in_transit',
        expected_delivery_date: newPostcard.expected_delivery_date,
        tracking_number: newPostcard.tracking_number
      })
      .eq('id', postcardId)

    if (updateError) throw updateError

    return new Response(
      JSON.stringify({ 
        success: true,
        postcard_id: newPostcard.id,
        tracking_number: newPostcard.tracking_number,
        expected_delivery_date: newPostcard.expected_delivery_date
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
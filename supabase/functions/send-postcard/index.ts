import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from '@supabase/supabase-js'
import { corsHeaders } from '../_shared/cors.ts'
import { createLobClient } from '../_shared/lob-client.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { postcardData } = await req.json()
    
    if (!postcardData) {
      return new Response(
        JSON.stringify({ error: 'Postcard data is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const lob = createLobClient()
    
    const postcard = await lob.postcards.create({
      description: `Thank you postcard for donation ${postcardData.donationId}`,
      to: {
        name: postcardData.recipientName,
        address_line1: postcardData.recipientAddress.street,
        address_city: postcardData.recipientAddress.city,
        address_state: postcardData.recipientAddress.state,
        address_zip: postcardData.recipientAddress.zip_code
      },
      front: postcardData.frontHtml,
      back: postcardData.backHtml,
      size: '4x6'
    })

    // Update postcard status in database
    const { error: updateError } = await supabase
      .from('postcards')
      .update({
        lob_id: postcard.id,
        status: 'in_transit',
        expected_delivery_date: postcard.expected_delivery_date,
        tracking_number: postcard.tracking_number
      })
      .eq('id', postcardData.postcardId)

    if (updateError) throw updateError

    return new Response(
      JSON.stringify({ 
        success: true,
        postcard_id: postcard.id,
        tracking_number: postcard.tracking_number,
        expected_delivery_date: postcard.expected_delivery_date
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
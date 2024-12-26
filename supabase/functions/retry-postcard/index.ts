import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { postcard_id } = await req.json()
    console.log('Retrying postcard:', postcard_id)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get postcard data
    const { data: postcard, error: postcardError } = await supabase
      .from('postcards')
      .select('*, donations(*), templates(*)')
      .eq('id', postcard_id)
      .single()

    if (postcardError) {
      throw new Error(`Failed to fetch postcard: ${postcardError.message}`)
    }

    // Create new postcard using Lob API
    const lobApiKey = Deno.env.get('LOB_API_KEY')
    if (!lobApiKey) {
      throw new Error('LOB_API_KEY is not set')
    }

    const postcardResponse = await fetch('https://api.lob.com/v1/postcards', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(lobApiKey + ':')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description: `Retry: Thank you postcard for donation ${postcard.donation_id}`,
        to: postcard.donations.donation_data.address,
        from: postcard.templates.template_data.from_address,
        front: postcard.templates.template_data.front_html,
        back: postcard.templates.template_data.back_html,
        size: '4x6',
      }),
    })

    const postcardData = await postcardResponse.json()
    console.log('Lob API response:', postcardData)

    if (!postcardResponse.ok) {
      throw new Error(`Failed to create postcard: ${postcardData.error.message}`)
    }

    // Update postcard record
    const { error: updateError } = await supabase
      .from('postcards')
      .update({
        lob_id: postcardData.id,
        status: 'pending',
        expected_delivery_date: postcardData.expected_delivery_date,
      })
      .eq('id', postcard_id)

    if (updateError) {
      throw new Error(`Failed to update postcard record: ${updateError.message}`)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: postcardData 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error retrying postcard:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
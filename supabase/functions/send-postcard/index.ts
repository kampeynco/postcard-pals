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
    const { donation_id, template_id, to_address, from_address } = await req.json()
    console.log('Sending postcard for donation:', donation_id)

    const lobApiKey = Deno.env.get('LOB_API_KEY')
    if (!lobApiKey) {
      throw new Error('LOB_API_KEY is not set')
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get template data
    const { data: template, error: templateError } = await supabase
      .from('templates')
      .select('*')
      .eq('id', template_id)
      .single()

    if (templateError) {
      throw new Error(`Failed to fetch template: ${templateError.message}`)
    }

    // Create postcard using Lob API
    const postcardResponse = await fetch('https://api.lob.com/v1/postcards', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(lobApiKey + ':')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description: `Thank you postcard for donation ${donation_id}`,
        to: to_address,
        from: from_address,
        front: template.template_data.front_html,
        back: template.template_data.back_html,
        size: '4x6',
      }),
    })

    const postcardData = await postcardResponse.json()
    console.log('Lob API response:', postcardData)

    if (!postcardResponse.ok) {
      throw new Error(`Failed to create postcard: ${postcardData.error.message}`)
    }

    // Save postcard record
    const { data: postcard, error: postcardError } = await supabase
      .from('postcards')
      .insert({
        donation_id,
        template_id,
        lob_id: postcardData.id,
        status: 'pending',
        expected_delivery_date: postcardData.expected_delivery_date,
      })
      .select()
      .single()

    if (postcardError) {
      throw new Error(`Failed to save postcard record: ${postcardError.message}`)
    }

    // Update donation status
    const { error: donationError } = await supabase
      .from('donations')
      .update({ postcard_sent: true })
      .eq('id', donation_id)

    if (donationError) {
      throw new Error(`Failed to update donation status: ${donationError.message}`)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: postcard 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error sending postcard:', error)
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
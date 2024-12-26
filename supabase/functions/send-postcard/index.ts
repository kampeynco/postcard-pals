import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { getLobClient } from '../_shared/lob-client.ts'
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
    const { templateId, donationId, toAddress, fromAddress } = await req.json()
    const lob = getLobClient()
    
    console.log('Sending postcard:', { templateId, donationId, toAddress })
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: template, error: templateError } = await supabase
      .from('templates')
      .select('template_data')
      .eq('id', templateId)
      .single()

    if (templateError) throw templateError

    const postcard = await lob.createPostcard({
      description: `Postcard for donation ${donationId}`,
      to: toAddress,
      from: fromAddress,
      front: template.template_data.front_html,
      back: template.template_data.back_html,
      size: '4x6'
    })

    console.log('Postcard created:', postcard)

    const { data: savedPostcard, error: dbError } = await supabase
      .from('postcards')
      .insert({
        donation_id: donationId,
        template_id: templateId,
        lob_id: postcard.id,
        status: 'pending',
        expected_delivery_date: postcard.expected_delivery_date,
        user_id: (await req.json()).user_id
      })
      .select()
      .single()

    if (dbError) throw dbError

    return new Response(
      JSON.stringify(savedPostcard),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
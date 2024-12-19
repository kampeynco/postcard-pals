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
    const { address } = await req.json()
    const lob = getLobClient()
    
    console.log('Verifying address:', address)
    
    const verificationResult = await lob.usVerifications.verify({
      primary_line: address.street,
      city: address.city,
      state: address.state,
      zip_code: address.zipCode
    })

    console.log('Verification result:', verificationResult)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: savedAddress, error: dbError } = await supabase
      .from('addresses')
      .insert({
        address_data: verificationResult,
        lob_id: verificationResult.id,
        is_verified: verificationResult.deliverability !== 'undeliverable'
      })
      .select()
      .single()

    if (dbError) throw dbError

    return new Response(
      JSON.stringify(savedAddress),
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
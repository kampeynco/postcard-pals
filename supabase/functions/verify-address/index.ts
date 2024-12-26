import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from '@supabase/supabase-js'
import { corsHeaders } from '../_shared/cors.ts'
import { createLobClient } from '../_shared/lob-client.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { address } = await req.json()
    
    if (!address) {
      return new Response(
        JSON.stringify({ error: 'Address data is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const lob = createLobClient()
    
    const verificationResult = await lob.usVerifications.verify({
      primary_line: address.street,
      city: address.city,
      state: address.state,
      zip_code: address.zip_code
    })

    return new Response(
      JSON.stringify({
        is_verified: verificationResult.deliverability === 'deliverable',
        deliverability: verificationResult.deliverability,
        ...verificationResult.components
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
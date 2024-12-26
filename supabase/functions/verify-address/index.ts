import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { address } = await req.json()
    console.log('Verifying address:', address)

    const lobApiKey = Deno.env.get('LOB_API_KEY')
    if (!lobApiKey) {
      throw new Error('LOB_API_KEY is not set')
    }

    // Verify address using Lob API
    const verificationResponse = await fetch('https://api.lob.com/v1/us_verifications', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(lobApiKey + ':')}`,
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
    console.log('Verification response:', verificationData)

    if (!verificationResponse.ok) {
      throw new Error(`Address verification failed: ${verificationData.error.message}`)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: verificationData 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error verifying address:', error)
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
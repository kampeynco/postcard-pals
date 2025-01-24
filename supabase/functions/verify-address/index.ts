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
    const { address } = await req.json()
    console.log('Verifying address:', address)

    const lobApiKey = Deno.env.get('LOB_API_KEY')
    if (!lobApiKey) {
      throw new Error('LOB_API_KEY is not set')
    }

    const verificationRequest = {
      primary_line: address.street,
      city: address.city,
      state: address.state,
      zip_code: address.zip_code,
    }

    console.log('Sending verification request to Lob:', verificationRequest)

    const verificationResponse = await fetch('https://api.lob.com/v1/us_verifications', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(lobApiKey + ':')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(verificationRequest),
    })

    const verificationData = await verificationResponse.json()
    console.log('Lob verification response:', verificationData)

    if (!verificationResponse.ok) {
      return new Response(
        JSON.stringify({
          success: false,
          error: {
            message: verificationData.error.message || 'Address verification failed',
            details: verificationData.error
          }
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: verificationResponse.status,
        }
      )
    }

    const isDeliverable = ['deliverable', 'deliverable_unnecessary_unit', 'deliverable_incorrect_unit', 'deliverable_missing_unit'].includes(verificationData.deliverability)

    return new Response(
      JSON.stringify({
        success: true,
        is_verified: isDeliverable,
        deliverability: verificationData.deliverability,
        deliverability_analysis: verificationData.deliverability_analysis,
        street: verificationData.primary_line,
        city: verificationData.components.city,
        state: verificationData.components.state_abbreviation, // Using state abbreviation instead of full name
        zip_code: verificationData.components.zip_code,
        lob_id: verificationData.id,
        confidence: verificationData.lob_confidence_score,
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
        error: {
          message: error.message || 'Internal server error',
          details: error
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
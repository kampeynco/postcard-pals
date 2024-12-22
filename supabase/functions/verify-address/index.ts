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
    console.log('Received address for verification:', address)
    
    if (!address || !address.street || !address.city || !address.state || !address.zip_code) {
      throw new Error('Missing required address fields')
    }

    const lob = getLobClient()
    
    try {
      const verificationResult = await lob.usVerifications.verify({
        primary_line: address.street,
        city: address.city,
        state: address.state,
        zip_code: address.zip_code
      })

      console.log('Lob verification result:', verificationResult)

      // Get auth user from the request
      const authHeader = req.headers.get('Authorization')
      if (!authHeader) {
        throw new Error('No authorization header')
      }

      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      // Extract the JWT token
      const token = authHeader.replace('Bearer ', '')
      const { data: { user }, error: authError } = await supabase.auth.getUser(token)
      
      if (authError || !user) {
        throw new Error('Authentication failed')
      }

      // Store verification result
      const { data: savedAddress, error: dbError } = await supabase
        .from('addresses')
        .insert({
          address_data: verificationResult,
          lob_id: verificationResult.id,
          is_verified: verificationResult.deliverability !== 'undeliverable',
          user_id: user.id,
          last_verified_at: new Date().toISOString()
        })
        .select()
        .single()

      if (dbError) {
        console.error('Database error:', dbError)
        throw new Error('Failed to save address verification result')
      }

      const response = {
        is_verified: verificationResult.deliverability !== 'undeliverable',
        street: verificationResult.primary_line,
        city: verificationResult.components.city,
        state: verificationResult.components.state,
        zip_code: verificationResult.components.zip_code,
        deliverability: verificationResult.deliverability,
        ...savedAddress
      }

      return new Response(
        JSON.stringify(response),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } catch (lobError) {
      console.error('Lob API error:', lobError)
      throw new Error(`Address verification failed: ${lobError.message}`)
    }
  } catch (error) {
    console.error('Error in verify-address function:', error)
    return new Response(
      JSON.stringify({ 
        error: {
          message: error.message || 'Address verification failed',
          details: error.details || null
        }
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
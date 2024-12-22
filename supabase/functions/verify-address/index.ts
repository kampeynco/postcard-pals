import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { getLobClient } from '../_shared/lob-client.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json'
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get the request body
    const requestBody = await req.text();
    console.log('Raw request body:', requestBody);

    if (!requestBody) {
      throw new Error('Request body is empty');
    }

    // Parse the JSON body
    let { address } = JSON.parse(requestBody);
    console.log('Parsed address:', address);

    if (!address || !address.street || !address.city || !address.state || !address.zip_code) {
      throw new Error('Missing required address fields');
    }

    // Get auth user from the request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Extract the JWT token
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      console.error('Auth error:', authError)
      throw new Error('Authentication failed')
    }

    const lob = getLobClient()
    
    try {
      // Format the verification request according to Lob's API requirements
      const verificationRequest = {
        primary_line: address.street,
        city: address.city,
        state: address.state,
        zip_code: address.zip_code,
        address_format: 'us' // Explicitly specify US format
      };

      console.log('Attempting Lob verification with:', verificationRequest);

      const verificationResult = await lob.usVerifications.verify(verificationRequest);

      console.log('Lob verification result:', verificationResult);

      // Check deliverability status
      const isDeliverable = ['deliverable', 'deliverable_unnecessary_unit', 'deliverable_incorrect_unit', 'deliverable_missing_unit'].includes(verificationResult.deliverability);

      // Store verification result
      const { data: savedAddress, error: dbError } = await supabase
        .from('addresses')
        .insert({
          address_data: verificationResult,
          lob_id: verificationResult.id,
          is_verified: isDeliverable,
          user_id: user.id,
          last_verified_at: new Date().toISOString()
        })
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error('Failed to save address verification result');
      }

      // Format the response according to Lob's verified components
      const response = {
        is_verified: isDeliverable,
        street: verificationResult.primary_line,
        city: verificationResult.components.city,
        state: verificationResult.components.state,
        zip_code: verificationResult.components.zip_code,
        deliverability: verificationResult.deliverability,
        deliverability_analysis: verificationResult.deliverability_analysis,
        lob_confidence: verificationResult.lob_confidence,
        object: verificationResult.object,
        ...savedAddress
      };

      return new Response(
        JSON.stringify(response),
        { headers: corsHeaders }
      );
    } catch (lobError) {
      console.error('Lob API error:', lobError);
      // Handle specific Lob API errors
      const errorMessage = lobError.status_code ? 
        `Lob API Error (${lobError.status_code}): ${lobError.message}` :
        `Address verification failed: ${lobError.message}`;
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error('Error in verify-address function:', error);
    return new Response(
      JSON.stringify({ 
        error: {
          message: error.message || 'Address verification failed',
          details: error.details || null
        }
      }),
      { 
        status: 400,
        headers: corsHeaders
      }
    );
  }
});
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AddressVerificationRequest {
  address: {
    street: string;
    city: string;
    state: string;
    zip_code: string;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('🔵 [1] Verification request received');
    
    // Get the request body
    const requestBody = await req.text();
    console.log('🔵 [2] Raw request body:', requestBody);

    if (!requestBody) {
      console.error('🔴 Request body is empty');
      throw new Error('Request body is empty');
    }

    // Parse the JSON body
    const { address } = JSON.parse(requestBody) as AddressVerificationRequest;
    console.log('🔵 [3] Parsed address:', address);

    if (!address || !address.street) {
      console.error('🔴 Missing required address fields');
      throw new Error('Missing required address fields');
    }

    // Get auth user from the request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error('🔴 No authorization header');
      throw new Error('No authorization header');
    }
    console.log('🔵 [4] Authorization header present');

    // Format verification request based on available data
    let verificationRequest;
    
    // First attempt: Try with city and state if available
    if (address.city?.trim() && address.state?.trim()) {
      console.log('🔵 [5a] Attempting verification with city/state');
      verificationRequest = {
        primary_line: address.street.trim(),
        city: address.city.trim(),
        state: address.state.trim()
      };
    } 
    // Second attempt: Fall back to zip code
    else if (address.zip_code?.trim()) {
      console.log('🔵 [5b] Attempting verification with zip code');
      verificationRequest = {
        primary_line: address.street.trim(),
        zip_code: address.zip_code.trim()
      };
    } else {
      console.error('🔴 Must provide either city/state or zip code');
      throw new Error('Must provide either city/state or zip code');
    }

    console.log('🔵 [6] Verification request:', verificationRequest);

    // Call Lob API
    const lobApiKey = Deno.env.get('LOB_TEST_SECRET_KEY');
    if (!lobApiKey) {
      console.error('🔴 Lob API key not found');
      throw new Error('Lob API key not found');
    }
    console.log('🔵 [7] Lob API key found');

    const lobResponse = await fetch('https://api.lob.com/v1/us_verifications', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(lobApiKey + ':')}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(verificationRequest)
    });

    console.log('🔵 [8] Lob API response status:', lobResponse.status);

    if (!lobResponse.ok) {
      const errorText = await lobResponse.text();
      console.error('🔴 Lob API error response:', errorText);
      throw new Error(`Lob API error: ${lobResponse.status} - ${errorText}`);
    }

    const verificationResult = await lobResponse.json();
    console.log('🔵 [9] Lob verification result:', verificationResult);

    // Check deliverability status
    const isDeliverable = [
      'deliverable',
      'deliverable_unnecessary_unit',
      'deliverable_incorrect_unit',
      'deliverable_missing_unit'
    ].includes(verificationResult.deliverability);

    console.log('🔵 [10] Deliverability status:', {
      status: verificationResult.deliverability,
      isDeliverable
    });

    // Format the response
    const response = {
      is_verified: isDeliverable,
      street: verificationResult.primary_line,
      city: verificationResult.components.city,
      state: verificationResult.components.state,
      zip_code: verificationResult.components.zip_code,
      deliverability: verificationResult.deliverability,
      deliverability_analysis: verificationResult.deliverability_analysis,
      lob_confidence: verificationResult.lob_confidence_score,
      object: verificationResult.object
    };

    console.log('🔵 [11] Sending response:', response);

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('🔴 Error in verify-address function:', error);
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
    );
  }
});
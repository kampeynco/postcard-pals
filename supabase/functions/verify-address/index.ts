import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders, formatVerificationRequest, isDeliverableAddress, verifyWithLobApi } from './utils.ts';
import { AddressVerificationRequest, VerificationResponse } from './types.ts';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔵 [1] Verification request received');
    
    // Get and validate request body
    const requestBody = await req.text();
    console.log('🔵 [2] Raw request body:', requestBody);

    if (!requestBody) {
      console.error('🔴 Request body is empty');
      throw new Error('Request body is empty');
    }

    // Parse and validate address
    const { address } = JSON.parse(requestBody) as AddressVerificationRequest;
    console.log('🔵 [3] Parsed address:', address);

    if (!address || !address.street) {
      console.error('🔴 Missing required address fields');
      throw new Error('Missing required address fields');
    }

    // Validate auth header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error('🔴 No authorization header');
      throw new Error('No authorization header');
    }
    console.log('🔵 [4] Authorization header present');

    // Format verification request
    const verificationRequest = formatVerificationRequest(
      address.street,
      address.city,
      address.state,
      address.zip_code
    );
    console.log('🔵 [5] Verification request:', verificationRequest);

    // Call Lob API and get verification result
    const lobResponse = await verifyWithLobApi(verificationRequest);
    const verificationResult = await lobResponse.json();
    console.log('🔵 [6] Lob verification result:', verificationResult);

    // Check deliverability and prepare response
    const isDeliverable = isDeliverableAddress(verificationResult.deliverability);
    console.log('🔵 [7] Deliverability status:', {
      status: verificationResult.deliverability,
      isDeliverable
    });

    const response: VerificationResponse = {
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

    console.log('🔵 [8] Sending response:', response);

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
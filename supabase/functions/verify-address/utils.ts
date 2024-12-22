import { LobVerificationRequest } from "./types.ts";

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export function formatVerificationRequest(street: string, city?: string, state?: string, zip_code?: string): LobVerificationRequest {
  const request: LobVerificationRequest = {
    primary_line: street.trim(),
  };

  if (city?.trim() && state?.trim()) {
    console.log('🔵 Using city/state verification strategy');
    request.city = city.trim();
    request.state = state.trim();
  } else if (zip_code?.trim()) {
    console.log('🔵 Using zip code verification strategy');
    request.zip_code = zip_code.trim();
  }

  return request;
}

export function isDeliverableAddress(deliverability: string): boolean {
  return [
    'deliverable',
    'deliverable_unnecessary_unit',
    'deliverable_incorrect_unit',
    'deliverable_missing_unit'
  ].includes(deliverability);
}

export async function verifyWithLobApi(verificationRequest: LobVerificationRequest): Promise<Response> {
  const lobApiKey = Deno.env.get('LOB_TEST_SECRET_KEY');
  if (!lobApiKey) {
    console.error('🔴 Lob API key not found');
    throw new Error('Lob API key not found');
  }
  console.log('🔵 Lob API key found');

  const response = await fetch('https://api.lob.com/v1/us_verifications', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(lobApiKey + ':')}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(verificationRequest)
  });

  console.log('🔵 Lob API response status:', response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('🔴 Lob API error response:', errorText);
    throw new Error(`Lob API error: ${response.status} - ${errorText}`);
  }

  return response;
}
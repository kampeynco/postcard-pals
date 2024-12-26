// Helper to make API requests to Lob
export const getLobClient = () => {
  const lobApiKey = Deno.env.get('LOB_API_KEY');
  if (!lobApiKey) {
    throw new Error('LOB_API_KEY is not set');
  }

  const headers = {
    'Authorization': `Basic ${btoa(lobApiKey + ':')}`,
    'Content-Type': 'application/json'
  };

  const baseUrl = 'https://api.lob.com/v1';

  return {
    async verifyAddress(address: {
      primary_line?: string;
      secondary_line?: string;
      city?: string;
      state?: string;
      zip_code?: string;
    }) {
      console.log('Verifying address:', address);
      const response = await fetch(`${baseUrl}/us_verifications`, {
        method: 'POST',
        headers,
        body: JSON.stringify(address)
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('Lob API error:', error);
        throw new Error(`Lob API error: ${response.status}`);
      }

      const result = await response.json();
      console.log('Address verification result:', result);
      return result;
    },

    async createPostcard(params: {
      description: string;
      to: Record<string, unknown>;
      from: Record<string, unknown>;
      front: string;
      back: string;
      size?: string;
    }) {
      console.log('Creating postcard:', params);
      const response = await fetch(`${baseUrl}/postcards`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...params,
          size: params.size || '4x6'
        })
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('Lob API error:', error);
        throw new Error(`Lob API error: ${response.status}`);
      }

      const result = await response.json();
      console.log('Postcard creation result:', result);
      return result;
    }
  };
};
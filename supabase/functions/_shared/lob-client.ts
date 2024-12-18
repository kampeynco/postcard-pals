import Lob from 'https://esm.sh/lob';

export function getLobClient(isTest: boolean = true) {
  const apiKey = isTest 
    ? Deno.env.get('LOB_TEST_SECRET_KEY')
    : Deno.env.get('LOB_LIVE_SECRET_KEY');

  if (!apiKey) {
    throw new Error(`Lob API key not found: ${isTest ? 'test' : 'live'}`);
  }

  return new Lob(apiKey);
}
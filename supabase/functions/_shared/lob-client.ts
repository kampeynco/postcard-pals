import { Lob } from "https://esm.sh/@lob/lob-typescript-sdk@1.5.0";

export const getLobClient = () => {
  const lobApiKey = Deno.env.get('LOB_API_KEY');
  if (!lobApiKey) {
    throw new Error('LOB_API_KEY is not set');
  }
  return new Lob({ apiKey: lobApiKey });
};
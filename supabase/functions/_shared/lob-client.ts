import Lob from 'https://esm.sh/@lob/lob-typescript-sdk'

export const createLobClient = () => {
  const apiKey = Deno.env.get('LOB_API_KEY')
  if (!apiKey) {
    throw new Error('LOB_API_KEY environment variable is not set')
  }
  
  return new Lob({ apiKey })
}
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
    const payload = await req.json()
    console.log('Received Lob webhook:', payload)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Log webhook
    await supabase
      .from('webhook_logs')
      .insert({
        webhook_type: 'lob',
        payload,
        status: 'received'
      })

    // Update postcard status
    if (payload.resource_type === 'postcard') {
      const { data: postcard, error: updateError } = await supabase
        .from('postcards')
        .update({ 
          status: mapLobStatus(payload.status),
          lob_webhook_id: payload.id
        })
        .eq('lob_id', payload.resource_id)
        .select()
        .single()

      if (updateError) throw updateError

      console.log('Updated postcard status:', postcard)
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

function mapLobStatus(lobStatus: string): 'pending' | 'in_transit' | 'delivered' | 'failed' | 'returned' {
  switch (lobStatus) {
    case 'in_transit':
      return 'in_transit'
    case 'delivered':
      return 'delivered'
    case 'failure':
      return 'failed'
    case 'returned':
      return 'returned'
    default:
      return 'pending'
  }
}
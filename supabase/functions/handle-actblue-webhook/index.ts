import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from '@supabase/supabase-js'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload = await req.json()
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Log webhook
    const { error: logError } = await supabase
      .from('webhook_logs')
      .insert({
        webhook_type: 'actblue',
        payload,
        status: 'received'
      })

    if (logError) throw logError

    // Extract donation data
    const donationData = {
      donor_name: `${payload.firstname} ${payload.lastname}`,
      amount: parseFloat(payload.amount),
      email: payload.email,
      address: {
        street: payload.addr1,
        city: payload.city,
        state: payload.state,
        zip_code: payload.zip
      }
    }

    // Find associated ActBlue account
    const { data: actblueAccount, error: accountError } = await supabase
      .from('actblue_accounts')
      .select('user_id')
      .eq('committee_name', payload.recipient)
      .single()

    if (accountError) throw accountError

    // Create donation record
    const { data: donation, error: donationError } = await supabase
      .from('donations')
      .insert({
        user_id: actblueAccount.user_id,
        donation_data: donationData,
        source: 'actblue',
        processed: false
      })
      .select()
      .single()

    if (donationError) throw donationError

    return new Response(
      JSON.stringify({ success: true, donation_id: donation.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
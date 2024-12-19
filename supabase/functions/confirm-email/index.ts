import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, email } = await req.json();
    
    if (!userId || !email) {
      console.error('Missing required fields:', { userId, email });
      throw new Error('Missing required fields');
    }

    console.log('Confirming email for user:', { userId, email });

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase configuration');
      throw new Error('Server configuration error');
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

    // Update profile confirmation status
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ is_confirmed: true })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating profile:', updateError);
      throw updateError;
    }

    console.log('Successfully confirmed email for user:', userId);

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in confirm-email function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString()
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
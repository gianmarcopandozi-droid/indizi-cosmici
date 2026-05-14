import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export function getServiceRoleClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('Supabase env mancante: NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY richiesti');
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

export function getAnonClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error('Supabase env mancante: NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY richiesti');
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

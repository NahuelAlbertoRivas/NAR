import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from '../config/env';

const hasSupabaseConfig = Boolean(env.supabaseUrl && env.supabaseServiceRoleKey);

export const supabase: SupabaseClient | null = hasSupabaseConfig
  ? createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

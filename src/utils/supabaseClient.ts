import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
const missingEnvMessage =
  "Supabase environment variables are missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.";

const createFallbackClient = (): SupabaseClient =>
  new Proxy(
    {},
    {
      // Delay the failure until a method is actually invoked so builds still succeed
      get() {
        throw new Error(missingEnvMessage);
      },
    }
  ) as SupabaseClient;

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : createFallbackClient();

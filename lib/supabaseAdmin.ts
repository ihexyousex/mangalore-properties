import { createClient } from '@supabase/supabase-js';

// Server-side only! Never expose service role key to client
// This client bypasses Row Level Security (RLS) policies
export const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Server-side only
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

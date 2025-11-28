import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("❌ Supabase Environment Variables Missing!");
    console.error("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl);
    console.error("NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseAnonKey ? "Set" : "Missing");
}

export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : {
        auth: {
            signInWithPassword: async () => {
                console.error("Supabase not configured");
                return { error: { message: "Supabase configuration missing. Check console." } };
            },
            signOut: async () => { },
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            getSession: async () => ({ data: { session: null }, error: null }),
        },
        from: () => ({
            select: () => ({ data: null, error: { message: 'Supabase not configured' } }),
            insert: () => ({ data: null, error: { message: 'Supabase not configured' } }),
            update: () => ({ data: null, error: { message: 'Supabase not configured' } }),
            delete: () => ({ data: null, error: { message: 'Supabase not configured' } }),
            upload: () => ({ data: null, error: { message: 'Supabase not configured' } }),
            getPublicUrl: () => ({ data: { publicUrl: "" } })
        }),
        storage: {
            from: () => ({
                upload: async () => ({ error: { message: 'Supabase not configured' } }),
                getPublicUrl: () => ({ data: { publicUrl: "" } })
            })
        }
    } as any;

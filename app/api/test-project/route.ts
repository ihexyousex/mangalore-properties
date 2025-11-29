import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const id = url.searchParams.get('id') || '23';

    console.log('[TEST API] Fetching project ID:', id);
    console.log('[TEST API] Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('[TEST API] Supabase Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

    const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

    return NextResponse.json({
        id,
        error: error ? {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
        } : null,
        data: data ? 'Found' : null,
        fullData: data
    });
}

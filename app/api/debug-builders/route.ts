import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

export async function GET() {
    const { data, error } = await supabase.from('builders').select('*');
    console.log('Debug Builders Data:', data);
    console.log('Debug Builders Error:', error);
    return NextResponse.json({ data, error });
}

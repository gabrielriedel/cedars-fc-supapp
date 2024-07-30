import { NextRequest, NextResponse } from 'next/server';
import { createClient } from "@/utils/supabase/server"; // Adjust import according to your setup


export async function POST(req: NextRequest) {
    if (req.method !== 'POST') {
        // Return a response to disallow methods other than GET
        return new NextResponse(`Method ${req.method} Not Allowed`, { status: 405 });
    }

    // Initialize Supabase client
    const supabase = createClient();

    const body = await req.json();

    try {
        const { data, error } = await supabase
            .from('rosters')
            .select('hour, activity_name')
            .eq('day', body.day)
            .eq('guest_id', body.guest_id);

        if (error) {
            return new NextResponse(JSON.stringify({ message: 'Failed to fetch schedule', details: error.message }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        return new NextResponse(JSON.stringify(data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        return new NextResponse(JSON.stringify({ message: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server'; // Adjust import according to your setup

export async function POST(req: NextRequest) {
    if (req.method !== 'POST') {
        return new NextResponse(`Method ${req.method} Not Allowed`, { status: 405 });
    }

    // Initialize Supabase client
    const supabase = createClient();
    const body = await req.json();
    const {
        data: { user },
      } = await supabase.auth.getUser();

    try {
        const { data: schedules, error: schedulesError } = await supabase
            .from('rosters')
            .select('guest_id, first_name, last_name, hour, activity_name, location, attire, family_code')
            .eq('day', body.day)
            .eq('family_code', user?.id);

        if (schedulesError) {
            return new NextResponse(JSON.stringify({ message: 'Failed to fetch schedules', details: schedulesError.message }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        return new NextResponse(JSON.stringify(schedules), {
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

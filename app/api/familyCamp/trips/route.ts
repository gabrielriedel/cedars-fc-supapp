import { NextRequest, NextResponse } from 'next/server';
import { createClient } from "@/utils/supabase/server"; // Adjust import according to your setup


export async function GET(req: NextRequest) {
    if (req.method !== 'GET') {
        // Return a response to disallow methods other than GET
        return new NextResponse(`Method ${req.method} Not Allowed`, { status: 405 });
    }

    // Initialize Supabase client
    const supabase = createClient();
    const {
        data: { user },
      } = await supabase.auth.getUser();

    try {
        const { data, error } = await supabase
            .from('trips')
            .select('id, name, age_limit, description')
            .order('name', { ascending: true });


        if (error) {
            return new NextResponse(JSON.stringify({ message: 'Failed to fetch trip', details: error.message }), {
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

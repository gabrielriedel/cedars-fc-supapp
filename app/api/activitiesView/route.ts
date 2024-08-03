import { NextRequest, NextResponse } from 'next/server';
import { createClient } from "@/utils/supabase/server"; // Adjust import according to your setup

export async function POST(req: NextRequest) {
    if (req.method !== 'POST') {
        return new NextResponse(`Method ${req.method} Not Allowed`, { status: 405 });
    }

    // Initialize Supabase client
    const supabase = createClient();
    const body = await req.json();

    try {
        const { data: activities, error: activitiesError } = await supabase
            .from('activities')
            .select('id, hour, activity_name, capacity, location')
            .eq('day', body.day)
            .order('hour', { ascending: true });

        if (activitiesError) {
            return new NextResponse(JSON.stringify({ message: 'Failed to fetch activities', details: activitiesError.message }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        const { data: rosters, error: rostersError } = await supabase
            .from('rosters')
            .select('activity_id, first_name, last_name, grade')
            .eq('day', body.day);

        if (rostersError) {
            return new NextResponse(JSON.stringify({ message: 'Failed to fetch rosters', details: rostersError.message }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        // Combine activities and rosters
        const combinedData = activities.map(activity => {
            return {
                ...activity,
                rosters: rosters.filter(roster => roster.activity_id === activity.id)
            };
        });

        return new NextResponse(JSON.stringify(combinedData), {
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

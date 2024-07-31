// pages/api/createActivity.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server'; // Adjust import according to your setup

export async function POST(req: NextRequest) {
    if (req.method !== 'POST') {
        return new NextResponse(`Method ${req.method} Not Allowed`, { status: 405 });
    }

    const { activityName, capacity, hour, day, description, attire, location, ageLimit } = await req.json();

    if (!activityName || !capacity || !hour || !day || !description || !attire || !location || !ageLimit) {
        return new NextResponse(JSON.stringify({ message: 'All fields are required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const supabase = createClient();
    
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError) {
        return new NextResponse(JSON.stringify({ message: 'Failed to fetch user', details: userError.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const { data, error } = await supabase
        .from('activities')
        .insert([
            { activity_name: activityName, capacity, spaces_left: capacity, hour, day, description, location, age_limit: ageLimit, attire: attire }
        ]);

    if (error) {
        console.log(error)
        return new NextResponse(JSON.stringify({ message: 'Failed to add activity', details: error.message }), {
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
}

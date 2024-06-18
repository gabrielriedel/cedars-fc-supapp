// /pages/api/activities.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from "@/utils/supabase/server";


interface Activity {
    id: number;
    activity_name: string;
    spaces_left: number;
}

export async function POST(req: NextRequest, res: NextResponse) {
    if (req.method !== 'POST') {
        return new NextResponse('Method Not Allowed', { status: 405 });
    }

    // Parse JSON body
    const body = await req.json();

    if (!body.day || !body.hour) {
        return new NextResponse(JSON.stringify({ error: "Missing day or hour" }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    try {
        // Assuming fetchActivitiesForDayAndHour is an async function that fetches data
        const activities = await fetchActivitiesForDayAndHour(body.day, body.hour);
        return new NextResponse(JSON.stringify(activities), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error fetching activities:', error);
        if (error instanceof Error) {
        return new NextResponse(JSON.stringify({ message: 'Failed to fetch activities', details: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        }
        else{
            return new NextResponse(JSON.stringify({ message: 'Failed to fetch activities', details: "An unkknown error occurred" }));
        }
    }
}


async function fetchActivitiesForDayAndHour(day: string, hour: string): Promise<Activity[]> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('activities')
        .select('id, activity_name, spaces_left')
        .eq('day', day)
        .eq('hour', hour);

    if (error) {
        throw new Error(error.message);
    }

    return data;
}



// import { NextRequest, NextResponse } from 'next/server'
// import { createClient } from "@/utils/supabase/server";

// // Export a named export for the GET method
// export async function GET(req: NextRequest) {
//     const supabase = createClient();
//     const body = await req.json();
//     const { data, error } = await supabase
//         .from('activities')
//         .select('*')
//         .eq('day', body.day)
//         .eq('hour', body.hour);
//     console.log(error)

//     return NextResponse.json(data);
// }

// Similarly, add other methods as needed (POST, DELETE, etc.)




// - Catalog.tsx
//     - Selects available activities
//     - Different async functions for different days? Hours?



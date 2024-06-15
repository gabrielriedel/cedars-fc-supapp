// pages/api/users.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from "@/utils/supabase/server"; // Adjust import according to your setup

export async function POST(req: NextRequest) {
    if (req.method !== 'POST') {
        // Return a response to disallow methods other than POST
        return new NextResponse(`Method ${req.method} Not Allowed`, { status: 405 });
    }

    // Fetch the JSON body from the request
    const { firstName, lastName, cabin, age } = await req.json();
    const supabase = createClient();

    const { data, error } = await supabase
        .from('guests')
        .insert([
            { first_name: firstName, last_name: lastName, cabin: cabin, age }
        ]);

    if (error) {
        // Return a JSON response with the error details
        return new NextResponse(JSON.stringify({ message: 'Failed to add guest', details: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    // Return the data as a JSON response on successful insertion
    return new NextResponse(JSON.stringify(data), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}


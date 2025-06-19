// pages/api/createActivity.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server'; // Adjust import according to your setup

export async function POST(req: NextRequest) {
    if (req.method !== 'POST') {
        return new NextResponse(`Method ${req.method} Not Allowed`, { status: 405 });
    }

    const { firstName, lastName, session, year, program, cabin} = await req.json();

    if (!firstName ||  !lastName || !cabin || !session || !year || !program) {
        return new NextResponse(JSON.stringify({ message: 'All fields are required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const supabase = createClient();

    const { data, error } = await supabase
        .from('cabin_rosters')
        .insert([
            { first_name: firstName, last_name: lastName, session:session, year: year, program:program, cabin: cabin}
        ]);

    if (error) {
        console.error("Insert error:", error.message);
        console.log(error);
        console.log(firstName);
        console.log(session);
        console.log(year);
        console.log(program);
        console.log(cabin);
        return new NextResponse(JSON.stringify({ message: 'Failed to add to cabin', details: error.message }), {
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

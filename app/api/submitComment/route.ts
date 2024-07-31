// pages/api/users.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from "@/utils/supabase/server"; // Adjust import according to your setup

export async function POST(req: NextRequest) {
    console.log(req)
    if (req.method !== 'POST') {
        return new NextResponse(`Method ${req.method} Not Allowed`, { status: 405 });
    }

    const {firstName, lastName, guest_id, day, comment} = await req.json();
    const supabase = createClient();
    const {
        data: { user },
      } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from('waitlist')
        .insert([
            { first_name: firstName, last_name: lastName, guest_id: guest_id, day: day, comment: comment }
        ]);
        

    if (error) {
        return new NextResponse(JSON.stringify({ message: 'Failed to add guest', details: error.message }), {
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

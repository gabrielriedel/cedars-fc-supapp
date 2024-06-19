import { NextRequest, NextResponse } from 'next/server';
import { createClient } from "@/utils/supabase/server";

export async function PATCH(req: NextRequest) {
    if (req.method !== 'PATCH') {
        return new NextResponse('Method Not Allowed', { status: 405 });
    }

    const supabase = createClient();
    const body = await req.json();
    const {
        data: { user },
      } = await supabase.auth.getUser();

    try {
        // Update the first table
        const { error: error1 } = await supabase
            .from('rosters')
            .insert([
                { first_name: body.firstName, last_name: body.lastName, 
                    family_code: user?.id, activity_name: body.activityName, 
                    activity_id: body.activityId, day: body.day, hour: body.hour}
            ]);

        if (error1) throw error1;
        const activityId = body.activityId;
        if (typeof activityId !== 'number') {
            return new NextResponse(JSON.stringify({ error: "Invalid activity ID" }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        // Call the custom function to decrement spaces
        const { error: error2 } = await supabase
            .rpc('decrement_space', { activity_id_param: activityId });

        if (error2) throw error2;

        return new NextResponse(JSON.stringify({ message: "Update successful" }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error(error);

        // Correct error handling using type checking
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return new NextResponse(JSON.stringify({ error: "Failed to update", details: errorMessage }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}

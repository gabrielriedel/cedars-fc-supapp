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

    type Grade = 'No Limit' | 'Infant' | 'Toddler' | 'Pre-K' | 'Kindergarten' | '1st Grade' | '2nd Grade' | '3rd Grade' | '4th Grade' | '5th Grade' | '6th Grade' | '7th Grade' | '8th Grade' | 'High School' | 'College' | 'Adult';


    const gradeMapping: Record<Grade, number> = {
        'No Limit': -1,
        'Infant': 0,
        'Toddler': 1,
        'Pre-K': 2,
        'Kindergarten': 3,
        '1st Grade': 4,
        '2nd Grade': 5,
        '3rd Grade': 6,
        '4th Grade': 7,
        '5th Grade': 8,
        '6th Grade': 9,
        '7th Grade': 10,
        '8th Grade': 11,
        'High School': 12,
        'College': 13,
        'Adult': 14
    };

    try {
        const { data: acts, error: actsError } = await supabase
            .from('activities')
            .select('spaces_left, age_limit, location')
            .eq('day', body.day)
            .eq('hour', body.hour)
            .eq('activity_name', body.activityName);

        if (actsError) throw new Error("Failed to retrieve activity details.");

        if (acts[0].spaces_left <= 0) {
            return new NextResponse(JSON.stringify({ error: "Activity is full" }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const gradeLimit = acts[0].age_limit as Grade;
        const guestGrade = body.grade as Grade;

        if (gradeMapping[gradeLimit] > gradeMapping[guestGrade]) {
            return new NextResponse(JSON.stringify({ error: "Sorry, this activity has grade restrictions that do not match this guest's profile" }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        

        const { data: rosters, error: rostersError } = await supabase
            .from('rosters')
            .select('activity_id')
            .eq('day', body.day)
            .eq('hour', body.hour)
            .eq('first_name', body.firstName)
            .eq('last_name', body.lastName)
            .eq('guest_id', body.guest_id);

        if (rostersError) throw new Error("Failed to check existing registrations.");

        if (rosters.length > 0 && body.activityId == rosters[0].activity_id) {
            return new NextResponse(JSON.stringify({ error: "Already registered for this activity." }), {
                status: 409,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const { data: insertData, error: insertError } = await supabase
            .from('rosters')
            .insert([{ first_name: body.firstName, last_name: body.lastName, 
                       family_code: user?.id, activity_name: body.activityName, 
                       activity_id: body.activityId, day: body.day, hour: body.hour,
                    guest_id: body.guest_id, location:acts[0].location }]);

        if (insertError) throw new Error("Failed to register for activity.");

        const { error: decrementError } = await supabase
            .rpc('decrement_space', { activity_id_param: body.activityId });

        if (decrementError) throw new Error("Failed to update spaces left.");

        if (rosters.length > 0){
            console.log(rosters[0].activity_id)
            console.log(body.guest_id)
            console.log(body.day)
            console.log(body.hour)
            const { error: deleteError } = await supabase
                .from('rosters')
                .delete()
                .match({ guest_id: body.guest_id, activity_id: rosters[0].activity_id, day: body.day, hour: body.hour });
            if (deleteError) {
                throw new Error(deleteError.message);
            }
            const { error: incrementError } = await supabase
            .rpc('increment_space', { activity_id_param: rosters[0].activity_id });
            if (incrementError) throw new Error("Failed to increment spaces left.");

        }

        return new NextResponse(JSON.stringify({ message: "Successfully registered for this activity!" }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error:', error);

        // Provide a detailed error message based on the exception thrown
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return new NextResponse(JSON.stringify({ error: "Failed to register", details: errorMessage }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}










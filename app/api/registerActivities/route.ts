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
        const { data: acts, error: actsError } = await supabase
            .from('activities')
            .select('spaces_left')
            .eq('day', body.day)
            .eq('hour', body.hour)
            .eq('activity_name', body.activityName);

        if (actsError) throw actsError;

        if (acts[0].spaces_left <=0){
            throw actsError
        }

        const { data: rosters, error: rostersError } = await supabase
            .from('rosters')
            .select('activity_id')
            .eq('day', body.day)
            .eq('hour', body.hour)
            .eq('first_name', body.firstName)
            .eq('last_name', body.lastName)
            .eq('family_code', user?.id);

        if (rostersError) throw rostersError;

        if (rosters.length === 0) {
            const { data: data1, error: error1 } = await supabase
                .from('rosters')
                .insert([
                    { first_name: body.firstName, last_name: body.lastName, 
                        family_code: user?.id, activity_name: body.activityName, 
                        activity_id: body.activityId, day: body.day, hour: body.hour}
                ]);

        if (error1) throw error1;

        if (typeof  body.activityId !== 'number') {
            return new NextResponse(JSON.stringify({ error: "Invalid activity ID" }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        // Call the custom function to decrement spaces
        const { error: error2 } = await supabase
            .rpc('decrement_space', { activity_id_param:  body.activityId });

        if (error2) throw error2;

        return new NextResponse(JSON.stringify({ message: "Succesfully registered for this activity!" }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        }
        else {
            const { error: error3 } = await supabase
                .from('rosters')
                .update([
                    {activity_name: body.activityName, activity_id: body.activityId}
                ])
                .eq('day', body.day)
                .eq('hour', body.hour)
                .eq('first_name', body.firstName)
                .eq('last_name', body.lastName)
                .eq('family_code', user?.id);
            if (error3){
                console.log("3");
                throw error3;} 
            

            const { error: error4 } = await supabase
                .rpc('decrement_space', { activity_id_param:  body.activityId });

            if (error4){
                    console.log("4");
                    throw error4;} 
            

            const { error: error5 } = await supabase
                .rpc('increment_space', { activity_id_param: rosters[0].activity_id});

            
                if (error5){
                    console.log("5");
                    throw error5;} 
            

        return new NextResponse(JSON.stringify({ message: "Succesfully registered for this activity!" }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        }
    } catch (error) {
        console.error(error);

        // Correct error handling using type checking
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return new NextResponse(JSON.stringify({ error: "Failed to register, activity may be full", details: errorMessage }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}







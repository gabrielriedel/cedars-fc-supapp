import { NextRequest, NextResponse } from 'next/server';
import { createClient } from "@/utils/supabase/server";

export async function PATCH(req: NextRequest) {
    if (req.method !== 'PATCH') {
        return new NextResponse('Method Not Allowed', { status: 405 });
    }

    const supabase = createClient();
    const body = await req.json();

    try {
        // Update the first table
        const { error: error1 } = await supabase
            .from('guests')
            .update({ m1: body.activityName })
            .eq('id', body.id);

        if (error1) throw error1;

        // Update the second table
        const { error: error2 } = await supabase
            .from('second_table')
            .update({ anotherFieldToUpdate: body.anotherNewValue })
            .eq('relatedId', body.relatedId);

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

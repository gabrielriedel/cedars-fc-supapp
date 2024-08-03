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
        const firstChoiceGradeLimit = body.firstChoice.age_limit as Grade;
        const secondChoiceGradeLimit = body.secondChoice.age_limit as Grade;
        const guestGrade = body.grade as Grade;

        if (gradeMapping[firstChoiceGradeLimit] > gradeMapping[guestGrade]) {
            return new NextResponse(JSON.stringify({ error: "Sorry, the first choice trip has grade restrictions that do not match this guest's profile" }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (gradeMapping[secondChoiceGradeLimit] > gradeMapping[guestGrade]) {
            return new NextResponse(JSON.stringify({ error: "Sorry, the second choice trip has grade restrictions that do not match this guest's profile" }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const { data: insertData, error: insertError } = await supabase
            .from('trips_roster')
            .insert([
                {
                    first_name: body.firstName,
                    last_name: body.lastName,
                    guest_id: body.guestId,
                    grade: body.grade,
                    trip_name: body.firstChoice.name,
                    trip_id: body.firstChoice.id,
                    preference: 1
                },
                {
                    first_name: body.firstName,
                    last_name: body.lastName,
                    guest_id: body.guestId,
                    grade: body.grade,
                    trip_name: body.secondChoice.name,
                    trip_id: body.secondChoice.id,
                    preference: 2
                }
            ]);

        if (insertError) throw new Error("Failed to register for trips.");

        return new NextResponse(JSON.stringify({ message: "Successfully registered for the trips!" }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error:', error);

        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return new NextResponse(JSON.stringify({ error: "Failed to register", details: errorMessage }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

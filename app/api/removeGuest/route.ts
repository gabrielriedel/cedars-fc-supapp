// /app/api/removeGuest/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from "@/utils/supabase/server"; // Ensure the correct path according to your project setup

export async function DELETE(req: NextRequest) {
    if (req.method !== 'DELETE') {
        // Only allow DELETE requests, reject others with the correct HTTP status code
        return new NextResponse('Method Not Allowed', { status: 405 });
    }

    const supabase = createClient();
    const guestId = req.nextUrl.searchParams.get('id'); // Accessing the guestId from the query parameter

    if (!guestId) {
        return new NextResponse(JSON.stringify({ message: 'Guest ID is required' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    try {
        const { error } = await supabase
            .from('guests')
            .delete()
            .match({ id: guestId }); // Ensure you're deleting the correct record

        if (error) {
            return new NextResponse(JSON.stringify({ message: 'Failed to delete guest', details: error.message }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        return new NextResponse(JSON.stringify({ message: 'Guest successfully deleted' }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        return new NextResponse(JSON.stringify({ message: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}

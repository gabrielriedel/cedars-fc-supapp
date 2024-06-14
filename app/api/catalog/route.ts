import type { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from "@/utils/supabase/server";

// Export a named export for the GET method
export async function GET(req: NextRequest) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('monday_acts')
        .select('*');
    console.log(error)

    return NextResponse.json(data);
}

// Similarly, add other methods as needed (POST, DELETE, etc.)




// - Catalog.tsx
//     - Selects available activities
//     - Different async functions for different days? Hours?



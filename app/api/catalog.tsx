import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseServer } from "@/utils/supabase/supabaseServer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { data, error } = await supabaseServer
        .from('monday_first')
        .select('activity_name, spots_left');
    if (error) {
        return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data);
}


// - Catalog.tsx
//     - Selects available activities
//     - Different async functions for different days? Hours?



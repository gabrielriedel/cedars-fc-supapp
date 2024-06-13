import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from "@/utils/supabase/server";


const supabase = createClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse) {
    const { data, error } = await supabase
        .from('your_table_name')
        .select('*');

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data);
}

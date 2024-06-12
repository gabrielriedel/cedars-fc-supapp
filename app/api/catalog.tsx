import { createClient } from "@/utils/supabase/server";
// - Catalog.tsx
//     - Selects available activities
//     - Different async functions for different days? Hours?



// export default async function handler(req, res) {
//     const supabase = createClient();
//     const { data, error } = await supabase
//         .from('monday_acts')
//         .select('activity_name, spaces_left');

//     if (error) {
//         console.error('Error fetching data:', error.message);
//         return res.status(500).json({ error: error.message });
//     }

//     res.status(200).json(data);
// }



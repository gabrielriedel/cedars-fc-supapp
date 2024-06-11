import { createClient } from '@/utils/supabase/server'

export default async function Page() {
  const supabase = createClient();
  let monday;
  try {
    let { data: mondayData, error } = await supabase.from('monday_acts').select();
    if (error) throw error;
    monday = mondayData;
  } catch (err) {
    console.error('Error fetching notes:', err);
    return <pre>Error loading data!</pre>;
  }
  return <pre>{JSON.stringify(monday, null, 2)}</pre>;
}

import { createClient } from '@/utils/supabase/server'

export default async function Page() {
  const supabase = createClient()
  const { data: guests } = await supabase.from('guests').select()

  return <pre>{JSON.stringify(guests, null, 2)}</pre>
}
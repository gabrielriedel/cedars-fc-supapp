// app/api/rosterBySession/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const session = searchParams.get('session');
  const year = searchParams.get('year');
  const program = searchParams.get('program');

  if (!session || !year || !program) {
    return new NextResponse(JSON.stringify({ message: 'Missing session, year, or program parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('cabin_rosters')
      .select('first_name, last_name, cabin')
      .eq('session', session)
      .eq('year', year)
      .eq('program', program);

    if (error) throw new Error(error.message);

    const grouped: Record<string, { first_name: string; last_name: string }[]> = {};
    data.forEach(({ cabin, first_name, last_name }) => {
      if (!grouped[cabin]) grouped[cabin] = [];
      grouped[cabin].push({ first_name, last_name });
    });

    return new NextResponse(JSON.stringify(grouped), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    return new NextResponse(JSON.stringify({
      message: 'Error fetching campers',
      details: err instanceof Error ? err.message : 'Unknown error',
    }), { status: 500 });
  }
}

// app/api/activityOptions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const year = searchParams.get('year');
  const session = searchParams.get('session');
  const program = searchParams.get('program');
  const day = searchParams.get('day');
  const hour = searchParams.get('hour');

  if (!year || !session || !program || !day || !hour) {
    return new NextResponse(JSON.stringify({ message: 'Missing one or more required query parameters' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('main_activities')
      .select('activity_name')
      .eq('year', year)
      .eq('session', session)
      .eq('program', program)
      .eq('day', day)
      .eq('hour', hour);

    if (error) throw new Error(error.message);

    const activityNames = Array.from(new Set(data.map(item => item.activity_name)));

    return new NextResponse(JSON.stringify(activityNames), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    return new NextResponse(JSON.stringify({
      message: 'Failed to fetch activity options',
      details: err instanceof Error ? err.message : 'Unknown error',
    }), { status: 500 });
  }
}

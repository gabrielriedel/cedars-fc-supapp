import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const year = searchParams.get('year');
  const session = searchParams.get('session');
  const day = searchParams.get('day');
  const program = searchParams.get('program');

  if (!year || !session || !day || !program) {
    return new NextResponse(JSON.stringify({ message: 'Missing year, session, day, or program' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('main_activities_roster')
      .select('first_name, last_name, activity_name, hour')
      .eq('year', year)
      .eq('session', session)
      .eq('day', day)
      .eq('program', program)
      .eq('choice_type', "first"); 

    if (error) throw new Error(error.message);

    const schedule: Record<string, Record<string, string[]>> = {};

    data.forEach(({ hour, activity_name, first_name, last_name }) => {
      if (!schedule[hour]) schedule[hour] = {};
      if (!schedule[hour][activity_name]) schedule[hour][activity_name] = [];
      schedule[hour][activity_name].push(`${first_name} ${last_name}`);
    });

    return new NextResponse(JSON.stringify(schedule), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new NextResponse(JSON.stringify({
      message: 'Failed to fetch schedule',
      details: err instanceof Error ? err.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const year = searchParams.get('year');
  const session = searchParams.get('session');
  const program = searchParams.get('program');

  if (!year || !session || !program) {
    return new NextResponse(JSON.stringify({ message: 'Missing year, session, or program' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('main_activities_roster')
      .select('first_name, last_name, cabin, day, hour, activity_name')
      .eq('year', year)
      .eq('session', session)
      .eq('program', program)
      .eq('choice_type', 'first');

    if (error) throw new Error(error.message);

    // Group by camper full name + cabin
    const camperMap = new Map<string, any>();

    for (const row of data) {
      const fullKey = `${row.first_name} ${row.last_name} ${row.cabin}`;

      if (!camperMap.has(fullKey)) {
        camperMap.set(fullKey, {
          first: row.first_name,
          last: row.last_name,
          cabin: row.cabin,
          choices: {
            Tuesday: {},
            Wednesday: {},
            Thursday: {}
          }
        });
      }

      const camper = camperMap.get(fullKey);

      if (!camper.choices[row.day]) {
        camper.choices[row.day] = {};
      }

      camper.choices[row.day][row.hour] = { first: row.activity_name };
    }

    return new NextResponse(JSON.stringify(Array.from(camperMap.values())), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new NextResponse(JSON.stringify({
      message: 'Failed to fetch camper choices',
      details: err instanceof Error ? err.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

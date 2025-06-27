import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const year = searchParams.get('year');
  const session = searchParams.get('session');
  const program = searchParams.get('program');

  if (!year || !session || !program) {
    return NextResponse.json({ message: 'Missing required query parameters' }, { status: 400 });
  }

  const supabase = createClient();

  const { data, error } = await supabase
    .from('main_activities_roster')
    .select('day, hour, activity_name')
    .eq('year', year)
    .eq('session', session)
    .eq('program', program);

  if (error) {
    return NextResponse.json({ message: 'Failed to fetch activity data', error }, { status: 500 });
  }

  const grouped: Record<string, Record<string, Set<string>>> = {};

  for (const row of data) {
    const { day, hour, activity_name } = row;
    if (!grouped[day]) grouped[day] = {};
    if (!grouped[day][hour]) grouped[day][hour] = new Set();
    grouped[day][hour].add(activity_name);
  }

  // Convert Sets to arrays
  const result = Object.fromEntries(
    Object.entries(grouped).map(([day, hourMap]) => [
      day,
      Object.fromEntries(
        Object.entries(hourMap).map(([hour, activities]) => [hour, Array.from(activities)])
      ),
    ])
  );

  return NextResponse.json(result);
}

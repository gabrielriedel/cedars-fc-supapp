import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: NextRequest) {
  const supabase = createClient();
  try {
    const body = await req.json();

    if (!Array.isArray(body) || body.length === 0) {
      return new NextResponse(JSON.stringify({ message: 'Invalid request body' }), { status: 400 });
    }

    const valid = body.every(entry =>
      entry.first_name &&
      entry.last_name &&
      entry.cabin &&
      entry.activity_name &&
      entry.session &&
      entry.year &&
      entry.day &&
      entry.hour &&
      entry.choice_type // should be 'first' or 'second'
    );

    if (!valid) {
      return new NextResponse(JSON.stringify({ message: 'Missing required fields in some entries' }), { status: 400 });
    }

    const { error } = await supabase
      .from('main_activities_roster')
      .insert(body);

    if (error) {
      return new NextResponse(JSON.stringify({ message: 'Database insert failed', details: error.message }), { status: 500 });
    }

    return new NextResponse(JSON.stringify({ message: 'Activity assignments saved successfully' }), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify({
      message: 'Unexpected server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from "@/utils/supabase/server"; // Adjust if needed

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const session = searchParams.get('session');
  const year = searchParams.get('year');
  const program = searchParams.get('program');

  if (!session || !year || !program) {
    return new NextResponse(
      JSON.stringify({ message: 'Missing session, year, or program parameter' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('cabin_rosters')
      .select('first_name, last_name, cabin')
      .eq('session', session)
      .eq('year', year)
      .eq('program', program); // Added program filter

    if (error) {
      return new NextResponse(
        JSON.stringify({ message: 'Failed to fetch campers', details: error.message }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Group campers by cabin
    const cabins: Record<string, { first_name: string; last_name: string }[]> = {};
    data.forEach(({ cabin, first_name, last_name }) => {
      if (!cabins[cabin]) cabins[cabin] = [];
      cabins[cabin].push({ first_name, last_name });
    });

    return new NextResponse(JSON.stringify(cabins), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        message: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

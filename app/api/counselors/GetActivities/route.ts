import { NextRequest, NextResponse } from 'next/server';
import { createClient } from "@/utils/supabase/server";

async function fetchActivitiesForDayAndHour(day: string, hour: string, session: string, year: string, program: string) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('activities')
        .select('activity_name')
        .eq('day', day)
        .eq('hour', hour)
        .eq('session', session)
        .eq('year', year)
        .eq('program', program)
        .order('activity_name', { ascending: true });

    if (error) {
        throw new Error(error.message);
    }

    return data;
}
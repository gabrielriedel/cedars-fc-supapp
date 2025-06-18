import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase/admin'; // <== use your new admin client

export async function GET() {
  const { data, error } = await supabaseAdmin.auth.admin.listUsers();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const pending = data.users.filter(
    (user) => user.user_metadata?.approved === false
  );

  return NextResponse.json(pending);
}

export async function PUT(req: Request) {
  const { userId } = await req.json();

  const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    user_metadata: { approved: true },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

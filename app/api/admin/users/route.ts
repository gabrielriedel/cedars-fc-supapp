import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase/admin";

export const dynamic = "force-dynamic";

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
  console.log("Approving user:", userId);

  const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    user_metadata: { approved: true },
  });

  if (error) {
    console.error("Error approving user:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

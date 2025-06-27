import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AuthButton() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const signOut = async () => {
    "use server";
    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/login");
  };

  // Determine dashboard route based on role
  const role = user?.user_metadata?.role;
  let dashboardPath = "/home"; // fallback

  if (role === "admin") {
    dashboardPath = "/admin/dashboard";
  } else if (role === "program_director") {
    dashboardPath = "/pds/dashboard";
  } else if (role === "counselor") {
    dashboardPath = "/counselors/dashboard";
  } else if (role === "family_camp_attendee") {
    dashboardPath = "/protected";
  }

  return user ? (
    <div className="flex items-center gap-4">
      <span>Hey, {user.email}!</span>
      <form action={signOut}>
        <button className="py-2 px-3 flex rounded-md no-underline bg-gray-700 hover:bg-gray-800 text-white">
          Logout
        </button>
      </form>
      <Link
        href={dashboardPath}
        className="py-2 px-3 flex rounded-md no-underline bg-gray-700 hover:bg-gray-800 text-white"
      >
        Dashboard
      </Link>
    </div>
  ) : (
    <Link
      href="/login"
      className="py-2 px-3 flex rounded-md no-underline bg-gray-700 hover:bg-gray-800 text-white"
    >
      Login/Sign up
    </Link>
  );
}

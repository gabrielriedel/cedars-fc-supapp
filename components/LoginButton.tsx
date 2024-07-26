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

  return user ? (
    <div className="flex items-center gap-4">
      Hey, {user.email}!
      <form action={signOut}>
        <button className="py-2 px-3 flex rounded-md no-underline bg-gray-700 hover:bg-gray-800 text-white">
          Logout
        </button>
      </form>
      <Link
      href="/protected"
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

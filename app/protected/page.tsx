import React from 'react';
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from 'next/link'
import AuthButton from "@/components/AuthButton";

const ProtectedPage: React.FC = async () => {
  const supabase = createClient();

  // Fetch the user asynchronously
  const { data, error } = await supabase.auth.getUser();

  // Redirect if not authenticated
  if (error || !data?.user) {
    redirect("/login");
    return <></>; // Return an empty fragment or null to satisfy function return type, though this will not execute due to redirect.
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="w-full">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
          <AuthButton />
          </div>
        </nav>
      </div>
      <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-4xl px-3">
      <Link href="/activities">Activity Sign-ups</Link>
      <Link href="/register">Register Other Party Members</Link>
      </div>
    </div>
  );
}

export default ProtectedPage;


// 'use server'

// import React, { useEffect } from 'react';
// import { useRouter } from 'next/router';
// import { createClient } from "@/utils/supabase/server";
// import Header from "@/components/Header";

// const ProtectedPage: React.FC = () => {
//   const router = useRouter();
//   const supabase = createClient();

//   useEffect(() => {
//     const fetchUser = async () => {
//       const { data, error } = await supabase.auth.getUser();

//       // Redirect if not authenticated
//       if (error || !data?.user) {
//         router.replace("/login");  // Use useRouter for client-side redirects
//         return;
//       }
//     };
    
//     fetchUser();
//   }, []);  // Removed supabase from dependencies to avoid potential unnecessary re-runs

//   return (
//     <div className="flex-1 w-full flex flex-col gap-20 items-center">
//       <div className="w-full">
//         <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
//           <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
//             {/* Navigation elements or other components here */}
//           </div>
//         </nav>
//       </div>
//       <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-4xl px-3">
//         <Header />
//       </div>
//     </div>
//   );
// }

// export default ProtectedPage;




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
    <div className="flex flex-col items-center min-h-screen bg-white text-green-800 w-full">
      <nav className="w-full bg-green-500 text-white shadow-md">
        <div className="flex justify-between items-center py-4 px-6 w-full">
          <h1 className="text-lg font-bold">Cedars Family Camp Dashboard</h1>
          <AuthButton />
        </div>
      </nav>
      <div className="flex-grow flex flex-col items-center justify-start pt-10 gap-6 px-6 w-full">
        <section className="text-center mb-10">
          <h2 className="text-2xl font-bold mb-4">Welcome to Your Dashboard!</h2>
          <p className="max-w-3xl text-lg font-bold mb-4">
            Step 1: Add party members to your account.
          </p>
          <p className="max-w-3xl text-lg font-bold mb-4">
            Step 2: Sign-up for activities for each member of your party 
          </p>
        </section>
        <div className="flex flex-col items-center gap-4">
          <Link 
            href="/register"
            className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded-lg shadow transition-colors duration-200 w-full md:w-auto">
            Add Party Members
          </Link>
          <Link 
            href="/activities"
            className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded-lg shadow transition-colors duration-200 w-full md:w-auto">
            Activity Sign-ups
          </Link>
          <Link 
            href="/schedule"
            className="bg-yellow-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded-lg shadow transition-colors duration-200 w-full md:w-auto">
            View Activity Schedules
          </Link>
          <Link 
            href="/remove"
            className="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded-lg shadow transition-colors duration-200 w-full md:w-auto">
            View/Remove Party Members
          </Link>
        </div>
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




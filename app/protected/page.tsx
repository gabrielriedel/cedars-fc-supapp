import React from 'react';
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from 'next/link'
import AuthButton from "@/components/AuthButton";
import Image from 'next/image';
import logo from '@/assets/cedarslogo.png';

const ProtectedPage = async () => {
  const supabase = createClient();

  // Fetch the user asynchronously
  const { data, error } = await supabase.auth.getUser();

  // Redirect if not authenticated
  if (error || !data?.user) {
    redirect("/login");
    return <></>; // Return an empty fragment or null to satisfy function return type, though this will not execute due to redirect.
  }

  return (
    <>
      <div className="flex flex-col items-center min-h-screen text-green-800 w-full bg-gradient-to-br from-green-50 via-white to-green-100">
        <nav className="w-full bg-green-500 text-white shadow-md">
          <div className="flex flex-wrap justify-between items-center py-4 px-4 sm:px-6 w-full">
            <div className="flex items-center gap-2 mb-2 sm:mb-0">
              <Image src={logo} alt="Cedars Family Camp Logo" width={40} height={40} className="flex-shrink-0" />
              <h1 className="text-base sm:text-lg font-bold text-center sm:text-left">
                Cedars Family Camp Dashboard
              </h1>
            </div>
            <div className="flex justify-center sm:justify-end w-full sm:w-auto">
              <AuthButton />
            </div>
          </div>
        </nav>
        <div className="flex-grow flex flex-col items-center justify-start pt-10 gap-6 px-4 sm:px-6 lg:px-8 w-full">
          <section className="text-center mb-4">
            <h2 className="text-2xl font-bold mb-4">Welcome to Your Dashboard!</h2>
          </section>
          <div className="relative w-full max-w-4xl mx-auto my-12 px-0">
            <section className="relative flex flex-col items-center space-y-6 max-w-3xl mx-auto px-0">
              <div className="bg-white rounded-lg shadow p-6 w-full">
                <p className="max-w-3xl text-lg font-bold mb-4">
                  Step 1: Add party members to your account.
                </p>
                <Link
                  href="/register"
                  className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded-lg shadow transition-colors duration-200 w-full md:w-auto block text-center">
                  Add Party Members
                </Link>
              </div>
              <div className="bg-white rounded-lg shadow p-6 w-full">
                <p className="max-w-3xl text-lg font-bold mb-4">
                  Step 2: Sign-up for activities for each member of your party.
                </p>
                <Link
                  href="/activities"
                  className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded-lg shadow transition-colors duration-200 w-full md:w-auto block text-center">
                  Activity Sign-ups
                </Link>
              </div>
              <div className="bg-white rounded-lg shadow p-6 w-full">
                <p className="max-w-3xl text-lg font-bold mb-4">
                  Step 3: Fill out horse activity questionnaire if you have not already.
                </p>
                <a
                  href="https://form.jotform.com/242084860452153"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded-lg shadow transition-colors duration-200 w-full md:w-auto block text-center">
                  Family Camp Horse Activity Questionnaire
                </a>
              </div>
              <div className="bg-white rounded-lg shadow p-6 w-full">
                <p className="max-w-3xl text-lg font-bold mb-4">
                  Step 4: Sign-up for Wednesday Trip Day for each member of your party.
                </p>
                <Link
                  href="/trips"
                  className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded-lg shadow transition-colors duration-200 w-full md:w-auto block text-center">
                  Trip Sign-ups
                </Link>
              </div>
              <div className="bg-white rounded-lg shadow p-6 w-full">
                <p className="max-w-3xl text-lg font-bold mb-4">
                  Optional: View scheduled activities or edit your party list.
                </p>
                <div className="flex flex-col md:flex-row md:gap-4">
                  <Link
                    href="/schedule"
                    className="bg-yellow-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded-lg shadow transition-colors duration-200 mb-4 md:mb-0 w-full md:w-auto block text-center">
                    View Activity Schedules
                  </Link>
                  <Link
                    href="/remove"
                    className="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded-lg shadow transition-colors duration-200 w-full md:w-auto block text-center">
                    View/Remove Party Members
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProtectedPage;

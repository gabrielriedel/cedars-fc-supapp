'use client'

import SubmitUser from '@/components/SubmitUser';
import Link from "next/link";

const Home: React.FC = () => {
    return (
        <div className="flex min-h-screen bg-white">
            {/* Left Column for Form */}
            <div className="flex flex-col w-3/5 pl-20 pt-8">
                <Link
                    href="/protected"
                    className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center text-sm"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
                    >
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                    Back to dashboard
                </Link>
                <div className="flex justify-center items-center mt-10 mb-8">
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold py-2 px-8 bg-green-500 text-white rounded-full">
                        Add Party Member
                    </h1>
                </div>
                <SubmitUser />
                <Link 
                href="/activities"
                className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded-lg shadow transition-colors duration-200 mt-4"
            >
                Go to Activity Sign-ups --{'>'}
            </Link>
            </div>
            
            {/* Right Column for Instructions */}
            <div className="w-2/5 bg-green-100 p-8 text-green-800">
                <h2 className="text-2xl font-bold mb-4">Instructions for Adding Party Members</h2>
                <p className="text-lg leading-relaxed">
                    Please follow the steps below to add a new party member to your party's registration:
                </p>
                <ul className="list-disc pl-4 mt-4">
                    <li>Only add members that you plan on registering activities for.</li>
                    <li>The person who logged in still needs to add themself as a party member.</li>
                    <li>Enter the necessary details for each field, ensuring accuracy.</li>
                    <li>Double-check the information for typos or errors.</li>
                    <li>Submit the form once all fields are completed.</li>
                    <li>If you encounter any issues, use the 'Back' button to return to the previous page and try again.</li>
                </ul>
                <p className="mt-4">
                    Our system will automatically update your party list once the new member is successfully added. Thank you for updating your details!
                </p>
            </div>
        </div>
    );
    
    
};

export default Home;

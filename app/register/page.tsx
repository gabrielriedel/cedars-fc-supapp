'use client'

import SubmitUser from '@/components/SubmitUser';
import Link from "next/link";
import Image from 'next/image';
import logo from '@/assets/cedarslogo.png';

const Home: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 text-green-900 px-4 py-6 sm:py-10">
            {/* Top Navigation */}
            <div className="max-w-6xl mx-auto mb-6 sm:mb-8 flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    <Image src={logo} alt="Cedars Logo" width={40} height={40} />
                    <h1 className="text-lg sm:text-xl font-semibold">Cedars Family Camp</h1>
                </div>
                <Link
                    href="/protected"
                    className="text-sm font-medium text-green-800 hover:underline flex items-center"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4"
                    >
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                    Back to Dashboard
                </Link>
            </div>

            <div className="mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8 max-w-full sm:max-w-5xl">
                {/* Right Instruction Panel - appears first on mobile */}
                <div className="order-1 lg:order-2 lg:col-span-2 bg-green-100 border border-green-200 rounded-lg p-5 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Instructions</h3>
                    <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
                        <li>Only add members you plan to register for activities.</li>
                        <li>Be sure to add yourself to the party as well.</li>
                        <li>Fill out each field accurately and double-check for typos.</li>
                        <li>Click “Submit” once all information is complete.</li>
                        <li>If needed, use the back button to return and edit entries.</li>
                    </ul>
                    <p className="text-sm mt-4">
                        Your party list will automatically update after a member is added. Thanks for keeping your info current!
                    </p>
                </div>

                {/* Left Form Section */}
                <div className="order-2 lg:order-1 lg:col-span-3 bg-white rounded-lg shadow-md p-6 sm:p-8">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Add Party Member</h2>
                    <SubmitUser />
                    <Link 
                        href="/activities"
                        className="inline-block bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded-lg shadow mt-4 sm:mt-6 transition-colors duration-200"
                    >
                        Go to Activity Sign-ups &rarr;
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;

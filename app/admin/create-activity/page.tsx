'use client'

import ActivityCreate from '@/components/ActivityCreate';
import Link from "next/link";

const Home: React.FC = () => {
    return (
        <div className="flex flex-col w-full min-h-screen bg-white justify-center items-center">
            <div className="w-full max-w-4xl px-8">
                <Link
                    href="/admin/dashboard"
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
                <div className="flex justify-center">
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold py-2 px-8 my-4 bg-green-500 text-white rounded-full inline-block">
                        Create Activity
                    </h1>
                </div>
                <div className="flex justify-center">
                    <ActivityCreate />
                </div>
            </div>
        </div>
    );
};

export default Home;

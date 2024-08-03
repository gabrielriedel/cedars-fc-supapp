'use client'
import React from 'react';
import FamilySchedules from '@/components/FamilySchedules'; // Adjust path as needed
import Link from "next/link";

const Page: React.FC = () => {
    return (
        <div className="flex flex-col w-full min-h-screen bg-white text-green-800 pl-20 pt-8">
            <Link
                href="/admin/dashboard"
                className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
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
            <FamilySchedules />
        </div>
    );
};

export default Page;

import Link from 'next/link'

export default function NotApprovedPage() {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-bold text-red-600 mb-4">
          🚫 Access Denied
        </h1>
        <p className="text-lg mb-6">
          You have not been approved yet! Check back in a bit after an admin approves you.
        </p>
        <Link
          href="/"
          className="text-white bg-green-600 hover:bg-[#154734] px-6 py-3 rounded-md transition"
        >
          Return to Home
        </Link>
      </div>
    );
  }
  

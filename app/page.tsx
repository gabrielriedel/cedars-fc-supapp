import LoginButton from "@/components/LoginButton";
import logo from '@/assets/cedarslogo.png';
import Image from 'next/image';

export default async function Index() {

  return (
    <div className="flex-1 w-full flex flex-col items-center bg-white text-green-800">
      <nav className="w-full bg-green-500 text-white">
        <div className="max-w-4xl mx-auto flex justify-between items-center py-4 px-6">
          <h1 className="text-lg font-bold">Cedars Family Camp</h1>
          <LoginButton />
        </div>
      </nav>
      <div className="flex justify-center w-full mt-5">
        <Image src={logo} alt="Cedars Family Camp Logo" width={192} height={50} />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-10 p-5 animate-in">
        <h2 className="text-3xl font-bold text-center">
          Welcome Home to Cedars Family Camp!
        </h2>
        <p className="text-xl">
          Join us for a summer of adventure, memories, and JOY. Sign up or log in now to register for activities!
        </p>
        <p className="text-lg">
          IMPORTANT: Only one member of your party needs to make an account. A party would be the group that you would like to sign-up for activities.
        </p>
        <div className="flex gap-5">
          <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow transition-colors">
            Learn More
          </button>
          <button className="bg-white hover:bg-gray-100 text-green-600 font-bold py-3 px-6 rounded-lg shadow border border-green-600 transition-colors">
            View Activities
          </button>
        </div>
      </div>
    </div>
);


  
}

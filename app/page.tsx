import LoginButton from "@/components/LoginButton";
import logo from '@/assets/cedarslogo.png';
import Image from 'next/image';

export default async function Index() {
  return (
    <div className="flex-1 w-full flex flex-col items-center bg-white text-green-800">
      <nav className="w-full bg-green-500 text-white">
        <div className="max-w-4xl mx-auto flex justify-between items-center py-4 px-6">
          <div className="flex items-center gap-2">
            <Image src={logo} alt="Cedars Family Camp Logo" width={48} height={48} />
            <h1 className="text-lg font-bold">CedarS CampS</h1>
          </div>
          <LoginButton />
        </div>
      </nav>
      <div className="flex justify-center w-full mt-5">
        <Image src={logo} alt="Cedars Family Camp Logo" width={192} height={50} />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-10 p-5 animate-in">
        <h2 className="text-3xl font-bold text-center">
          Welcome Home to Cedars!
        </h2>
        <p className="text-xl text-center">
          Join us for a summer overflowing with Peace and Joy and POWER! From adventure to unforgettable memories, it all begins when you sign up or log in to register for activities.
        </p>
        <p className="text-lg">
          IMPORTANT: Only ONE member of your party needs to make an account to sign-up for activities for the group.
        </p>
        <div className="flex gap-5">
        <a
            href="https://cedarscamps.org/programs/family-camp/" // Replace with your desired URL
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow transition-colors"
          >
            Learn More
          </a>
          <a
            href="https://docs.google.com/document/d/1qfrNSjbw3rp7n3G6Uu1VkvJeVd8ELejbH38hymCQ1WY/edit?usp=sharing" // Replace with your desired URL
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white hover:bg-gray-100 text-green-600 font-bold py-3 px-6 rounded-lg shadow border border-green-600 transition-colors"
          >
            View Activities
          </a>
        </div>
      </div>
    </div>
  );
}

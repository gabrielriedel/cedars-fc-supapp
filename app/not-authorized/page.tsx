import Link from "next/link";

const NotAuthorized = () => {
  return (
    <div>
      <h1>Not Authorized</h1>
      <p>You do not have access to this page.</p>
      <Link href="/">Go to Homepage</Link>
    </div>
  );
};

export default NotAuthorized;

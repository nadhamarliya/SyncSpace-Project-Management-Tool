import { Link } from "react-router-dom";

const LandingHeader = () => {
  return (
    <header className="border-b">
      <div className="flex items-center justify-between px-8 py-5">
        <Link to="/" className="text-2xl font-bold">
          SyncSpace
        </Link>

        <nav className="flex items-center gap-6">
          <Link to="/sign-in">Sign In</Link>

          <Link
            to="/sign-up"
            className="rounded-lg bg-black px-5 py-2.5 text-white"
          >
            Get Started
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default LandingHeader;
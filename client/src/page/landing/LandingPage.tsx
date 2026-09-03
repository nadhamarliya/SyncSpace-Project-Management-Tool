import LandingHeader from "@/components/LandingHeader";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div>
      <LandingHeader />

      <main className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center px-8">
        <div className="grid w-full grid-cols-2 items-center gap-12">

          {/* Left side */}
          <div>
            <h2 className="mb-3 text-xl font-semibold">
              Sync Workspace
            </h2>

            <h1 className="mb-5 text-5xl font-bold leading-tight">
              Collaborate with your team
            </h1>

            <p className="mb-8 max-w-lg text-lg text-gray-600">
              Organise, track and assign tasks with SyncSpace right from
              your desktop.
            </p>

            <div className="flex gap-4">
              <Link
                to="/sign-up"
                className="rounded-lg bg-black px-6 py-3 font-medium text-white"
              >
                Get Started
              </Link>

              <Link
                to="/sign-in"
                className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-black"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Right side */}
          <div className="flex justify-center">
            <div className="h-96 w-full rounded-2xl bg-gray-100">
              {/* Image goes here */}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default LandingPage;
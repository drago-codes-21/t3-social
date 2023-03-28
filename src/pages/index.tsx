import { type NextPage } from "next";
import { SignInButton, useUser } from "@clerk/nextjs";
import CreatePostWizard from "~/components/CreatePostWizard";
import Feed from "~/components/Feed";
import PageLayout from "~/components/Layout";

const Home: NextPage = () => {
  const { isSignedIn, isLoaded: userLoaded } = useUser();

  if (!userLoaded) return <div />;
  return (
    <PageLayout>
      <main className="flex h-screen justify-center">
        <div className="w-full border-x border-slate-400 md:max-w-2xl">
          <div className="flex border-b border-slate-400 p-4">
            {!isSignedIn && (
              <div className="flex justify-center">
                <button
                  type="button"
                  className="mr-2 mb-2 rounded-lg bg-gradient-to-r from-green-400 via-green-500 to-green-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800"
                >
                  <SignInButton />
                </button>
              </div>
            )}
            {isSignedIn && <CreatePostWizard />}
          </div>
          <Feed />
        </div>
      </main>
    </PageLayout>
  );
};

export default Home;

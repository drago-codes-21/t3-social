import { type NextPage } from "next";
import Head from "next/head";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import CreatePostWizard from "~/components/CreatePostWizard";
import { Fragment } from "react";
import Feed from "~/components/Feed";

const Home: NextPage = () => {
  const { isSignedIn, isLoaded: userLoaded } = useUser();

  if (!userLoaded) return <div />;

  return (
    <Fragment>
      <Head>
        <title>SocialStack</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex h-screen justify-center">
        <div className="w-full border-x border-slate-400 md:max-w-2xl">
          <div className="flex border-b border-slate-400 p-4">
            {!isSignedIn && (
              <div className="flex justify-center">
                <SignInButton />
              </div>
            )}
            {isSignedIn && <CreatePostWizard />}
          </div>
          <Feed />
        </div>
      </main>
    </Fragment>
  );
};

export default Home;

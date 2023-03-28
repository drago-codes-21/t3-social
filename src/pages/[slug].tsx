import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { Fragment } from "react";
// import { api } from "~/utils/api";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";

const ProfilePage: NextPage = () => {
  // const { data, isLoading } = api.profile.getUserByUsername.useQuery({
  //   username: "drago-codes-21",
  // });
  // console.log(data);
  // if (isLoading) return <div>Loading </div>;
  // if (!data) return <div>404</div>;
  return (
    <Fragment>
      <Head>
        <title>Profile 😎</title>
      </Head>

      <main className="flex h-screen justify-center">
        <div className="w-full border-x border-slate-400 md:max-w-2xl">
          Profile View{" "}
        </div>
      </main>
    </Fragment>
  );
};
export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("no slug");

  const username = slug.replace("@", "");

  await ssg.profile.getUserByUsername.prefetch({ username });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default ProfilePage;

import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { Fragment } from "react";
import ProfileFeed from "~/components/ProfileFeed";
import PageLayout from "~/components/Layout";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { api } from "~/utils/api";
import Image from "next/image";

const ProfilePage: NextPage<{ username: string; id: string }> = ({ id }) => {
  const { data } = api.profile.getUserById.useQuery({
    id: id,
  });
  if (!data) return <div />;
  return (
    <Fragment>
      <Head>
        <title>Profile 😎</title>
      </Head>

      <PageLayout>
        <div className="relative h-36 bg-slate-600">
          <Image
            src={data.profileImageUrl}
            alt={`${data.name}'s profile pic`}
            width={128}
            height={128}
            className="absolute bottom-0 left-0 -mb-[64px] ml-4 rounded-full border-4 border-black bg-black"
          />
        </div>
        <div className="h-[64px]"></div>
        <div className="p-4 text-2xl font-bold">{`@${data.name}`}</div>
        <div className="w-full border-b border-slate-400" />
        <ProfileFeed userId={id} />
      </PageLayout>
    </Fragment>
  );
};
export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("no slug");

  const username = slug.replace("@", "");
  const id = slug.replace("@", "");
  await ssg.profile.getUserById.prefetch({ id });
  await ssg.profile.getUserByUsername.prefetch({ username });
  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
      id,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default ProfilePage;

import React from "react";
import { api } from "~/utils/api";
import Loading from "./Loading";
import PostView from "./PostView";

const Feed = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();

  if (postsLoading) return <Loading />;
  if (!data) return <div>Something went wrong</div>;

  return (
    <div className="flex flex-col">
      {data?.map((fullPost) => {
        return <PostView key={fullPost.post?.id} {...fullPost} />;
      })}
    </div>
  );
};

export default Feed;

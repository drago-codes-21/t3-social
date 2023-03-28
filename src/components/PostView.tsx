import Image from "next/image";
import React from "react";
import type { RouterOutputs } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

type PostWithUser = RouterOutputs["posts"]["getAll"][number];
dayjs.extend(relativeTime);

const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div key={post.id} className="flex gap-4 border-b border-slate-400 p-8">
      <Image
        src={author.profileImageUrl}
        alt="Profile image"
        className="h-14 w-14 rounded-full"
        width={30}
        height={30}
      />
      <div className="flex flex-col">
        <div className="gap-3 font-bold text-slate-300">
          <span>@{author.username}</span>
          <span className="font-thin">{` . ${dayjs(
            post.createdAt
          ).fromNow()}`}</span>
        </div>
        <span>{post.content}</span>
      </div>
    </div>
  );
};

export default PostView;

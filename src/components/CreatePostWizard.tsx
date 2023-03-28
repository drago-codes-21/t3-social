import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import React, { useState } from "react";
import { api } from "~/utils/api";

const CreatePostWizard = () => {
  const { user } = useUser();
  const [text, setText] = useState("");
  const ctx = api.useContext();
  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setText("");
      void ctx.posts.getAll.invalidate();
    },
  });
  if (!user) return null;
  return (
    <div className="flex w-full gap-4">
      <Image
        src={user.profileImageUrl}
        alt="Profile image"
        className="h-14 w-14 rounded-full"
        width={56}
        height={56}
      />
      <input
        placeholder="Share your post..."
        className="grow bg-transparent outline-none"
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={isPosting}
      />
      <button
        type="button"
        className="mr-2 mb-2 rounded-lg bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-pink-300 dark:focus:ring-pink-800"
        onClick={() => mutate({ content: text })}
      >
        Submit
      </button>
    </div>
  );
};

export default CreatePostWizard;

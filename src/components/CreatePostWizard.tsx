import { SignOutButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import React, { useState } from "react";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";

const CreatePostWizard = () => {
  const { user } = useUser();
  const [text, setText] = useState("");
  const ctx = api.useContext();
  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setText("");
      void ctx.posts.getAll.invalidate();
      toast.success("Your post has been successfully shared");
    },
    onError: () => {
      toast.error("Post should be between 1 to 280 characters...");
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
        disabled={isPosting}
      >
        Submit
      </button>
      <button className="mr-2 mb-2 rounded-lg bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:focus:ring-cyan-800">
        <SignOutButton />
      </button>
    </div>
  );
};

export default CreatePostWizard;

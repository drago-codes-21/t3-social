import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import React from "react";

const CreatePostWizard = () => {
  const { user } = useUser();
  if (!user) return null;
  return (
    <div className="flex w-full gap-4 ">
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
      />
    </div>
  );
};

export default CreatePostWizard;

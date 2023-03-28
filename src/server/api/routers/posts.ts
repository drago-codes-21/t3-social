// import { z } from "zod";

import type { User } from "@clerk/nextjs/dist/api";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const filterUserForClient = (user : User) => {
  const name = (user.firstName === null ? "" : user.firstName + " ") + 
              (user.lastName === null ? "" : user.lastName) 
  console.log(user)
  return {
    id : user.id,
    username : name,
    profileImageUrl : user.profileImageUrl
  }
}

export const postsRouter = createTRPCRouter({
 
  getAll: publicProcedure.query(async({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take : 100
    });
    const users = (await clerkClient.users.getUserList({
      userId : posts.map((post) => post.authorId),
      limit : 100
    })).map(filterUserForClient)
    console.log(users);

    return posts.map((post) => {

      const author = users.find((user) => user.id === post.authorId);
  
      if (!author) {
        console.error("AUTHOR NOT FOUND", post);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Author for post not found. POST ID: ${post.id}, USER ID: ${post.authorId}`,
        });
      }
      
      return {
        post,
        author : {
          ...author,
          username : author.username
        }
      };
    });
  }),
});
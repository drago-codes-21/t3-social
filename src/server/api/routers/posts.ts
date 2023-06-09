import type { User } from "@clerk/nextjs/dist/api";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";
import type{post} from '@prisma/client'

const filterUserForClient = (user : User) => {
  let name = (user.firstName === null ? "" : user.firstName ) 
  if(user.username != null)
    name = user.username
  name = name
    return {
    id : user.id,
    username : name,
    profileImageUrl : user.profileImageUrl
  }
}

import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";

// Create a new ratelimiter, that allows 5 requests per 1 min
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 m"),
  analytics: true
});
const addUserDataToPosts = async (posts: post[]) => {
  const userId = posts.map((post) => post.authorId);
  const users = (
    await clerkClient.users.getUserList({
      userId: userId,
      limit: 110,
    })
  ).map(filterUserForClient);

  return posts.map((post) => {

    const author = users.find((user) => user.id === post.authorId);

    if (!author) {
      console.error("AUTHOR NOT FOUND", post);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Author for post not found. POST ID: ${post.id}, USER ID: ${post.authorId}`,
      });
    }
    if (!author.username) {
      // user the ExternalUsername
      author.username = author.id;
    }
    return {
      post,
      author: {
        ...author,
        username: author.username ?? "(username not found)",
      },
    };
  });
};
export const postsRouter = createTRPCRouter({
 
  getAll: publicProcedure.query(async({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take : 100,
      orderBy : [{createdAt : 'desc'}]
    });
    const users = (await clerkClient.users.getUserList({
      userId : posts.map((post) => post.authorId),
      limit : 100
    })).map(filterUserForClient)

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
        author
      };
    });
  }),
  getPostsByUserId: publicProcedure
  .input(
    z.object({
      userId: z.string(),
    })
  )
  .query(({ ctx, input }) =>
    ctx.prisma.post
      .findMany({
        where: {
          authorId: input.userId,
        },
        take: 100,
        orderBy: [{ createdAt: "desc" }],
      })
      .then(addUserDataToPosts)
  ), 
  create: privateProcedure.input(z.object({
    content : z.string().min(1).max(280)
  })).mutation(async({ctx, input}) => {
    const authorId = ctx.userId
    const {success} = await ratelimit.limit(authorId)

    if(!success) throw new TRPCError({code : "TOO_MANY_REQUESTS"})
    const post = await ctx.prisma.post.create({
      data : {
        authorId,
        content : input.content
      }
    });
    return post
  }),
});
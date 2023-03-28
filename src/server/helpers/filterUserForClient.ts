import type { User } from "@clerk/nextjs/dist/api";
export const filterUserForClient = (user: User) => {
  // const {externalAccounts} = user
  // const provider = externalAccounts[0]?.provider
  // const account = (provider === "oauth_github"  ? externalAccounts[0]?.username : externalAccounts[0]?.id)
  return {
    id: user.id,
    username: (user.username),
    profileImageUrl: user.profileImageUrl,
    externalUsername: user.externalAccounts.find(
      (externalAccount) => externalAccount.provider === "oauth_github")?.username || null 
    // externalAccounts : account
  };
};
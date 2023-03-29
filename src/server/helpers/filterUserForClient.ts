import type { User } from "@clerk/nextjs/dist/api";
export const filterUserForClient = (user: User) => {
  return {
    id: user.id,
    username: (user.username),
    profileImageUrl: user.profileImageUrl,
    externalUsername: user.externalAccounts.find(
      (externalAccount) => externalAccount.provider === "oauth_github")?.username || null 
  };
};

export const filterUserForGoogleAuth = (user : User) => {
  const name = (user.firstName && user.lastName ? (user.firstName + user.lastName) : "");
  return {
    id : user.id,
    name : name,
    profileImageUrl : user.profileImageUrl,
  }
}
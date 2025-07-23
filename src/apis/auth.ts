import { Http } from "../types/Http";
import { type UserProfile } from "../types/UserProfile";
export const getAccessToken = async () =>
  await Http.get("/auth/v2/access-token/");
export const deleteRefreshToken = async () =>
  await Http.delete("/auth/v2/refresh-token/revoke/");
export const getUserProfile = async () =>
  await Http.get("/auth/v2/profile/me/");
export const deleteUserProfile = async () =>
  await Http.delete("/auth/v2/profile/me/");
export const putUserProfile = async (userProfile:UserProfile) =>
  await Http.put("/auth/v2/profile/me/",userProfile);

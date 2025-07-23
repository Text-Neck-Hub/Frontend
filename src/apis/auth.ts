import { Http } from "../types/Http";
export const getAccessToken = async () =>
  await Http.get("/auth/v2/access-token/");
export const deleteRefreshToken = async () =>
  await Http.delete("/auth/v2/refresh-token/revoke/");
export const getUserProfile = async () =>
  await Http.get("/auth/v2/profile/me/");

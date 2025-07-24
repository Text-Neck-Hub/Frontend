import { Http } from "../types/Http";
export const getAccessToken = async () =>
  await Http.get("/auth/v2/access-token/");
export const deleteRefreshToken = async () =>
  await Http.delete("/auth/v2/refresh-token/revoke/");
export const getUserProfile = async () =>
  await Http.get("/auth/v2/profile/me/");
export const deleteUserProfile = async () =>
  await Http.delete("/auth/v2/profile/me/");
export const putUserProfile = async (formData: FormData) =>
  await Http.put("/auth/v2/profile/me/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    transformRequest: (data) => data,
  });
export const refreshAccessToken = async () =>
  await Http.post("/auth/v2/access-token/refresh/");

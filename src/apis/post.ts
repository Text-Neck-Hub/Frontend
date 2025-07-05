import { type PaginationParams } from "../types/PaginationParams";
import { type PostProps } from "../types/Post";
import { Http } from "../types/Http";

export const getPostList = async (params?: PaginationParams) =>
  await Http.get("/v1/posts/", params);

export const getPostDetail = async (id: number) =>
  await Http.get(`/v1/posts/${id}`);

export const deletePost = async (id: number) =>
  await Http.delete(`/v1/posts/${id}`);

export const updatePost = async (id: number, postData: PostProps) =>
  await Http.put(`/v1/posts/${id}`, postData);

export const writePost = async (postData: PostProps) =>
  await Http.post("/v1/posts/", postData);

export const getCommentList = async (
  postId: number,
  params?: PaginationParams
) => await Http.get(`/v1/posts/${postId}/comments`, params);

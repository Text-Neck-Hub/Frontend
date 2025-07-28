import { type PaginationParams } from "../types/PaginationParams";
import { type PostProps, type PostDetailProps } from "../types/Post";
import { Http } from "../types/Http";
import { type CommentProps } from "../types/Comment";
import { type Board } from "../types/Board";

export const getBoardList = async (): Promise<Board[]> =>
  await Http.get<Board[]>("/board/v1/");

export const getPostList = async (
  category: string, 
  params?: PaginationParams
): Promise<PostProps[]> =>
  await Http.get<PostProps[]>(`/board/v1/${category}/posts/`, params);

export const getPostDetail = async (
  category: string, 
  id: number
): Promise<PostDetailProps> =>
  await Http.get<PostDetailProps>(`/board/v1/${category}/posts/${id}/`);

export const deletePost = async (
  category: string, 
  id: number
): Promise<void> =>
  await Http.delete(`/board/v1/${category}/posts/${id}/`);

export const updatePost = async (
  category: string, 
  id: number,
  postData: PostDetailProps
): Promise<PostDetailProps> =>
  await Http.put<PostDetailProps>(
    `/board/v1/${category}/posts/${id}/`,
    postData
  );

export const writePost = async (
  category: string, 
  postData: PostDetailProps
): Promise<PostDetailProps> =>
  await Http.post<PostDetailProps>(
    `/board/v1/${category}/posts/`,
    postData
  );

export const getCommentList = async (
  postId: number,
  params?: PaginationParams
): Promise<CommentProps[]> =>
  await Http.get<CommentProps[]>(`/board/v1/posts/${postId}/comments`, params);

export const writeComment = async (
  postId: number,
  content: string
): Promise<CommentProps> =>
  await Http.post<CommentProps>(`/board/v1/posts/${postId}/comments`, {
    content,
  });

export const updateComment = async (
  commentId: number,
  content: string
): Promise<CommentProps> =>
  await Http.put<CommentProps>(`/board/v1/comments/${commentId}`, { content });

export const deleteComment = async (
  commentId: number
): Promise<void> =>
  await Http.delete(`/board/v1/comments/${commentId}`);
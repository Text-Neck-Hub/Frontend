import { type PaginationParams } from "../types/PaginationParams";
import { type PostProps, type PostDetailProps } from "../types/Post";
import { Http } from "../types/Http";
// 🚨🚨🚨 CommentListProps 대신 CommentProps를 불러와야 해! 🚨🚨🚨
import { type CommentProps } from "../types/Comment";

// 이 파일에 임시로 정의했던 CommentProps는 이제 필요 없어!
// export interface CommentProps { /* ... */ }

export const getPostList = async (
  category: string,
  params?: PaginationParams
): Promise<PostProps[]> =>
  await Http.get<PostProps[]>(`/v1/boards/${category}/posts/`, params);

export const getPostDetail = async (
  category: string,
  id: number
): Promise<PostDetailProps> =>
  await Http.get<PostDetailProps>(`/v1/boards/${category}/posts/${id}`);

export const deletePost = async (category: string, id: number): Promise<void> =>
  await Http.delete(`/v1/boards/${category}/posts/${id}`);

export const updatePost = async (
  category: string,
  id: number,
  postData: PostDetailProps
): Promise<PostDetailProps> =>
  await Http.put<PostDetailProps>(
    `/v1/boards/${category}/posts/${id}`,
    postData
  );

export const writePost = async (
  category: string,
  postData: PostDetailProps
): Promise<PostDetailProps> =>
  await Http.post<PostDetailProps>(`/v1/boards/${category}/posts/`, postData);

export const getCommentList = async (
  postId: number,
  params?: PaginationParams
): Promise<CommentProps[]> => // 👈 CommentListProps 대신 CommentProps[]로 수정!
  await Http.get<CommentProps[]>(`/v1/posts/${postId}/comments`, params);

export const writeComment = async (
  postId: number,
  content: string
): Promise<CommentProps> => // 👈 CommentListProps 대신 CommentProps로 수정!
  await Http.post<CommentProps>(`/v1/posts/${postId}/comments`, {
    content,
  });

export const updateComment = async (
  commentId: number,
  content: string
): Promise<CommentProps> => // 👈 CommentListProps 대신 CommentProps로 수정!
  await Http.put<CommentProps>(`/v1/comments/${commentId}`, { content });

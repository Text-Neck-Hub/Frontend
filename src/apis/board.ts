import { type PaginationParams } from "../types/PaginationParams";
import { type PostProps, type PostDetailProps } from "../types/Post";
import { Http } from "../types/Http";
import { type CommentProps } from "../types/Comment";
import { type Board } from "../types/Board";
export const getBoardList = async (): Promise<Board[]> =>
  await Http.get<Board[]>("/board/v1/");

export const getPostList = async (
  category: string, // category는 board_slug를 의미
  params?: PaginationParams
): Promise<PostProps[]> =>
  // Nginx: /board/ -> board:8000/
  // Backend: board:8000/v1/boards/<category_slug>/posts/
  await Http.get<PostProps[]>(`/board/v1/${category}/posts/`, params);

export const getPostDetail = async (
  category: string, // category는 board_slug를 의미
  id: number
): Promise<PostDetailProps> =>
  // Nginx: /board/ -> board:8000/
  // Backend: board:8000/v1/boards/<category_slug>/posts/<id>/
  await Http.get<PostDetailProps>(`/board/v1/boards/${category}/posts/${id}`);

export const deletePost = async (
  category: string, // category는 board_slug를 의미
  id: number
): Promise<void> =>
  // Nginx: /board/ -> board:8000/
  // Backend: board:8000/v1/boards/<category_slug>/posts/<id>/
  await Http.delete(`/board/v1/boards/${category}/posts/${id}`);

export const updatePost = async (
  category: string, // category는 board_slug를 의미
  id: number,
  postData: PostDetailProps
): Promise<PostDetailProps> =>
  // Nginx: /board/ -> board:8000/
  // Backend: board:8000/v1/boards/<category_slug>/posts/<id>/
  await Http.put<PostDetailProps>(
    `/board/v1/boards/${category}/posts/${id}`,
    postData
  );

export const writePost = async (
  category: string, // category는 board_slug를 의미
  postData: PostDetailProps
): Promise<PostDetailProps> =>
  // Nginx: /board/ -> board:8000/
  // Backend: board:8000/v1/boards/<category_slug>/posts/
  await Http.post<PostDetailProps>(
    `/board/v1/boards/${category}/posts/`,
    postData
  );

export const getCommentList = async (
  postId: number,
  params?: PaginationParams
): Promise<CommentProps[]> =>
  // Nginx: /board/ -> board:8000/
  // Backend: board:8000/v1/posts/<post_id>/comments/
  await Http.get<CommentProps[]>(`/board/v1/posts/${postId}/comments`, params);

export const writeComment = async (
  postId: number,
  content: string
): Promise<CommentProps> =>
  // Nginx: /board/ -> board:8000/
  // Backend: board:8000/v1/posts/<post_id>/comments/
  await Http.post<CommentProps>(`/board/v1/posts/${postId}/comments`, {
    content,
  });

export const updateComment = async (
  commentId: number,
  content: string
): Promise<CommentProps> =>
  // Nginx: /board/ -> board:8000/
  // Backend: board:8000/v1/comments/<comment_id>/
  await Http.put<CommentProps>(`/board/v1/comments/${commentId}`, { content });

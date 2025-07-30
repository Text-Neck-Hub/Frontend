
import { type Post, type PostDetail } from "../types/Post";
import { Http } from "../types/Http";
import { type Comment } from "../types/Comment";
import { type Board } from "../types/Board";



export const getBoardList = async (): Promise<Board[]> =>
  await Http.get<Board[]>("/board/v1/");

export const deletePost = async (category: string, id: number): Promise<void> =>
  await Http.delete(`/board/v1/${category}/posts/${id}/`);
export const getPostList= async (category:string):Promise<Post[]>=>
  await Http.get(`/board/v1/${category}/posts/`);
export const getPostDetail= async (category:string,post_id:number):Promise<PostDetail>=>
  await Http.get(`/board/v1/${category}/posts/${post_id}/`);
export const updatePost = async (
  category: string,
  id: number,
  postData: PostDetail
): Promise<PostDetail> =>
  await Http.put<PostDetail>(
    `/board/v1/${category}/posts/${id}/`,
    postData
  );

export const writePost = async (
  category: string,
  postData: PostDetail
): Promise<PostDetail> =>
  await Http.post<PostDetail>(`/board/v1/${category}/posts/`, postData);

export const getCommentList = async (
  postId: number,
  category: string,

): Promise<Comment[]> =>
  await Http.get<Comment[]>(
    `/board/v1/${category}/posts/${postId}/comments/`
  );

export const writeComment = async (
  postId: number,
  category: string,
  content: string
): Promise<Comment> =>
  await Http.post<Comment>(
    `/board/v1/${category}/posts/${postId}/comments/`,
    {
      content,
    }
  );

export const updateComment = async (
  category: string,
  postId: number,
  commentId: number,
  content: string
): Promise<Comment> =>
  await Http.put<Comment>(
    `/board/v1/${category}/posts/${postId}/comments/${commentId}/`,
    { content }
  );

export const deleteComment = async (
  category: string,
  postId: number,
  commentId: number
): Promise<void> =>
  await Http.delete(
    `/board/v1/${category}/posts/${postId}/comments/${commentId}/`
  );



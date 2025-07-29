export interface PostProps {
  id: number;
  title: string;
  thumbnail?: string;
  author: string;
  createdAt: string;
}

export interface PostListProps {
  posts: PostProps[];
}

export type PostDetailProps = {
  id: number;
  title: string;
  content: string;
  author: number; 
  email: string;
  board: number; 
  created_at: string;
  updated_at: string;
  thumbnail: string | null;
 
  likes_count?: number; 
  is_liked_by_user?: boolean; 
};
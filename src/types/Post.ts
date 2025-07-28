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

export interface PostDetailProps extends Omit<PostProps, 'id' | 'author' | 'createdAt'> {
  id?: number;
  author?: string;
  createdAt?: string;
  content: string;
  views?: number;
  likes?: number;
  urls?: string[];
}
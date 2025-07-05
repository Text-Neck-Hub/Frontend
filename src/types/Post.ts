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


export interface PostDetailProps extends PostProps {
  content: string;
  views: number;
  likes: number;
  urls?: string[];
}


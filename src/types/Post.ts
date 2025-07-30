export interface Post {
  id: number;
  title: string;
  author: number;
  createdAt?: string;
  thumbnailUrl?: string; 
}

export interface PostDetail extends Post {
  content: string;
  thumbnailFile?: File | undefined; 
}

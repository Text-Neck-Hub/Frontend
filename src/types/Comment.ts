export interface CommentProps {
  id: number;
  postId: number;
  author: number;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CommentListProps {
  comments?: CommentProps[];
}

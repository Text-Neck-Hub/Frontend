export interface CommentProps {
  id: number;
  postId: number;
  author: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CommentListProps {
  comments?: CommentProps[];
}

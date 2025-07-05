export interface CommentProps {
  id: number;
  content: string;
  createdAt: string;
}

export interface CommentListProps {
  comments?: CommentProps[];
}
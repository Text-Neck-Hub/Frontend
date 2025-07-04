// src/types/post.ts

export interface Post {
  id: number;
  title: string;
  thumbnail?: string;
  // 게시글의 다른 속성들도 여기에 추가할 수 있어!
  // content: string;
  // author: string;
  // createdAt: string;
}

export interface PostListProps {
  posts: Post[]; // 💖 Post 인터페이스를 재사용!
}

// 만약 게시글 상세 페이지를 위한 타입이 있다면 여기에 추가!
export interface PostDetail extends Post {
  content: string;
  author: string;
  createdAt: string;
  views: number;
  // ... 기타 상세 정보
}
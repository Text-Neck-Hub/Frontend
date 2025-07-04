import React from 'react';
import styled from 'styled-components';
import { PostList } from '../components/PostList';
import type { PostProps } from '../types/post';


const BoardContainer = styled.div`
  max-width: 700px;
  margin: 2rem auto;
  padding: 2rem 1rem;
`;

const posts:PostProps[] = [
  {
    id: 1,
    title: '첫 번째 게시글',
    author: '홍길동',
    createdAt: '2023-10-01',
    thumbnail: 'https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif',

  },
  {
    id: 2,
    title: '두 번째 게시글',
    author: '홍길동',
    createdAt: '2023-10-01',
    thumbnail: 'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif',

  },
];

export const BoardListPage: React.FC = () => {


  return (
    <BoardContainer>
      <h1>게시판</h1>

      <PostList posts={posts} />
    </BoardContainer>
  );
};
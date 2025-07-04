import React, { useState } from 'react';
import styled from 'styled-components';
import { Post } from '../components/Post';
import { CommentList } from '../components/CommentList';
import { PostList } from '../components/PostList';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const BoardContainer = styled.div`
  max-width: 700px;
  margin: 2rem auto;
  padding: 2rem 1rem;
`;

const posts = [
  {
    id: 1,
    title: '첫 번째 게시글',
    content: '<p>이것은 <b>첫 번째</b> 게시글의 <i>내용</i>입니다.</p>',
    thumbnail: 'https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif',
    comments: ['좋은 글이네요!', '감사합니다.'],
  },
  {
    id: 2,
    title: '두 번째 게시글',
    content: '<p>두 번째 게시글 <u>내용</u>입니다.</p>',
    thumbnail: 'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif',
    comments: ['흥미롭네요.', '잘 읽었습니다.'],
  },
];

export const BoardListPage: React.FC = () => {
  
  

  return (
    <BoardContainer>
      <h1>게시판</h1>
      
      <PostList posts={posts.map(({ id, title, thumbnail }) => ({ id, title, thumbnail }))} />
    </BoardContainer>
  );
};

import React from 'react';
import styled from 'styled-components';
import { Thumbnail } from './Thumbnail';

const PostListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const PostPreview = styled.div`
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(60, 64, 67, 0.08);
  padding: 1.5rem 2rem;
  cursor: pointer;
  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: 0 4px 16px rgba(60, 64, 67, 0.15);
  }
`;

const Title = styled.h2`
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
`;

export interface PostListProps {
  posts: { id: number; title: string; thumbnail?: string }[];
  onSelect: (id: number) => void;
}

export const PostList: React.FC<PostListProps> = ({ posts, onSelect }) => (
  <PostListContainer>
    {posts.map((post) => (
      <PostPreview key={post.id} onClick={() => onSelect(post.id)}>
        {post.thumbnail && <Thumbnail src={post.thumbnail} />}
        <Title>{post.title}</Title>
      </PostPreview>
    ))}
  </PostListContainer>
);

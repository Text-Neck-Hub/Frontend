import React from "react";
import styled from "styled-components";
import { Thumbnail } from "./Thumbnail";
import { useNavigate } from "react-router-dom";
import type { PostListProps } from "../../types/Post";


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

export const PostList: React.FC<PostListProps & { boardSlug: string }> = ({ posts, boardSlug }) => {
  const navigate = useNavigate();

  

  return (
    <PostListContainer>
      
      {posts.map((post) => (
        <PostPreview
          key={post.id}
          onClick={() => {
            navigate(`/boards/${boardSlug}/posts/${post.id}/`);
          }}
        >
          {post.thumbnail && <Thumbnail src={post.thumbnail} />}
          <Title>{post.title}</Title>
        </PostPreview>
      ))}
    </PostListContainer>
  );
};
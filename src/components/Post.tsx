import React from "react";
import styled from "styled-components";
import type { PostProps } from "../types/Post";
const PostContainer = styled.div`
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(60, 64, 67, 0.08);
  margin-bottom: 2rem;
  padding: 2rem;
`;

const Title = styled.h2`
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
`;

export const Post: React.FC<PostProps> = ({ title }) => (
  <PostContainer>
    <Title>{title}</Title>
  </PostContainer>
);

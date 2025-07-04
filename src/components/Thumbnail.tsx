import React from 'react';
import type { ThumbnailProps } from '../types/thumbnail';
import styled from 'styled-components';

const ThumbnailImg = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 0.5rem;
  margin-right: 1rem;
  background: #eee;
`;



export const Thumbnail: React.FC<ThumbnailProps> = ({ src, alt }) => (
  <ThumbnailImg src={src} alt={alt || 'thumbnail'} />
);

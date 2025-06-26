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

export const BoardPage: React.FC = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editThumbnail, setEditThumbnail] = useState('');

  const selectedPost = posts.find((p) => p.id === selectedId);

  return (
    <BoardContainer>
      <h1>게시판</h1>
      {selectedPost ? (
        <>
          <button onClick={() => setSelectedId(null)} style={{ marginBottom: '1rem' }}>← 목록으로</button>
          <button onClick={() => {
            setIsEditing(true);
            setEditTitle(selectedPost.title);
            setEditContent(selectedPost.content);
            setEditThumbnail(selectedPost.thumbnail || '');
          }} style={{ marginLeft: '1rem' }}>수정</button>
          <button onClick={() => {/* 삭제 로직 */}} style={{ marginLeft: '1rem', color: 'red' }}>삭제</button>
          {isEditing ? (
            <div style={{ marginTop: '1rem' }}>
              <input value={editTitle} onChange={e => setEditTitle(e.target.value)} placeholder="제목" style={{ width: '100%', marginBottom: 8 }} />
              <input value={editThumbnail} onChange={e => setEditThumbnail(e.target.value)} placeholder="썸네일 URL (gif 가능)" style={{ width: '100%', marginBottom: 8 }} />
              <ReactQuill value={editContent} onChange={setEditContent} />
              <button onClick={() => {/* 저장 로직 */}} style={{ marginTop: 8 }}>저장</button>
              <button onClick={() => setIsEditing(false)} style={{ marginLeft: 8 }}>취소</button>
            </div>
          ) : (
            <Post title={selectedPost.title} content={''}>
              {selectedPost.thumbnail && <img src={selectedPost.thumbnail} alt="썸네일" style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8, marginBottom: 16 }} />}
              <ReactQuill value={selectedPost.content} readOnly theme="bubble" />
              <h3 style={{ marginTop: '2rem' }}>댓글</h3>
              <CommentList comments={selectedPost.comments} />
            </Post>
          )}
        </>
      ) : (
        <>
          <button onClick={() => setIsEditing(true)} style={{ marginBottom: 16 }}>글쓰기</button>
          {isEditing && (
            <div style={{ marginBottom: 16 }}>
              <input value={editTitle} onChange={e => setEditTitle(e.target.value)} placeholder="제목" style={{ width: '100%', marginBottom: 8 }} />
              <input value={editThumbnail} onChange={e => setEditThumbnail(e.target.value)} placeholder="썸네일 URL (gif 가능)" style={{ width: '100%', marginBottom: 8 }} />
              <ReactQuill value={editContent} onChange={setEditContent} />
              <button onClick={() => {/* 저장 로직 */}} style={{ marginTop: 8 }}>저장</button>
              <button onClick={() => setIsEditing(false)} style={{ marginLeft: 8 }}>취소</button>
            </div>
          )}
          <PostList posts={posts.map(({ id, title, thumbnail }) => ({ id, title, thumbnail }))} onSelect={setSelectedId} />
        </>
      )}
    </BoardContainer>
  );
};

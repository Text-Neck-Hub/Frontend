// src/pages/ProfilePage.tsx

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile, putUserProfile } from '../apis/auth';
import axios from 'axios';
import { isOwner } from '../utils/profile';
import {type UserProfile } from '../types/UserProfile';




const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  margin: 2rem auto;
  max-width: 600px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const ProfileHeader = styled.h2`
  color: #333;
  margin-bottom: 1.5rem;
`;

const ProfileInfo = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
`;

const Label = styled.span`
  font-weight: bold;
  color: #555;
`;

const Value = styled.span`
  color: #333;
`;

const LoadingText = styled.p`
  color: #007bff;
  font-size: 1.2rem;
`;

const ErrorText = styled.p`
  color: #dc3545;
  font-size: 1.2rem;
  font-weight: bold;
`;

const ButtonGroup = styled.div`
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
`;

const Button = styled.button<{ primary?: boolean }>`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s ease;

  background-color: ${(props) => (props.primary ? '#007bff' : '#6c757d')};
  color: white;

  &:hover {
    background-color: ${(props) => (props.primary ? '#0056b3' : '#5a6268')};
  }
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  flex-grow: 1;
  font-size: 1rem;
`;



const ProfilePage: React.FC = () => {
  const { isLoggedIn } = useAuth(); 
 
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editProfile, setEditProfile] = useState<Partial<UserProfile>>({});

  





  const loadUserProfile = async () => {
    

    

    try {
      setLoading(true);
      setError(null);
      setUserProfile(await getUserProfile());
 
      
     
    } catch (err) {
      console.error("사용자 프로필 가져오기 실패:", err);
      if (axios.isAxiosError(err) && err.response) {
        
        if (err.response.status === 404) {
          setError("해당 사용자를 찾을 수 없습니다.");
        } else {
          setError(`프로필 정보를 가져오는 데 실패했습니다: ${err.response.status} ${err.response.statusText}`);
        }
      } else {
        setError("프로필 정보를 가져오는 데 실패했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadUserProfile(); 
  }, [isLoggedIn]); 


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!userProfile?.id) return;

    setLoading(true);
    setError(null);

    try {
      const updatedProfile = await putUserProfile(userProfile);
      setUserProfile(updatedProfile);
      setIsEditing(false);
      alert("프로필이 성공적으로 업데이트되었습니다!");
    } catch (err) {
      console.error("프로필 업데이트 실패:", err);
      if (axios.isAxiosError(err) && err.response) {
        setError(`프로필 업데이트 실패: ${err.response.status} ${err.response.statusText} - ${err.response.data.detail || JSON.stringify(err.response.data)}`);
      } else {
        setError("프로필 업데이트 중 알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditProfile(userProfile || {});
  };



  if (loading) {
    return (
      <ProfileContainer>
        <LoadingText>프로필을 불러오는 중입니다...</LoadingText>
      </ProfileContainer>
    );
  }

  if (error) {
    return (
      <ProfileContainer>
        <ErrorText>{error}</ErrorText>
        <ButtonGroup>
          <Button onClick={loadUserProfile}>다시 시도</Button>
        </ButtonGroup>
      </ProfileContainer>
    );
  }

  if (!userProfile) {
    return (
      <ProfileContainer>
        <ErrorText>표시할 프로필 정보가 없습니다.</ErrorText>
      </ProfileContainer>
    );
  }


  const isProfileOwner = isOwner(profileId);

  return (
    <ProfileContainer>
      <ProfileHeader>{isProfileOwner ? '내 프로필' : `${userProfile.username}의 프로필`}</ProfileHeader> {/* 헤더 변경 */}
      <ProfileInfo>
        <InfoRow>
          <Label>사용자 ID:</Label>
          <Value>{userProfile.id}</Value>
        </InfoRow>
        <InfoRow>
          <Label>사용자 이름:</Label>
          {isEditing ? (
            <Input
              type="text"
              name="username"
              value={editProfile.username || ''}
              onChange={handleChange}
            />
          ) : (
            <Value>{userProfile.username}</Value>
          )}
        </InfoRow>
        {userProfile.email && (
          <InfoRow>
            <Label>이메일:</Label>
            {isEditing ? (
              <Input
                type="email"
                name="email"
                value={editProfile.email || ''}
                onChange={handleChange}
              />
            ) : (
              <Value>{userProfile.email}</Value>
            )}
          </InfoRow>
        )}
        {userProfile.first_name && (
          <InfoRow>
            <Label>이름:</Label>
            {isEditing ? (
              <Input
                type="text"
                name="first_name"
                value={editProfile.first_name || ''}
                onChange={handleChange}
              />
            ) : (
              <Value>{userProfile.first_name}</Value>
            )}
          </InfoRow>
        )}
        {userProfile.last_name && (
          <InfoRow>
            <Label>성:</Label>
            {isEditing ? (
              <Input
                type="text"
                name="last_name"
                value={editProfile.last_name || ''}
                onChange={handleChange}
              />
            ) : (
              <Value>{userProfile.last_name}</Value>
            )}
          </InfoRow>
        )}
      </ProfileInfo>

      {/* 수정/저장/취소 버튼 그룹 (소유자에게만 보임!) */}
      {isProfileOwner && (
        <ButtonGroup>
          {isEditing ? (
            <>
              <Button primary onClick={handleSave}>
                저장
              </Button>
              <Button onClick={handleCancel}>취소</Button>
            </>
          ) : (
            <Button primary onClick={() => setIsEditing(true)}>
              프로필 수정
            </Button>
          )}
        </ButtonGroup>
      )}
    </ProfileContainer>
  );
};

export default ProfilePage;
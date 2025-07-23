// src/pages/ProfilePage.tsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile, putUserProfile } from '../apis/auth';
import axios from 'axios';
import { isOwner } from '../utils/profile';
import { type UserProfile } from '../types/UserProfile';

const ProfileContainer = styled.div`
  /* ... 동일 ... */
`;
const ProfileHeader = styled.h2`/* ... 동일 ... */`;
const ProfileInfo = styled.div`/* ... 동일 ... */`;
const InfoRow = styled.div`/* ... 동일 ... */`;
const Label = styled.span`/* ... 동일 ... */`;
const Value = styled.span`/* ... 동일 ... */`;
const LoadingText = styled.p`/* ... 동일 ... */`;
const ErrorText = styled.p`/* ... 동일 ... */`;
const ButtonGroup = styled.div`/* ... 동일 ... */`;
const Button = styled.button<{ primary?: boolean }>`/* ... 동일 ... */`;
const Input = styled.input`/* ... 동일 ... */`;

const ProfilePage: React.FC = () => {
  const { isLoggedIn } = useAuth();

  // URL params 에서 profileId 가져오기
  const { id: profileIdParam } = useParams<{ id: string }>();
  const profileId = Number(profileIdParam);

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [editProfile, setEditProfile] = useState<Partial<UserProfile>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // 프로필 로드
  const loadUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      // profileId를 넘겨서 특정 유저 프로필 가져오기
      const profile = await getUserProfile();
      setUserProfile(profile);
      setEditProfile(profile);             // 편집용 초기값 세팅
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
    if (isLoggedIn) {
      loadUserProfile();
    }
  }, [isLoggedIn, profileId]);

  // 입력값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditProfile(prev => ({ ...prev, [name]: value }));
  };

  // 수정 모드 진입
  const handleEdit = () => {
    if (userProfile) {
      setEditProfile(userProfile);
      setIsEditing(true);
      setError(null);
    }
  };

  // 저장
  const handleSave = async () => {
    if (!userProfile) return;

    setLoading(true);
    setError(null);
    try {
      // 기존 프로필 + 수정된 필드 병합
      const payload: UserProfile = {
        ...userProfile,
        ...editProfile,
      };

      const updated = await putUserProfile(payload);
      setUserProfile(updated);
      setEditProfile(updated);
      setIsEditing(false);
      alert("프로필이 성공적으로 업데이트되었습니다!");
    } catch (err) {
      console.error("프로필 업데이트 실패:", err);
      if (axios.isAxiosError(err) && err.response) {
        setError(
          `프로필 업데이트 실패: ${err.response.status} ${err.response.statusText}` +
          `${err.response.data?.detail ? ` - ${err.response.data.detail}` : ''}`
        );
      } else {
        setError("프로필 업데이트 중 알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (userProfile) {
      setEditProfile(userProfile);
    }
    setIsEditing(false);
    setError(null);
  };

  if (loading) {
    return (
      <ProfileContainer>
        <LoadingText>프로필을 불러오는 중입니다...</LoadingText>
      </ProfileContainer>
    );
  }

  if (error && !userProfile) {
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

  // 로그인 유저가 이 프로필의 소유자인지 체크
  const isProfileOwner = isOwner(userProfile.id);

  return (
    <ProfileContainer>
      <ProfileHeader>
        {isProfileOwner ? '내 프로필' : `${userProfile.username}의 프로필`}
      </ProfileHeader>

      <ProfileInfo>
        <InfoRow>
          <Label>사용자 ID:</Label>
          <Value>{userProfile.id}</Value>
        </InfoRow>

        <InfoRow>
          <Label>사용자 이름:</Label>
          {isEditing ? (
            <Input
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

        {userProfile.name && (
          <InfoRow>
            <Label>이름:</Label>
            {isEditing ? (
              <Input
                name="first_name"
                value={editProfile.name || ''}
                onChange={handleChange}
              />
            ) : (
              <Value>{userProfile.name}</Value>
            )}
          </InfoRow>
        )}
        {userProfile.bio && (
          <InfoRow>
            <Label>소개:</Label>
            {isEditing ? (
              <Input
                name="bio"
                value={editProfile.bio || ''}
                onChange={handleChange}
              />
            ) : (
              <Value>{userProfile.bio}</Value>
            )}
          </InfoRow>
        )}
        
        {userProfile.location && (
          <InfoRow>
            <Label>위치:</Label>
            {isEditing ? (
              <Input
                name="location"
                value={editProfile.location || ''}
                onChange={handleChange}
              />
            ) : (
              <Value>{userProfile.location}</Value>
            )}
          </InfoRow>
        )}
      </ProfileInfo>

      {isProfileOwner && (
        <ButtonGroup>
          {isEditing ? (
            <>
              <Button primary onClick={handleSave}>저장</Button>
              <Button onClick={handleCancel}>취소</Button>
            </>
          ) : (
            <Button primary onClick={handleEdit}>프로필 수정</Button>
          )}
        </ButtonGroup>
      )}
    </ProfileContainer>
  );
};

export default ProfilePage;

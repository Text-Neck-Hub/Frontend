// src/pages/ProfilePage.tsx

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile } from '../apis/auth'; 
import axios from 'axios'; 


export interface FullUserProfile {
  id: number;
  username: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  // 필요한 경우 여기에 추가 프로필 필드를 정의합니다.
  // profile_picture_url?: string;
  // date_joined?: string;
}

// --- 스타일 컴포넌트 ---
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

// --- 프로필 페이지 컴포넌트 ---
const ProfilePage: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const [userProfile, setUserProfile] = useState<FullUserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 로그인되어 있고 user.id가 있을 때만 프로필 정보를 가져옵니다.
    if (isLoggedIn) {
      const loadUserProfile = async () => {
        try {
          setLoading(true); // 로딩 시작
          setError(null);   // 에러 초기화

          
          const profileData = await getUserProfile();
          
          setUserProfile(profileData); // 가져온 데이터로 프로필 상태 업데이트
        } catch (err) {
          console.error("User 프로필 가져오기 실패:", err);
          // 에러 메시지 설정 (axios 에러 체크)
          if (axios.isAxiosError(err) && err.response) {
            setError(`프로필 정보를 가져오는 데 실패했습니다: ${err.response.status} ${err.response.statusText}`);
          } else {
            setError("프로필 정보를 가져오는 데 실패했습니다.");
          }
        } finally {
          setLoading(false); // 로딩 종료
        }
      };

      loadUserProfile(); // 프로필 정보 로드 함수 실행
    } else if (!isLoggedIn) {
      // 로그인이 되어있지 않으면 바로 에러 설정
      setError("로그인이 필요합니다.");
      setLoading(false);
    } else {
      // isLoggedIn은 true인데 user?.id가 아직 null/undefined인 경우 (드물지만)
      setError("사용자 ID 정보를 가져올 수 없습니다.");
      setLoading(false);
    }
  }, [isLoggedIn]); // isLoggedIn과 user.id가 변경될 때마다 재실행

  // --- 조건부 렌더링: 로딩, 에러, 데이터 없음 ---
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
      </ProfileContainer>
    );
  }

  // userProfile이 아직 로드되지 않았거나 null인 경우 (로딩/에러 상태가 아닌데도 데이터가 없는 경우)
  if (!userProfile) {
    return (
      <ProfileContainer>
        <ErrorText>표시할 프로필 정보가 없습니다.</ErrorText>
      </ProfileContainer>
    );
  }

  // --- 프로필 정보 표시 ---
  return (
    <ProfileContainer>
      <ProfileHeader>내 프로필</ProfileHeader>
      <ProfileInfo>
        <InfoRow>
          <Label>사용자 ID:</Label>
          <Value>{userProfile.id}</Value>
        </InfoRow>
        <InfoRow>
          <Label>사용자 이름:</Label>
          <Value>{userProfile.username}</Value>
        </InfoRow>
        {userProfile.email && (
          <InfoRow>
            <Label>이메일:</Label>
            <Value>{userProfile.email}</Value>
          </InfoRow>
        )}
        {userProfile.first_name && (
          <InfoRow>
            <Label>이름:</Label>
            <Value>{userProfile.first_name}</Value>
          </InfoRow>
        )}
        {userProfile.last_name && (
          <InfoRow>
            <Label>성:</Label>
            <Value>{userProfile.last_name}</Value>
          </InfoRow>
        )}
      </ProfileInfo>
    </ProfileContainer>
  );
};

export default ProfilePage;
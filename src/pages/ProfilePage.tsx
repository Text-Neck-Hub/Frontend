import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import {
  getUserProfile,
  putUserProfile,
  deleteUserProfile,
} from "../apis/auth";
import { useAuth } from "../contexts/AuthContext";
import { type UserProfile } from "../types/UserProfile";

const ProfileContainer = styled.div`
  max-width: 720px;
  margin: 3rem auto;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const ProfileHeader = styled.h2`
  font-size: 2rem;
  color: #333333;
  margin-bottom: 2rem;
  font-weight: bold;
  text-align: center;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 0;
  border-bottom: 1px solid #eaeaea;
`;

const Label = styled.span`
  font-weight: 600;
  color: #555555;
  width: 120px;
`;

const Value = styled.span`
  color: #222222;
  flex: 1;
`;

const LoadingText = styled.p`
  font-size: 1.2rem;
  text-align: center;
  color: #666666;
  margin-top: 2rem;
`;

const ErrorText = styled.p`
  font-size: 1.1rem;
  text-align: center;
  color: red;
  margin: 2rem 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button<{ primary?: boolean }>`
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  background-color: ${({ primary }) => (primary ? "#007bff" : "#eaeaea")};
  color: ${({ primary }) => (primary ? "#ffffff" : "#333333")};
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${({ primary }) => (primary ? "#0056b3" : "#d5d5d5")};
  }
`;

const Input = styled.input`
  padding: 0.5rem 0.8rem;
  border: 1px solid #cccccc;
  border-radius: 6px;
  font-size: 1rem;
  flex: 1;
`;

const PreviewImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
  margin: 0 auto 2rem;
`;

const ProfilePage: React.FC = () => {
  const { isLoggedIn, currentUser, logout } = useAuth();
  const { id: profileIdParam } = useParams<{ id: string }>();

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [editProfile, setEditProfile] = useState<Partial<UserProfile>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserProfile();
      setUserProfile(data);
      setEditProfile({
        name: data.name || "",
        bio: data.bio || "",
        location: data.location || "",
      });
      setPreview(data.profile_picture || "");
    } catch (err) {
      console.error(err);
      setError("프로필을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) load();
  }, [isLoggedIn, profileIdParam]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditProfile((p) => ({ ...p, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
  };

  const handleSave = async () => {
    if (!userProfile) return;
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("name", editProfile.name || "");
      formData.append("bio", editProfile.bio || "");
      formData.append("location", editProfile.location || "");
      if (selectedFile) {
        formData.append("profile_picture", selectedFile);
      }
      await putUserProfile(formData);
      alert("프로필이 성공적으로 업데이트되었습니다!");
      setIsEditing(false);
      load();
    } catch (err) {
      console.error(err);
      setError("프로필 업데이트 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    setSelectedFile(null);
    setPreview(userProfile?.profile_picture || "");
  };

  const handleDelete = async () => {
    if (!window.confirm("정말로 회원 탈퇴 ㄱㄱ?")) return;
    setLoading(true);
    setError(null);
    try {
      await deleteUserProfile();
      alert("회원 탈퇴 되었습니다.");
    } catch (err) {
      console.error(err);
      setError("회원 탈퇴 중 오류가 발생했습니다.");
    } finally {
      logout();
      setLoading(false);
    }
  };

  const isProfileOwner = userProfile?.email === currentUser?.email;

  if (loading) {
    return (
      <ProfileContainer>
        <LoadingText>로딩 중...</LoadingText>
      </ProfileContainer>
    );
  }

  if (error && !userProfile) {
    return (
      <ProfileContainer>
        <ErrorText>{error}</ErrorText>
        <ButtonGroup>
          <Button onClick={load}>다시 시도</Button>
        </ButtonGroup>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      {preview && <PreviewImage src={preview} alt="프로필 사진" />}

      <ProfileHeader>
        {isProfileOwner ? "내 프로필" : `${userProfile?.name}의 프로필`}
      </ProfileHeader>

      <ProfileInfo>
        <InfoRow>
          <Label>사용자 ID</Label>
          <Value>{userProfile?.id}</Value>
        </InfoRow>

        <InfoRow>
          <Label>이메일</Label>
          <Value>{userProfile?.email}</Value>
        </InfoRow>

        {isEditing && (
          <InfoRow>
            <Label>이미지 업로드</Label>
            <Input type="file" accept="image/*" onChange={handleFileChange} />
          </InfoRow>
        )}

        <InfoRow>
          <Label>이름</Label>
          {isEditing ? (
            <Input
              name="name"
              value={editProfile.name || ""}
              onChange={handleChange}
            />
          ) : (
            <Value>{userProfile?.name}</Value>
          )}
        </InfoRow>

        <InfoRow>
          <Label>소개</Label>
          {isEditing ? (
            <Input
              name="bio"
              value={editProfile.bio || ""}
              onChange={handleChange}
            />
          ) : (
            <Value>{userProfile?.bio}</Value>
          )}
        </InfoRow>

        <InfoRow>
          <Label>위치</Label>
          {isEditing ? (
            <Input
              name="location"
              value={editProfile.location || ""}
              onChange={handleChange}
            />
          ) : (
            <Value>{userProfile?.location}</Value>
          )}
        </InfoRow>
      </ProfileInfo>

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
            <>
              <Button primary onClick={handleEdit}>
                프로필 수정
              </Button>
              <Button onClick={handleDelete}>탈퇴 하기</Button>
            </>
          )}
        </ButtonGroup>
      )}
    </ProfileContainer>
  );
};

export default ProfilePage;

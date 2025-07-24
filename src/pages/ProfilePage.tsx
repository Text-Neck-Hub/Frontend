// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import styled from "styled-components";
// import { useAuth } from "../contexts/AuthContext";
// import { getUserProfile, putUserProfile } from "../apis/auth";
// import axios from "axios";
// import { isOwner } from "../utils/profile";
// import { type UserProfile } from "../types/UserProfile";

// const ProfileContainer = styled.div`
//   max-width: 720px;
//   margin: 3rem auto;
//   padding: 2rem;
//   background-color: #ffffff;
//   border-radius: 12px;
//   box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
// `;

// const ProfileHeader = styled.h2`
//   font-size: 2rem;
//   color: #333333;
//   margin-bottom: 2rem;
//   font-weight: bold;
//   text-align: center;
// `;

// const ProfileInfo = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 1.2rem;
// `;

// const InfoRow = styled.div`
//   display: flex;
//   justify-content: space-between;
//   padding: 0.6rem 0;
//   border-bottom: 1px solid #eaeaea;
// `;

// const Label = styled.span`
//   font-weight: 600;
//   color: #555555;
// `;

// const Value = styled.span`
//   color: #222222;
// `;

// const LoadingText = styled.p`
//   font-size: 1.2rem;
//   text-align: center;
//   color: #666666;
//   margin-top: 2rem;
// `;

// const ErrorText = styled.p`
//   font-size: 1.1rem;
//   text-align: center;
//   color: red;
//   margin: 2rem 0;
// `;

// const ButtonGroup = styled.div`
//   display: flex;
//   justify-content: center;
//   gap: 1rem;
//   margin-top: 2rem;
// `;

// const Button = styled.button<{ primary?: boolean }>`
//   padding: 0.6rem 1.2rem;
//   border: none;
//   border-radius: 6px;
//   font-size: 1rem;
//   cursor: pointer;
//   background-color: ${({ primary }) => (primary ? "#007bff" : "#eaeaea")};
//   color: ${({ primary }) => (primary ? "#ffffff" : "#333333")};
//   transition: background-color 0.2s ease-in-out;

//   &:hover {
//     background-color: ${({ primary }) => (primary ? "#0056b3" : "#d5d5d5")};
//   }
// `;

// const Input = styled.input`
//   padding: 0.5rem 0.8rem;
//   border: 1px solid #cccccc;
//   border-radius: 6px;
//   font-size: 1rem;
//   color: #333333;
//   flex: 1;
// `;

// const ProfilePage: React.FC = () => {
//   const { isLoggedIn } = useAuth();
//   const { id: profileIdParam } = useParams<{ id: string }>();
//   const profileId = Number(profileIdParam);

//   const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
//   const [editProfile, setEditProfile] = useState<Partial<UserProfile>>({});
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isEditing, setIsEditing] = useState<boolean>(false);

//   const loadUserProfile = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const profile = await getUserProfile();
//       setUserProfile(profile);
//       setEditProfile(profile);
//     } catch (err) {
//       console.error("사용자 프로필 가져오기 실패:", err);
//       if (axios.isAxiosError(err) && err.response) {
//         if (err.response.status === 404) {
//           setError("해당 사용자를 찾을 수 없습니다.");
//         } else {
//           setError(
//             `프로필 정보를 가져오는 데 실패했습니다: ${err.response.status} ${err.response.statusText}`
//           );
//         }
//       } else {
//         setError("프로필 정보를 가져오는 데 실패했습니다.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (isLoggedIn) {
//       loadUserProfile();
//     }
//   }, [isLoggedIn, profileId]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setEditProfile((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleEdit = () => {
//     if (userProfile) {
//       setEditProfile(userProfile);
//       setIsEditing(true);
//       setError(null);
//     }
//   };

//   const handleSave = async () => {
//     if (!userProfile) return;

//     setLoading(true);
//     setError(null);
//     try {
//       const payload: UserProfile = {
//         ...userProfile,
//         ...editProfile,
//       };

//       const updated = await putUserProfile(payload);
//       setUserProfile(updated);
//       setEditProfile(updated);
//       setIsEditing(false);
//       alert("프로필이 성공적으로 업데이트되었습니다!");
//     } catch (err) {
//       console.error("프로필 업데이트 실패:", err);
//       if (axios.isAxiosError(err) && err.response) {
//         setError(
//           `프로필 업데이트 실패: ${err.response.status} ${err.response.statusText}` +
//             `${
//               err.response.data?.detail ? ` - ${err.response.data.detail}` : ""
//             }`
//         );
//       } else {
//         setError("프로필 업데이트 중 알 수 없는 오류가 발생했습니다.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancel = () => {
//     if (userProfile) {
//       setEditProfile(userProfile);
//     }
//     setIsEditing(false);
//     setError(null);
//   };

//   if (loading) {
//     return (
//       <ProfileContainer>
//         <LoadingText>프로필을 불러오는 중입니다...</LoadingText>
//       </ProfileContainer>
//     );
//   }

//   if (error && !userProfile) {
//     return (
//       <ProfileContainer>
//         <ErrorText>{error}</ErrorText>
//         <ButtonGroup>
//           <Button onClick={loadUserProfile}>다시 시도</Button>
//         </ButtonGroup>
//       </ProfileContainer>
//     );
//   }

//   if (!userProfile) {
//     return (
//       <ProfileContainer>
//         <ErrorText>표시할 프로필 정보가 없습니다.</ErrorText>
//       </ProfileContainer>
//     );
//   }

//   const isProfileOwner = isOwner(userProfile.uid);

// return (
//   <ProfileContainer>
//     {userProfile.profile_picture && (
//       <img
//         src={userProfile.profile_picture}
//         alt={`${userProfile.name}의 프로필 사진`}
//         style={{
//           width: "120px",
//           height: "120px",
//           borderRadius: "50%",
//           objectFit: "cover",
//           display: "block",
//           margin: "0 auto 2rem"
//         }}
//       />
//     )}

//     <ProfileHeader>
//       {isProfileOwner ? "내 프로필" : `${userProfile.name}의 프로필`}
//     </ProfileHeader>

//       <ProfileInfo>
//         <InfoRow>
//           <Label>사용자 ID:</Label>
//           <Value>{userProfile.id}</Value>
//         </InfoRow>

//         <InfoRow>
//           <Label>사용자 이름:</Label>
//           <Value>{userProfile.name}</Value>
//         </InfoRow>

//         {userProfile.email && (
//           <InfoRow>
//             <Label>이메일:</Label>
//             <Value>{userProfile.email}</Value>
//           </InfoRow>
//         )}

//         {isEditing ? (
//           <>
//             <InfoRow>
//               <Label>이름:</Label>
//               <Input
//                 name="name"
//                 value={editProfile.name || ""}
//                 onChange={handleChange}
//               />
//             </InfoRow>

//             <InfoRow>
//               <Label>소개:</Label>
//               <Input
//                 name="bio"
//                 value={editProfile.bio || ""}
//                 onChange={handleChange}
//               />
//             </InfoRow>

//             <InfoRow>
//               <Label>프로필 이미지 URL:</Label>
//               <Input
//                 name="profile_picture"
//                 value={editProfile.profile_picture || ""}
//                 onChange={handleChange}
//               />
//             </InfoRow>

//             <InfoRow>
//               <Label>위치:</Label>
//               <Input
//                 name="location"
//                 value={editProfile.location || ""}
//                 onChange={handleChange}
//               />
//             </InfoRow>
//           </>
//         ) : (
//           <>
//             {userProfile.name && (
//               <InfoRow>
//                 <Label>이름:</Label>
//                 <Value>{userProfile.name}</Value>
//               </InfoRow>
//             )}

//             {userProfile.bio && (
//               <InfoRow>
//                 <Label>소개:</Label>
//                 <Value>{userProfile.bio}</Value>
//               </InfoRow>
//             )}

//             {userProfile.profile_picture && (
//               <InfoRow>
//                 <Label>프로필 이미지 URL:</Label>
//                 <Value>{userProfile.profile_picture}</Value>
//               </InfoRow>
//             )}

//             {userProfile.location && (
//               <InfoRow>
//                 <Label>위치:</Label>
//                 <Value>{userProfile.location}</Value>
//               </InfoRow>
//             )}
//           </>
//         )}
//       </ProfileInfo>


//       {isProfileOwner && (
//         <ButtonGroup>
//           {isEditing ? (
//             <>
//               <Button primary onClick={handleSave}>
//                 저장
//               </Button>
//               <Button onClick={handleCancel}>취소</Button>
//             </>
//           ) : (
//             <Button primary onClick={handleEdit}>
//               프로필 수정
//             </Button>
//           )}
//         </ButtonGroup>
//       )}
//     </ProfileContainer>
//   );
// };

// export default ProfilePage;
// src/pages/ProfilePage.tsx
import React, { useState, useEffect } from "react";
import {  useParams } from "react-router-dom";
import styled from "styled-components";
import { putUserProfile } from "../apis/auth";
import { useAuth } from "../contexts/AuthContext";
import { getUserProfile } from "../apis/auth"; // JSON get-only
import { isOwner } from "../utils/profile";
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
    background-color: ${({ primary }) =>
      primary ? "#0056b3" : "#d5d5d5"};
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
  const { isLoggedIn } = useAuth();
  
  const { id: profileIdParam } = useParams<{ id: string }>();

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [editProfile, setEditProfile] = useState<Partial<UserProfile>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // 프로필 로드
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

  // 입력 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditProfile((p) => ({ ...p, [name]: value }));
  };

  // 파일 변경 시 미리보기
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  };

  // 수정 모드 진입
  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
  };

  // 저장
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

  // 취소
  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    setPreview(userProfile?.profile_picture || "");
    setSelectedFile(null);
  };

  const isProfileOwner = userProfile
    ? isOwner(userProfile.uid)
    : false;

  // 로딩 & 에러 처리
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

  // 실제 화면
  return (
    <ProfileContainer>
      {preview && <PreviewImage src={preview} alt="프로필 사진" />}

      <ProfileHeader>
        {isProfileOwner
          ? "내 프로필"
          : `${userProfile?.name}의 프로필`}
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
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
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
            <Button primary onClick={handleEdit}>
              프로필 수정
            </Button>
          )}
        </ButtonGroup>
      )}
    </ProfileContainer>
  );
};

export default ProfilePage;

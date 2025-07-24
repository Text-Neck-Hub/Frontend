export interface UserProfile {
  id: number;
  uid: number; // 사용자 고유 ID
  username: string;
  email?: string;
  name?: string;
  bio?: string;
  location?: string;
  profile_picture?: string;
}
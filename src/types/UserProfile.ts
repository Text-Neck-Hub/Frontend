export interface UserProfile {
  id: number;
  username: string;
  email: string;
  name?: string;
  bio?: string;
  location?: string;
  profile_picture?: string;
}

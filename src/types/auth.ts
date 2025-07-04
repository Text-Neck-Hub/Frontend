export interface JWT {
  accessToken: string;
  userInfo: {
    id: number;
    username: string;
    email: string;
  };
}
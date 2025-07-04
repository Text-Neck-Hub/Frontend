export interface JWT {
  access: string;
  user_info: {
    id: number;
    username: string;
    email: string;
  };
}
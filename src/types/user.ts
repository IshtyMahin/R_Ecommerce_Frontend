export interface IUser {
  userId: string;
  name: string;
  email: string;
  hasShop?: boolean;
  isActive?: boolean;
  role: "user" | "admin";
  avatar?: string;
  iat?: number;
  exp?: number;
}

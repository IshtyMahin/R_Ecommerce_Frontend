import { IUser } from "./user";

export interface IReview {
  _id: string;
  product: string; 
  user: string | IUser;
  rating: number;
  review: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
  updatedAt: string;
}
"use server";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { getNewToken } from "../AuthService";
import { getValidToken } from "@/lib/verifyToken";


export const getProductReviews = async (
  productId: string,
  page?: string,
  limit?: string
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/review?product=${productId}&limit=${limit}&page=${page}`,
      {
        next: {
          tags: ["REVIEWS"],
        },
      }
    );
    const data = await res.json();
    
    return data;
  } catch (error: any) {
    return Error(error.message);
  }
};

export const getAllReviews = async (
  page?: string,
  limit?: string,
  query?: { [key: string]: string | string[] | undefined }
) => {
  const params = new URLSearchParams();

  if (query?.rating) {
    params.append("rating", query.rating.toString());
  }
  if (query?.product) {
    params.append("product", query.product.toString());
  }
  if (query?.user) {
    params.append("user", query.user.toString());
  }


  

  try {
    const accessToken = (await cookies()).get("accessToken")?.value;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/review?limit=${limit}&page=${page}&${params}`,
      {
        headers: {
          Authorization: `${accessToken}`,
        },
        next: {
          tags: ["REVIEWS"],
        },
      }
    );
    
    // Handle token expiration
    if (res.status === 401) {
      const refreshResponse = await getNewToken();
      if (refreshResponse.success) {
        const newAccessToken = (await cookies()).get("accessToken")?.value;
        const retryRes = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_API}/review?limit=${limit}&page=${page}&${params}`,
          {
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
            },
          }
        );
        return await retryRes.json();
      }
      throw new Error("Session expired. Please login again.");
    }

    const data = await res.json();
    return data;
  } catch (error: any) {
    return Error(error.message);
  }
};

// Create a review
export const createReview = async (reviewData: {
  product: string;
  rating: number;
  review: string;
}): Promise<{ success: boolean; message?: string; data?: any }> => {
  try {
    const accessToken = await getValidToken();
    
    if (!accessToken) {
      return { success: false, message: "Authentication required. Please login." };
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${accessToken}`,
      },
      body: JSON.stringify(reviewData),
    });

    const data = await res.json();

    if (!res.ok) {
      return { 
        success: false, 
        message: data.message || 'Failed to create review' 
      };
    }

    revalidateTag("REVIEWS");
    return { success: true, data };
  } catch (error: any) {
    return { 
      success: false, 
      message: error.message || 'An unexpected error occurred' 
    };
  }
};
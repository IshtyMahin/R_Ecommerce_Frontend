// auth.utils.ts
"use server";

import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { FieldValues } from "react-hook-form";
import {  JwtPayload } from "jwt-decode";

import { IUser } from "@/types"; 
import { getValidToken } from "@/lib/verifyToken";

export const registerUser = async (userData: FieldValues) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    const result = await res.json();

    if (result.success) {
      const cookieStore =  await cookies();
      cookieStore.set("accessToken", result.data.accessToken);
      cookieStore.set("refreshToken", result.data.refreshToken);
    }

    return result;
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const loginUser = async (userData: FieldValues) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const result = await res.json();

    if (result?.success) {
      const cookieStore =await cookies();
      cookieStore.set("accessToken", result.data.accessToken);
      cookieStore.set("refreshToken", result.data.refreshToken);
      
      
    }

    return result;
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};



export const getCurrentUser = async (): Promise<IUser | null> => {
 
 
  let accessToken = await getValidToken()
  

  if (accessToken) {
    try {
      const decoded = jwtDecode<JwtPayload & IUser>(accessToken);
      return decoded;
    } catch (error) {
    
      return null;
    }
  }
  return null;
};


export const reCaptchaTokenVerification = async (token: string) => {
  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: process.env.NEXT_PUBLIC_RECAPTCHA_SERVER_KEY!,
        response: token,
      }),
    });

    return await res.json();
  } catch (err: any) {
    return { success: false, message: err.message };
  }
};

export const logout = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
};

export const getNewToken = async () => {
  try {
    const refreshToken = (await cookies()).get("refreshToken")?.value;
    
    if (!refreshToken) {
      return { success: false, message: "No refresh token available" };
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/auth/refresh-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${refreshToken}`,
        },
      }
    );

    

    const result = await res.json();

    if (result.success) {
      const cookieStore =await cookies();
      cookieStore.set("accessToken", result.data.accessToken);
      if (result.data.refreshToken) {
        cookieStore.set("refreshToken", result.data.refreshToken);
      }
    }

    return result;
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const isAuthenticated = async () => {
  const cookieStore =await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  
  if (!accessToken) {
    return false;
  }

  try {
    const decoded = jwtDecode(accessToken);
    return decoded.exp ? decoded.exp > Date.now() / 1000 : false;
  } catch (error) {
    return false;
  }
};

export const hasPurchasedProduct = async (productId: string) => {
 

  try {
    const cookieStore =await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
   
    
    if (!accessToken) {
      return false;
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/order/check-purchase/${productId}`,
      {
        headers: {
          Authorization: `${accessToken}`,
        },
      }
    );

    

    if (res.status === 401) {
      // Token might be expired, try to refresh
      const refreshResponse = await getNewToken();
      if (refreshResponse.success) {
        const newAccessToken = cookieStore.get("accessToken")?.value;
        const retryRes = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_API}/orders/check-purchase/${productId}`,
          {
            headers: {
              Authorization: `${newAccessToken}`,
            },
          }
        );
        const retryData = await retryRes.json();
        return retryData.success && retryData.data.hasPurchased;
      }
      return false;
    }

    const data = await res.json();
    
    return data.success && data.data.hasPurchased;
  } catch (error) {
    return false;
  }
};
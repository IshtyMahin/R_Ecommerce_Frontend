"use server";

import { getNewToken } from "@/services/AuthService";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export const isTokenExpired = async (token: string): Promise<boolean> => {
  if (!token) return true;

  try {
    const decoded: { exp: number } = jwtDecode(token);

    return decoded.exp * 1000 < Date.now();
  } catch (err: any) {
    return true;
  }
};

export const getValidToken = async (): Promise<string> => {
  const cookieStore = await cookies();

  const accessTokenCookie = cookieStore.get("accessToken");
  let token = accessTokenCookie ? accessTokenCookie.value : "";

  
  
  if (!token ) {
    const { data } = await getNewToken();
    
    token = data?.accessToken;
    cookieStore.set("accessToken", token);
  }

  return token;
};

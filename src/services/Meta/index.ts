"use server";

import { cookies } from "next/headers";

export const getMetaData = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/meta`, {
      method: "GET",
      headers: {
        Authorization: (await cookies()).get("accessToken")!.value,
      },
      next: {
        tags: ["META"],
      },
    });

    console.log(res, "meta data response");
    

    if (!res.ok) {
      throw new Error("Failed to fetch meta data");
    }

    return await res.json();
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch meta data");
  }
};
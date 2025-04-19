"use server";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

// add Flash Sale
export const addFlashSale = async (productData: any): Promise<any> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/flash-sale`, {
      method: "POST",
      headers: {
        Authorization: (await cookies()).get("accessToken")!.value,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    revalidateTag("PRODUCT");
    return res.json();
  } catch (error: any) {
    return Error(error);
  }
};

// get Flash Sale Products
export const getFlashSaleProducts = async (
  page?: string,
  limit?: string,
  query?: { [key: string]: string | string[] | undefined }
) => {
  const params = new URLSearchParams();

  if (page) params.append("page", page);
  if (limit) params.append("limit", limit);

  if (query?.price) {
    params.append("minPrice", "0");
    params.append("maxPrice", query.price.toString());
  }

  if (query?.category) {
    params.append("categories", query.category.toString());
  }

  if (query?.brand) {
    params.append("brands", query.brand.toString());
  }

  if (query?.rating) {
    params.append("ratings", query.rating.toString());
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/flash-sale?${params.toString()}`,
      {
        next: {
          tags: ["PRODUCT"],
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch flash sale products: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error: any) {
    return Error(error.message);
  }
};

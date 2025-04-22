"use server";

import { getValidToken } from "@/lib/verifyToken";
import { revalidateTag } from "next/cache";

export const getAllOrders = async (page: string = "1", limit: string = "10", additionalParams?: Record<string, string>) => {
  const token = await getValidToken();
  
  try {
    const queryParams: Record<string, string> = {
      page,
      limit,
      ...additionalParams 
    };

    const queryString = new URLSearchParams(queryParams).toString();
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/order?${queryString}`, {
      next: {
        tags: ["Orders"],
      },
      headers: {
        Authorization: token,
      },
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch orders: ${res.statusText}`);
    }
    
    const data = await res.json();
    
    if (!data.data || !data.meta) {
      throw new Error("Invalid response structure from orders API");
    }
    
    return {
      data: data.data,
      meta: data.meta
    };
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch orders");
  }
};

// Get order details
export const getOrderDetails = async (orderId: string) => {
  const token = await getValidToken();

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/order/${orderId}`, {
      headers: {
        Authorization: token,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch order details: ${res.statusText}`);
    }

    return await res.json();
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch order details");
  }
};

export const getMyOrders = async (page: string = "1", limit: string = "10", additionalParams?: Record<string, string>) => {
  const token = await getValidToken();

  try {
    const queryParams: Record<string, string> = {
      page,
      limit,
      ...additionalParams
    };

    const queryString = new URLSearchParams(queryParams).toString();
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/order/my-orders?${queryString}`, {
      next: {
        tags: ["MyOrders"],
      },
      headers: {
        Authorization: token,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch user orders: ${res.statusText}`);
    }

    const data = await res.json();
    
    if (!data.data || !data.meta) {
      throw new Error("Invalid response structure from my orders API");
    }
    
    return {
      data: data.data,
      meta: data.meta
    };
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch user orders");
  }
};

// Update order status (admin only)
export const updateOrderStatus = async (orderId: string, status: string) => {
  const token = await getValidToken();

  try {
    console.log("Updating order status:", orderId, status);
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/order/${orderId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ status }),
    });
    console.log("Response from update order status:", res);
    
    if (!res.ok) {
      throw new Error(`Failed to update order status: ${res.statusText}`);
    }

    revalidateTag("Orders");
    revalidateTag("MyOrders");
    return await res.json();
  } catch (error: any) {
    throw new Error(error.message || "Failed to update order status");
  }
};


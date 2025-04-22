import MyOrders from "@/components/modules/order/MyOrders";
import { getMyOrders } from "@/services/Order";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Orders | Your Account",
};

export default async function MyOrdersPage({
  searchParams,
}: {
  searchParams: Promise<any>;
}) {
  try {
    const { page } =await searchParams || "1";
    const { data, meta } = await getMyOrders(page, "10"); 
    return <MyOrders orders={data} meta={meta} />;
  } catch (error) {
    return (
      <div className="p-4 text-red-500">
        Failed to load your orders. Please try again later.
      </div>
    );
  }
}
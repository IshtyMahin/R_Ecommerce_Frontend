// app/admin/dashboard/orders/page.tsx
import ManageOrders from "@/components/modules/order/ManageOrders";
import { getAllOrders } from "@/services/Order";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Orders | Admin",
};

export default async function ManageOrdersPage({
  searchParams,
}: {
    searchParams: Promise<{ page: string }>;
}) {
  try {
    const { page } = await searchParams;
    const { data, meta } = await getAllOrders(page, "10"); 
    return <ManageOrders orders={data} meta={meta} />;
  } catch (error) {
    return (
      <div className="p-4 text-red-500">
        Failed to load orders. Please try again later.
      </div>
    );
  }
}
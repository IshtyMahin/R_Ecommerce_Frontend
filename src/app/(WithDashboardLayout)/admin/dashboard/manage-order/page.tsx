import ManageOrders from "@/components/modules/order/ManageOrders";
import { getAllOrders } from "@/services/Order";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Orders | Admin",
};



const ManageOrdersPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page: string }>;
}) => {
  const { page } = await searchParams;

  const { data, meta } = await getAllOrders(page, "10");
  return (
    <div>
      <ManageOrders orders={data}  meta={meta} />
    </div>
  );
};

export default ManageOrdersPage;

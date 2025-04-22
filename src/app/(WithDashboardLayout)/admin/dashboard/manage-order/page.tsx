import ManageOrders from "@/components/modules/order/ManageOrders";
import { getAllOrders } from "@/services/Order";
import { Metadata } from "next";
import { any } from "zod";

export const metadata: Metadata = {
  title: "Manage Orders | Admin",
};



const ManageOrdersPage = async ({
  searchParams,
}: {
  searchParams: Promise<any>;
}) => {
  const { page } = await searchParams || "1";

  const { data, meta } = await getAllOrders(page, "10");
  return (
    <div>
      <ManageOrders orders={data}  meta={meta} />
    </div>
  );
};

export default ManageOrdersPage;

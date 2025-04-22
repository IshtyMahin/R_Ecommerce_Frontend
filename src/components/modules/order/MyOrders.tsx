// components/modules/order/MyOrders.tsx
"use client";
import { NMTable } from "@/components/ui/core/NMTable";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Truck, CheckCircle, XCircle, Clock } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IOrder } from "@/types/order";
import OrderDetailsModal from "./OrderDetailsModal";
import { Input } from "@/components/ui/input";
import TablePagination from "@/components/ui/core/NMTable/TablePagination";
import { IMeta } from "@/types";

function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: '2-digit',
    minute: '2-digit'
  });
}

const statusBadgeVariant = {
  Pending: "outline",
  Processing: "secondary",
  Completed: "default",
  Cancelled: "destructive"
} as const;

const MyOrders = ({ 
  orders, 
  meta 
}: { 
  orders: IOrder[];
  meta: IMeta;
}) => {
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = orders.filter(order => {
    return (order._id.includes(searchTerm) || order.products.some(p => p.product.name.toLowerCase().includes(searchTerm.toLowerCase())))})

  const handleViewDetails = (order: IOrder) => {
    setSelectedOrder(order);
    setDetailsModalOpen(true);
  };

  const columns: ColumnDef<IOrder>[] = [
    {
      accessorKey: "_id",
      header: "Order ID",
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.original._id.slice(-8)}</span>
      ),
    },
    {
      accessorKey: "products",
      header: "Items",
      cell: ({ row }) => (
        <div>
          {row.original.products.length} item(s)
          <p className="text-sm text-gray-500">
            Total: ${row.original.finalAmount.toFixed(2)}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge variant={statusBadgeVariant[status as keyof typeof statusBadgeVariant]}>
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "payment",
      header: "Payment",
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.paymentStatus === "Paid" ? "default" : 
            row.original.paymentStatus === "Failed" ? "destructive" : "outline"
          }
        >
          {row.original.paymentMethod} - {row.original.paymentStatus}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleViewDetails(row.original)}
          className="text-blue-500 hover:text-blue-700"
        >
          <Eye className="w-4 h-4 mr-1" />
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">My Orders</h1>
        
        <div className="relative w-full md:w-64">
          <Input
            placeholder="Search my orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <NMTable columns={columns} data={filteredOrders || []} />
      
      <TablePagination totalPage={meta?.totalPage} />
      
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isDetailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        isUserView={true} // Add this prop to customize the modal for users
      />
    </div>
  );
};

export default MyOrders;
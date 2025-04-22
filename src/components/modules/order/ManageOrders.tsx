"use client";
import { NMTable } from "@/components/ui/core/NMTable";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Truck, CheckCircle, XCircle, Clock, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { updateOrderStatus } from "@/services/Order";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IOrder } from "@/types/order";
import OrderDetailsModal from "./OrderDetailsModal";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const statusOptions = [
  { value: "Pending", label: "Pending", icon: Clock },
  { value: "Processing", label: "Processing", icon: Truck },
  { value: "Completed", label: "Completed", icon: CheckCircle },
  { value: "Cancelled", label: "Cancelled", icon: XCircle },
];

const paymentStatusOptions = [
  { value: "Pending", label: "Pending" },
  { value: "Paid", label: "Paid" },
  { value: "Failed", label: "Failed" },
];

const ManageOrders = ({ 
    orders, 
    meta 
  }: { 
    orders: IOrder[];
    meta: IMeta;
  }) => {
    console.log("Orders data:", orders);
    
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("all");


  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.products.some(p => 
        p.product.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      order._id.includes(searchTerm);

      const matchesStatus =
  statusFilter === "all" || statusFilter === "" ? true : order.status === statusFilter;

const matchesPaymentStatus =
  paymentStatusFilter === "all" || paymentStatusFilter === "" ? true : order.paymentStatus === paymentStatusFilter;

      

    return matchesSearch && matchesStatus && matchesPaymentStatus;
  });

  const handleViewDetails = (order: IOrder) => {
    setSelectedOrder(order);
    setDetailsModalOpen(true);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await updateOrderStatus(orderId, newStatus);
      if (res.success) {
        toast.success(`Order status updated to ${newStatus}`);
      } else {
        toast.error(res.message);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update order status");
    }
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
      accessorKey: "user",
      header: "Customer",
      cell: ({ row }) => (
        <div>
          {row.original.user?.name || "Guest"}
          <p className="text-sm text-gray-500">{row.original.user?.email}</p>
        </div>
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
        let variant: "default" | "destructive" | "outline" | "secondary" = "default";
        
        switch (status) {
          case "Cancelled":
            variant = "destructive";
            break;
          case "Processing":
            variant = "secondary";
            break;
          case "Pending":
            variant = "outline";
            break;
          case "Completed":
            variant = "default";
            break;
        }

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={variant} size="sm" className="h-6">
                {status}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {statusOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => handleStatusChange(row.original._id, option.value)}
                  className="flex items-center gap-2"
                >
                  <option.icon className="h-4 w-4" />
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
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
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Manage Orders</h1>
        
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search orders..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Payment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payments</SelectItem>
              {paymentStatusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <NMTable columns={columns} data={filteredOrders || []} />
      <TablePagination totalPage={meta?.totalPage} />
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isDetailsModalOpen}
        onOpenChange={setDetailsModalOpen}
      />
    </div>
  );
};

export default ManageOrders;
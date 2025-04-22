"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { IOrder } from "@/types/order";

function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface OrderDetailsModalProps {
  order: IOrder | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isUserView?: boolean; // optional
}

const OrderDetailsModal = ({
  order,
  isOpen,
  onOpenChange,
  isUserView = false,
}: OrderDetailsModalProps) => {
  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>
              {isUserView ? "Order Details" : `Order ID: ${order._id.slice(-8)}`}
            </span>
            <Badge
              variant={
                order.status === "Completed"
                  ? "default"
                  : order.status === "Cancelled"
                  ? "destructive"
                  : order.status === "Processing"
                  ? "secondary"
                  : "outline"
              }
            >
              {order.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Info (skip if user view) */}
          {!isUserView && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-lg mb-3">Customer Information</h3>
                <div className="space-y-2 text-sm bg-gray-50 p-4 rounded-lg">
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {order.user?.name || "Guest"}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {order.user?.email || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Shipping Info */}
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-lg mb-3">Shipping Information</h3>
              <div className="space-y-2 text-sm bg-gray-50 p-4 rounded-lg">
                <p>
                  <span className="font-medium">Address:</span>{" "}
                  {order.shippingAddress}
                </p>
                <p>
                  <span className="font-medium">Payment Method:</span>{" "}
                  {order.paymentMethod}
                </p>
                <p className="flex items-center">
                  <span className="font-medium">Payment Status:</span>
                  <Badge
                    variant={
                      order.paymentStatus === "Paid" ? "default" : "destructive"
                    }
                    className="ml-2"
                  >
                    {order.paymentStatus}
                  </Badge>
                </p>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <h3 className="font-medium text-lg mb-3">Order Summary</h3>
              <div className="space-y-2 text-sm bg-gray-50 p-4 rounded-lg">
                <p>
                  <span className="font-medium">Order Date:</span>{" "}
                  {formatDate(order.createdAt)}
                </p>
                {order.coupon && (
                  <p>
                    <span className="font-medium">Coupon:</span>{" "}
                    {order.coupon.code}
                  </p>
                )}
                <p>
                  <span className="font-medium">Subtotal:</span> $
                  {order.totalAmount.toFixed(2)}
                </p>
                {order.discount > 0 && (
                  <p>
                    <span className="font-medium">Discount:</span> -$
                    {order.discount.toFixed(2)}
                  </p>
                )}
                <p>
                  <span className="font-medium">Delivery:</span> $
                  {order.deliveryCharge.toFixed(2)}
                </p>
                <p className="font-medium text-lg pt-2 border-t">
                  <span>Total:</span> ${order.finalAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="md:col-span-2">
            <h3 className="font-medium text-lg mb-3">Order Items</h3>
            <div className="border rounded-lg divide-y">
              {order.products.map((item) => (
                <div
                  key={item._id}
                  className="p-4 flex justify-between items-center"
                >
                  <div className="flex items-center space-x-4">
                    {item.product?.images?.[0] && (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        width={80}
                        height={80}
                        className="w-20 h-20 object-cover rounded"
                      />
                    )}
                    <div>
                      <p className="font-medium">{item.product?.name}</p>
                      <p className="text-sm text-gray-500">
                        Color: {item.color}
                      </p>
                      <p className="text-sm text-gray-500">
                        ${item.unitPrice.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p>Qty: {item.quantity}</p>
                    <p className="font-medium">
                      ${(item.quantity * item.unitPrice).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;

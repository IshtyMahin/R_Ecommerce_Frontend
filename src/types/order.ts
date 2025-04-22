export interface IOrder {
    _id: string;
    user: {
      _id: string;
      name: string;
      email: string;
    };
    products: {
      _id: string;
      product: {
        _id: string;
        name: string;
        images: string[];
      };
      quantity: number;
      unitPrice: number;
      color: string;
    }[];
    coupon?: {
      _id: string;
      code: string;
    };
    totalAmount: number;
    discount: number;
    deliveryCharge: number;
    finalAmount: number;
    status: "Pending" | "Processing" | "Completed" | "Cancelled";
    shippingAddress: string;
    paymentMethod: "COD" | "Online";
    paymentStatus: "Pending" | "Paid" | "Failed";
    createdAt: string | Date;
    updatedAt: string | Date;
  }
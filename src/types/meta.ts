// types/meta.ts
export interface IMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export type MonthlySales = {
  month: number;
  totalSales: number;
  orderCount: number;
  year?: number; // Added optional year field
};

export type OrderStatusCount = {
  status: string;
  count: number;
};

export type PaymentStatusCount = {
  status: string;
  totalPayments: number;
};

export type MetaData = {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  todaysSales: number;
  monthlySales: MonthlySales[];
  orderStatusCounts: OrderStatusCount[];
  paymentStatusCounts: PaymentStatusCount[];
  totalProducts: number;
  totalPayments: number;
  totalCategories: number;
  totalRefunds: number;
  avgOrderValue: number;
};

export type UserOrderStatus = {
  status: string;
  count: number;
};

export type UserMonthlySpending = {
  month: number;
  totalSpent: number;
  orderCount: number;
  avgOrderValue: number;
};

export type UserMetaData = {
  totalOrders: number;
  totalSpent: number;
  avgOrderValue: number;
  orderStatus: UserOrderStatus[];
  monthlySpending: UserMonthlySpending[];
};
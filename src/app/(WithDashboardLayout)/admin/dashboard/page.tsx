"use server";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, PieChart } from "@/components/ui/charts";
import { getMetaData } from "@/services/Meta";
import { MetaData } from "@/types/meta";
import { Box, Calendar, CheckCircle2, Clock, CreditCard, DollarSign, HelpCircle, Package, PieChartIcon, ReceiptText, TrendingUp, XCircle } from "lucide-react";

export default async function AdminDashboard() {
  let metaData: MetaData;

  try {
    metaData = (await getMetaData()).data;
    
    if (!metaData) throw new Error("No metadata found");
  } catch (error) {
    return <div className="text-red-500">Failed to load dashboard data.</div>;
  }

  const monthlySalesData = (metaData.monthlySales ?? []).map((sale) => ({
    name: new Date(0, sale.month - 1).toLocaleString("default", { month: "short" }),
    value: sale.totalSales,
    orderCount: sale.orderCount,
  }));
  

  const orderStatusData = (metaData.orderStatusCounts ?? []).map((status) => ({
    name: status.status,
    value: status.count,
  }));

  return (
    <div className="flex flex-col gap-4">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">💸 Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              ${(metaData.totalRevenue ?? 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">All-time total revenue</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-100 to-green-50 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">📦 Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">
              {(metaData.totalOrders ?? 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Total orders placed</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-100 to-blue-50 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">👥 Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">
              {(metaData.totalUsers ?? 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-100 to-yellow-50 border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700">💰 Today&apos;s Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">
              ${(metaData.todaysSales ?? 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Revenue today</p>
          </CardContent>
        </Card>
      </div>

{/* Charts Section */}
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
  {/* Monthly Revenue Card */}
  <Card className="col-span-4">
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="bg-primary/10 p-2 rounded-lg">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          Monthly Revenue
        </CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-8">
            <span className="hidden sm:inline">This</span> Year
          </Button>
          <Button variant="ghost" size="sm" className="h-8">
            <span className="hidden sm:inline">Last</span> Year
          </Button>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="h-[400px]">
        <BarChart
          data={monthlySalesData}
          xAxisLabel="Month"
          yAxisLabel="Revenue ($)"
          colors={['#3b82f6']} // Blue color for bars
          showTooltip={true}
          showGrid={true}
          showLegend={false}
        />
        <div className="mt-4 flex justify-between text-sm text-muted-foreground">
          <span>Total: ${metaData.totalRevenue?.toLocaleString() || 0}</span>
          <span>Avg: ${Math.round((metaData.totalRevenue || 0) / 12).toLocaleString()}/mo</span>
        </div>
      </div>
    </CardContent>
  </Card>

  {/* Order Status Distribution Card */}
  <Card className="col-span-3">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-lg">
        <div className="bg-emerald-100 p-2 rounded-lg">
          <PieChartIcon className="w-5 h-5 text-emerald-600" />
        </div>
        Order Status
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="h-[400px] flex flex-col">
        <div className="flex-1">
          <PieChart
            data={orderStatusData}
            colors={['#10b981', '#f59e0b', '#ef4444', '#6366f1']} 
            innerRadius={0.6}
            showLabel={true}
            labelType="percent"
          />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {orderStatusData.map((status, index) => (
            <div key={status.name} className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ 
                  backgroundColor: [
                    '#10b981', 
                    '#f59e0b', 
                    '#ef4444', 
                    '#6366f1'
                  ][index % 4] 
                }}
              />
              <span className="text-sm font-medium capitalize">{status.name.toLowerCase()}</span>
              <span className="text-sm text-muted-foreground">
                : {status.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
</div>

{/* Payment Status Card */}
<Card className="col-span-3">
  <CardHeader>
    <CardTitle className="flex items-center gap-2 text-lg font-semibold">
      <div className="bg-purple-100 p-2 rounded-lg">
        <ReceiptText className="w-5 h-5 text-purple-600" />
      </div>
      <span>Payment Status</span>
    </CardTitle>
  </CardHeader>

  <CardContent>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {(metaData.paymentStatusCounts ?? []).map((payment) => {
        const { status, totalPayments } = payment;
        const percent = ((totalPayments / (metaData.totalPayments || 1)) * 100).toFixed(0);

        const iconMap = {
          Paid: <CheckCircle2 className="w-5 h-5 text-green-600" />,
          Pending: <Clock className="w-5 h-5 text-yellow-600" />,
          Failed: <XCircle className="w-5 h-5 text-red-600" />,
          Default: <HelpCircle className="w-5 h-5 text-gray-600" />
        };

        const bgMap = {
          Paid: "bg-green-100",
          Pending: "bg-yellow-100",
          Failed: "bg-red-100",
          Default: "bg-gray-100"
        };

        const icon = iconMap[status as keyof typeof iconMap] || iconMap.Default;
        const bg = bgMap[status as keyof typeof bgMap] || bgMap.Default;

        return (
          <div
            key={status}
            className="flex items-center justify-between gap-4 p-4 rounded-xl border bg-white hover:bg-muted/60 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className={`${bg} w-10 h-10 flex items-center justify-center rounded-lg`}>
                {icon}
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-medium capitalize">{status}</p>
                <p className="text-xs text-muted-foreground">
                  {totalPayments === 1 ? "1 payment" : `${totalPayments} payments`}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="px-3 py-1 text-sm font-medium">
              {percent}%
            </Badge>
          </div>
        );
      })}
    </div>
  </CardContent>
</Card>

{/* Products Summary Card */}
<Card className="col-span-4">
  <CardHeader>
    <CardTitle className="flex items-center gap-2 text-lg font-semibold">
      <div className="bg-blue-100 p-2 rounded-lg">
        <Package className="w-5 h-5 text-blue-600" />
      </div>
      <span>Products Summary</span>
    </CardTitle>
  </CardHeader>

  <CardContent>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[
        {
          title: "Total Products",
          value: metaData.totalProducts?.toLocaleString() ?? "0",
          icon: <Box className="w-5 h-5 text-primary" />,
          bg: "bg-primary/10"
        },
        {
          title: "Total Payments",
          value: metaData.totalPayments?.toLocaleString() ?? "0",
          icon: <CreditCard className="w-5 h-5 text-green-600" />,
          bg: "bg-green-100"
        },
        {
          title: "Avg. Order Value",
          value: `$${((metaData.totalRevenue ?? 0) / (metaData.totalOrders || 1)).toFixed(2)}`,
          icon: <DollarSign className="w-5 h-5 text-yellow-600" />,
          bg: "bg-yellow-100"
        },
        {
          title: "Monthly Orders",
          value: Math.round((metaData.totalOrders ?? 0) / 12).toLocaleString(),
          icon: <Calendar className="w-5 h-5 text-blue-600" />,
          bg: "bg-blue-100"
        }
      ].map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-4 p-4 rounded-xl border bg-white hover:bg-muted/60 transition-all duration-300 shadow-sm hover:shadow-md"
        >
          <div className={`${item.bg} w-12 h-12 flex items-center justify-center rounded-lg`}>
            {item.icon}
          </div>
          <div className="flex flex-col">
            <p className="text-sm text-muted-foreground">{item.title}</p>
            <p className="text-xl font-semibold leading-6">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  </CardContent>
</Card>



      <Card className="border border-muted-foreground/20">
      <CardHeader>
        <CardTitle>📅 Monthly Sales Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/20">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Month</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Revenue</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Orders</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(metaData.monthlySales ?? []).map((sale, idx) => (
                <tr key={sale.month} className={idx % 2 === 0 ? "bg-muted/10" : ""}>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    {new Date(0, sale.month - 1).toLocaleString("default", { month: "long" })}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-primary">
                    ${sale.totalSales?.toLocaleString() ?? 0}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">
                    {sale.orderCount?.toLocaleString() ?? 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
    </div>
  );
}

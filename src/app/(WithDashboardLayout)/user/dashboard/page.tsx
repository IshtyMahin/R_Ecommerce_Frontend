import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, BarChart } from "@/components/ui/charts";
import { getMetaData } from "@/services/Meta";
import { UserMetaData } from "@/types";

export default async function UserDashboard() {
  let userMeta: UserMetaData;

  try {
    userMeta = (await getMetaData()).data;
  } catch (error) {
    return <div className="text-red-500">Failed to load your dashboard.</div>;
  }

  const monthlySpendingData = (userMeta.monthlySpending ?? []).map((spend) => ({
    name: new Date(0, spend.month - 1).toLocaleString("default", { month: "short" }),  
    value: spend.totalSpent,
  }));

  const orderStatusData = (userMeta.orderStatus ?? []).map((status) => ({
    name: status.status,
    value: status.count,
  }));

  return (
    <div className="flex flex-col gap-4 p-2 sm:p-4">
      {/* Summary Cards - Stack on mobile, 2 columns on tablet+ */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Total Orders</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-2xl sm:text-3xl font-bold">
              {(userMeta.totalOrders ?? 0).toLocaleString()}
            </div>
            <p className="text-xs sm:text-sm">Number of orders placed</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-700 text-white">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Total Spent</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-2xl sm:text-3xl font-bold">
              ${Number(userMeta.totalSpent ?? 0).toLocaleString()}
            </div>
            <p className="text-xs sm:text-sm">Total money spent</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts - Stack on mobile, side by side on tablet+ */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Monthly Spending</CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-6">
            <div className="h-[300px] sm:h-[350px]">
              <BarChart
                data={monthlySpendingData}
                xAxisLabel="Month"
                yAxisLabel="Amount ($)"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Order Status</CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-6">
            <div className="h-[300px] sm:h-[350px]">
              <PieChart data={orderStatusData} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Spending Table */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">Spending Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr>
                  <th className="px-3 py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground">
                    Month
                  </th>
                  <th className="px-3 py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(userMeta.monthlySpending ?? []).map((spend) => (
                    <tr key={spend.month}>
                    <td className="px-4 py-3 text-sm">
                        {new Date(0, spend.month - 1).toLocaleString("default", { month: "long" })}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">
                        ${Number(spend.totalSpent ?? 0).toLocaleString()}
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
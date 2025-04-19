"use client";

import {
  BarChart as RechartsBarChart,
  PieChart as RechartsPieChart,
  Bar,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";

const DEFAULT_COLORS = [
  "#3b82f6", // blue-500
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#ef4444", // red-500
  "#6366f1", // violet-500
  "#8b5cf6", // purple-500
];

interface ChartProps {
  className?: string;
  colors?: string[];
  showTooltip?: boolean;
  showGrid?: boolean;
  showLegend?: boolean;
}

interface BarChartProps extends ChartProps {
  data: {
    name: string;
    value: number;
    [key: string]: any;
  }[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  barSize?: number;
  showBarLabel?: boolean;
}

interface PieChartProps extends ChartProps {
  data: {
    name: string;
    value: number;
  }[];
  innerRadius?: number;
  outerRadius?: number;
  showLabel?: boolean;
  labelType?: 'value' | 'percent' | 'name';
  labelFormatter?: (name: string, value: number, percent: number) => string;
}

export function BarChart({
  className,
  data,
  xAxisLabel,
  yAxisLabel,
  colors = DEFAULT_COLORS,
  showTooltip = true,
  showGrid = true,
  showLegend = false,
  barSize = 40,
  showBarLabel = false,
  ...props
}: BarChartProps) {
  return (
    <div className={cn("h-[350px]", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          {...props}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              className="opacity-30"
              stroke="hsl(var(--border))"
            />
          )}
          <XAxis
            dataKey="name"
            label={{ 
              value: xAxisLabel, 
              position: 'bottom', 
              offset: 10,
              fill: "hsl(var(--muted-foreground))"
            }}
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            label={{
              value: yAxisLabel,
              angle: -90,
              position: 'left',
              offset: 10,
              fill: "hsl(var(--muted-foreground))"
            }}
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          {showTooltip && (
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                borderColor: "hsl(var(--border))",
                borderRadius: "calc(var(--radius) - 2px)",
                boxShadow: "var(--shadow-md)",
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, yAxisLabel]}
            />
          )}
          <Bar
            dataKey="value"
            fill={colors[0]}
            radius={[4, 4, 0, 0]}
            barSize={barSize}
            label={showBarLabel ? {
              position: 'top',
              formatter: (value: number) => `$${value.toLocaleString()}`,
              fill: "hsl(var(--foreground))",
              fontSize: 12
            } : undefined}
          />
          {showLegend && (
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ paddingTop: '20px' }}
            />
          )}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PieChart({
  className,
  data,
  colors = DEFAULT_COLORS,
  innerRadius = 60,
  outerRadius = 80,
  showLabel = true,
  labelType = 'percent',
  showTooltip = true,
  showLegend = true,
  labelFormatter = (name, value, percent) => 
    `${name}: ${value} (${(percent * 100).toFixed(0)}%)`,
  ...props
}: PieChartProps) {
  const renderLabel = (entry: any) => {
    switch (labelType) {
      case 'value':
        return entry.value;
      case 'percent':
        return `${(entry.percent * 100).toFixed(0)}%`;
      case 'name':
        return entry.name;
      default:
        return labelFormatter(entry.name, entry.value, entry.percent);
    }
  };

  return (
    <div className={cn("h-[350px]", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart margin={{ top: 20, right: 30, left: 20, bottom: 60 }} {...props}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            fill="hsl(var(--foreground))"
            dataKey="value"
            label={showLabel ? renderLabel : undefined}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
                stroke="hsl(var(--background))"
                strokeWidth={2}
              />
            ))}
          </Pie>
          {showTooltip && (
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                borderColor: "hsl(var(--border))",
                borderRadius: "calc(var(--radius) - 2px)",
                boxShadow: "var(--shadow-md)",
              }}
              formatter={(value: number, name: string) => [
                value.toLocaleString(),
                name,
              ]}
            />
          )}
          {showLegend && (
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => <span className="text-sm capitalize">{value.toLowerCase()}</span>}
            />
          )}
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}
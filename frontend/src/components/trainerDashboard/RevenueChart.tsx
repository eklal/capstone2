// src/components/dashboard/RevenueChart.tsx
import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { ShimmerLine } from "../ui/Shimmer";

type Props = {
  data?: { date: string; revenue: number }[];
  loading?: boolean;
};

const RevenueChart: React.FC<Props> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="h-64 p-4 border rounded bg-white">
        <ShimmerLine height="h-6" width="w-32" />
        <div className="mt-4 h-48 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="h-64 p-2 bg-white border rounded">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3182ce" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3182ce" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="revenue" stroke="#3182ce" fillOpacity={1} fill="url(#colorRev)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;

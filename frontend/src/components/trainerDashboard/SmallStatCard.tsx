// src/components/dashboard/SmallStatCard.tsx
import React from "react";
import { ShimmerLine } from "../ui/Shimmer";

const SmallStatCard: React.FC<{ title: string; value?: string | number; loading?: boolean; icon?: React.ReactNode }> = ({ title, value, loading, icon }) => {
  return (
    <div className="bg-white border rounded-lg p-4 flex items-center gap-4">
      <div className="w-12 h-12 bg-gray-50 rounded flex items-center justify-center">{icon}</div>
      <div className="flex-1">
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-xl font-semibold mt-1">
          {loading ? <ShimmerLine width="w-24" height="h-6" /> : value}
        </div>
      </div>
    </div>
  );
};

export default SmallStatCard;

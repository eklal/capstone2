// src/components/ui/Shimmer.tsx
import React from "react";

export const ShimmerLine: React.FC<{ width?: string; height?: string }> = ({ width = "w-full", height = "h-4" }) => (
  <div className={`${width} ${height} bg-gray-200 rounded animate-pulse`} />
);

export const ShimmerCard: React.FC = () => (
  <div className="p-4 border rounded bg-white">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse mb-2" />
        <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
      </div>
    </div>
  </div>
);

// src/components/ShimmerLoader.tsx
import React from "react";

export const ShimmerCard: React.FC = () => (
  <div className="animate-pulse p-4 border rounded bg-white flex gap-4">
    <div className="w-20 h-20 rounded-full bg-gray-200" />
    <div className="flex-1">
      <div className="h-5 bg-gray-200 rounded w-1/3 mb-3" />
      <div className="h-3 bg-gray-200 rounded w-2/3 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
    </div>
    <div className="w-24 h-10 bg-gray-200 rounded" />
  </div>
);

export const ShimmerList: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <ShimmerCard key={i} />
    ))}
  </div>
);

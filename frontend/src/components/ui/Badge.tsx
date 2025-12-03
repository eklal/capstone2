import React from "react";

const Badge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full mr-2">
    {children}
  </span>
);

export default Badge;

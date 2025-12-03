import React from "react";
import Card from "../ui/Card";

const Certifications: React.FC<{ items: { title:string, expires:string }[] }> = ({ items }) => {
  return (
    <Card>
      <h3 className="font-semibold mb-3">Certifications</h3>
      <ul className="space-y-3 text-sm text-gray-700">
        {items.map((c, i) => (
          <li key={i} className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">🏷️</div>
            <div>
              <div className="font-medium">{c.title}</div>
              <div className="text-xs text-gray-500">Expires: {c.expires}</div>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default Certifications;


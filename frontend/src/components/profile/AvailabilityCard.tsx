import React from "react";
import Card from "../ui/Card";

const AvailabilityCard: React.FC<{ schedule: Record<string,string> }> = ({ schedule }) => {
  return (
    <Card>
      <h3 className="font-semibold mb-3">Availability</h3>
      <div className="text-sm text-gray-700">
        {Object.entries(schedule).map(([day, hours]) => (
          <div key={day} className="flex justify-between mb-2">
            <span className="capitalize">{day}</span>
            <span>{hours}</span>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <button className="w-full px-3 py-2 border rounded text-sm">Update Schedule</button>
      </div>
    </Card>
  );
};

export default AvailabilityCard;

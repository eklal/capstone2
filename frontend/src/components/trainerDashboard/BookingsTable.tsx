// src/components/dashboard/BookingsTable.tsx
import React, { useState } from "react";
import { Booking } from "../../api/booking";
import { ShimmerCard } from "../ui/Shimmer";
import BookingActionModal from "./BookingActionModal";

const BookingsTable: React.FC<{
  bookings?: Booking[];
  loading?: boolean;
  onAction: (bookingId: string, status: Booking["status"]) => Promise<void>;
}> = ({ bookings = [], loading, onAction }) => {
  const [selected, setSelected] = useState<Booking | null>(null);
  const [action, setAction] = useState<"Accept" | "Reject" | null>(null);

  if (loading) {
    return <div className="space-y-3"><ShimmerCard /><ShimmerCard /><ShimmerCard /></div>;
  }

  return (
    <div>
      <table className="w-full text-sm">
        <thead className="text-left text-gray-600">
          <tr>
            <th className="py-2">Client</th>
            <th>Service</th>
            <th>Date</th>
            <th>Duration</th>
            <th>Amount</th>
            <th>Status</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {bookings.map(b => (
            <tr key={b.id} className="bg-white">
              <td className="py-3">{b.client}</td>
              <td>{b.service}</td>
              <td>{b.date}</td>
              <td>{b.duration}</td>
              <td>${b.amount}</td>
              <td>
                <span className={`px-2 py-1 rounded text-xs ${b.status === "pending" ? "bg-yellow-100 text-yellow-700" : b.status === "accepted" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"}`}>
                  {b.status}
                </span>
              </td>
              <td className="text-right">
                {b.status === "pending" ? (
                  <div className="flex justify-end gap-2">
                    <button className="px-3 py-1 rounded bg-green-600 text-white" onClick={() => { setSelected(b); setAction("Accept"); }}>Accept</button>
                    <button className="px-3 py-1 rounded bg-red-600 text-white" onClick={() => { setSelected(b); setAction("Reject"); }}>Reject</button>
                  </div>
                ) : (
                  <div className="text-right">
                    <button className="px-3 py-1 border rounded text-sm">View Details</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      <BookingActionModal
        open={!!selected && !!action}
        onClose={() => { setSelected(null); setAction(null); }}
        actionLabel={action || "Accept"}
        bookingInfo={selected ? { client: selected.client, service: selected.service, date: selected.date, amount: selected.amount } : undefined}
        onConfirm={async (status) => {
          if (!selected) return;
          await onAction(selected.id, status as any);
          setSelected(null);
          setAction(null);
        }}
      />
    </div>
  );
};

export default BookingsTable;

// src/components/dashboard/BookingActionModal.tsx
import React, { useState } from "react";

const BookingActionModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onConfirm: (action: "accepted" | "rejected") => Promise<void>;
  actionLabel: "Accept" | "Reject";
  bookingInfo?: { client: string; service: string; date: string; amount: number };
}> = ({ open, onClose, onConfirm, actionLabel, bookingInfo }) => {
  const [loading, setLoading] = useState(false);
  if (!open) return null;

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm(actionLabel === "Accept" ? "accepted" : "rejected");
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg p-6 w-full max-w-md z-10">
        <h3 className="text-lg font-semibold mb-2">{actionLabel} Booking</h3>
        <p className="text-sm text-gray-600 mb-4">Are you sure you want to {actionLabel.toLowerCase()} this booking?</p>

        {bookingInfo && (
          <div className="mb-4 border rounded p-3 text-sm">
            <div><strong>Client:</strong> {bookingInfo.client}</div>
            <div><strong>Service:</strong> {bookingInfo.service}</div>
            <div><strong>Date:</strong> {bookingInfo.date}</div>
            <div><strong>Amount:</strong> ${bookingInfo.amount}</div>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button className="px-4 py-2 border rounded" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="px-4 py-2 rounded bg-[var(--primary)] text-white" onClick={handleConfirm} disabled={loading}>
            {loading ? "Processing..." : actionLabel}
          </button>
      </div>
    </div>
     </div>
  );
};

export default BookingActionModal;

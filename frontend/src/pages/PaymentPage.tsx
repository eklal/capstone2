import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createBooking } from "@/api/bookings";
import { format } from "date-fns";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FaCreditCard, FaLock, FaUser, FaCalendar, FaClock, FaMapMarkerAlt, FaInfoCircle } from "react-icons/fa";
import { HiArrowLeft } from "react-icons/hi";

interface BookingDetails {
  trainer_id: number;
  trainer_name: string;
  date: string;
  start_time: string;
  end_time: string;
  session_type: string;
  price: number;
  notes: string;
}

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingDetails = location.state?.bookingDetails as BookingDetails | undefined;

  const [processing, setProcessing] = useState(false);

  if (!bookingDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No booking details found</h2>
          <button
            onClick={() => navigate("/find-trainers")}
            className="px-6 py-2 bg-black text-white rounded-lg"
          >
            Back to Trainers
          </button>
        </div>
      </div>
    );
  }

  const sessionFee = Number(bookingDetails.price);
  const platformFee = sessionFee * 0.05; // 5% platform fee
  const processingFee = 2.5; // Fixed processing fee
  const total = sessionFee + platformFee + processingFee;

  const handleCompletePayment = async () => {
    try {
      setProcessing(true);

      // Create booking in database (status will be "pending" by default)
      const newBooking = await createBooking({
        trainer: bookingDetails.trainer_id,
        date: bookingDetails.date,
        start_time: bookingDetails.start_time,
        end_time: bookingDetails.end_time,
        session_type: bookingDetails.session_type,
        price: Number(bookingDetails.price),
        notes: bookingDetails.notes,
      });

      // Show success toast
      toast.success(
        (t: { id: string }) => (
          <div className="flex flex-col gap-2">
            <div className="font-bold text-lg">Booking Confirmed!</div>
            <div className="text-sm space-y-1">
              <p><strong>Booking ID:</strong> #{newBooking.id}</p>
              <p><strong>Trainer:</strong> {bookingDetails.trainer_name}</p>
              <p><strong>Date:</strong> {format(new Date(bookingDetails.date), "MMM d, yyyy")}</p>
              <p><strong>Time:</strong> {bookingDetails.start_time} - {bookingDetails.end_time}</p>
              <p className="text-yellow-600 mt-2">Status: Pending trainer confirmation</p>
            </div>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="text-sm text-blue-600 hover:text-blue-800 text-left"
            >
              Dismiss
            </button>
          </div>
        ),
        {
          duration: 6000,
          position: "top-center",
          style: {
            maxWidth: "500px",
            padding: "20px",
          },
        }
      );

      // Wait a moment for user to see the toast, then redirect
      setTimeout(() => {
        navigate("/client-dashboard");
      }, 1500);
      
    } catch (error) {
      console.error("Error completing payment:", error);
      
      // Show error toast
      toast.error(
        "Booking failed. Please try again or contact support.",
        {
          duration: 4000,
          position: "top-center",
        }
      );
      
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8 pt-24">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <HiArrowLeft className="text-xl" />
          <span>Back to Booking</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Complete Your Payment</h1>
          <p className="text-gray-600">
            Secure your training session with {bookingDetails.trainer_name}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Payment Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sample Payment Notice */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Payment Information</h2>
              
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <FaInfoCircle className="text-blue-600 text-xl mt-0.5" />
                    <div>
                      <p className="font-semibold text-blue-900 mb-1">Demo Payment Mode</p>
                      <p className="text-sm text-blue-700">
                        This is a sample payment system. Click "Confirm Payment" below to complete your booking. 
                        In production, you would integrate with Stripe, PayPal, or other payment providers.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <div className="flex items-center gap-3 p-4 border-2 border-green-500 bg-green-50 rounded-lg">
                    <FaCreditCard className="text-2xl text-green-600" />
                    <div>
                      <p className="font-semibold text-green-900">Sample Payment Method</p>
                      <p className="text-sm text-green-700">Ready to process</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-4 bg-gray-50 rounded-lg mt-4">
                  <FaLock className="text-xl text-green-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-gray-900">Secure Booking</p>
                    <p className="text-gray-600">
                      Your booking will be created and the trainer will be notified immediately.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Booking Summary</h2>

              {/* Trainer Info */}
              <div className="flex items-center gap-3 mb-6 pb-6 border-b">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <FaUser className="text-xl text-gray-600" />
                </div>
                <div>
                  <p className="font-semibold">{bookingDetails.trainer_name}</p>
                  <p className="text-sm text-gray-500">Personal Trainer</p>
                  <div className="flex items-center gap-1 text-xs text-yellow-500 mt-1">
                    ★★★★★ <span className="text-gray-500">4.9 (127)</span>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex items-center gap-2 text-sm">
                  <FaCalendar className="text-gray-600" />
                  <span>{format(new Date(bookingDetails.date), "MMMM d, yyyy")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FaClock className="text-gray-600" />
                  <span>{bookingDetails.start_time} - {bookingDetails.end_time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FaMapMarkerAlt className="text-gray-600" />
                  <span>In-Person Training</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FaClock className="text-gray-600" />
                  <span>1 Hour Session</span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 mb-6 pb-6 border-b text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Session Fee:</span>
                  <span className="font-medium">${sessionFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Platform Fee:</span>
                  <span className="font-medium">${platformFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Processing Fee:</span>
                  <span className="font-medium">${processingFee.toFixed(2)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-6 text-lg font-bold">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>

              {/* Complete Payment Button */}
              <button
                onClick={handleCompletePayment}
                disabled={processing}
                className={`
                  w-full py-3 rounded-lg font-semibold text-white transition-colors flex items-center justify-center gap-2
                  ${processing ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"}
                `}
              >
                <FaLock />
                <span>{processing ? "Processing..." : "Complete Payment"}</span>
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                By completing this payment, you agree to our{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
              </p>

              {/* Cancellation Policy */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <FaInfoCircle className="text-blue-600 text-lg mt-0.5" />
                  <div className="text-xs">
                    <p className="font-semibold text-blue-900 mb-1">
                      Cancellation Policy
                    </p>
                    <p className="text-blue-700">
                      Free cancellation up to 24 hours before the session. Cancellations
                      within 24 hours are subject to a 50% charge.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

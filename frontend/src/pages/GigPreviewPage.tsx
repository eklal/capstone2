// src/pages/GigPreviewPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FiArrowLeft, FiEdit, FiUpload, FiPause, FiPlay } from "react-icons/fi";
import { getGigById, updateGigStatus, Gig, GigStatus } from "../api/gigs";
import Card from "../components/ui/Card";
import { ShimmerCard, ShimmerLine } from "../components/ui/Shimmer";

const TRAINER_ID = 101; // Same constant as MyGigs

export default function GigPreviewPage() {
  const { gigId } = useParams<{ gigId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [gig, setGig] = useState<Gig | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGig = async () => {
      if (!gigId) {
        setError("Gig ID is required");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const gigData = await getGigById(TRAINER_ID, gigId);
        if (!gigData) {
          setError("Gig not found");
        } else {
          setGig(gigData);
        }
      } catch (err) {
        console.error("Failed to fetch gig", err);
        setError("Failed to load gig");
      } finally {
        setLoading(false);
      }
    };

    fetchGig();
  }, [gigId]);

  const handleStatusChange = async (newStatus: GigStatus) => {
    if (!gig) return;

    // Optimistic update
    setGig({ ...gig, status: newStatus });

    try {
      await updateGigStatus(gig.id, newStatus);
      // TODO: In a real app, refresh the gig data or handle the response
    } catch (err) {
      console.error("Failed to update gig status", err);
      // Rollback on error
      setGig(gig);
    }
  };

  const getStatusColor = (status: GigStatus) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <ShimmerLine width="w-48" height="h-8" className="mb-4" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ShimmerCard />
            <ShimmerCard />
            <ShimmerCard />
          </div>
          <div>
            <ShimmerCard />
          </div>
        </div>
      </div>
    );
  }

  if (error || !gig) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Card>
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{error || "Gig not found"}</h2>
            <p className="text-gray-600 mb-6">The gig you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => navigate("/trainer/gigs")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <FiArrowLeft className="w-4 h-4" />
              Back to My Gigs
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/trainer/gigs")}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">Gig Preview</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/trainer/gigs/${gig.id}/edit`}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <FiEdit className="w-4 h-4" />
            Edit Gig
          </Link>
          {gig.status === "draft" && (
            <button
              onClick={() => handleStatusChange("active")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <FiUpload className="w-4 h-4" />
              Publish
            </button>
          )}
          {gig.status === "active" && (
            <button
              onClick={() => handleStatusChange("paused")}
              className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2"
            >
              <FiPause className="w-4 h-4" />
              Pause
            </button>
          )}
          {gig.status === "paused" && (
            <button
              onClick={() => handleStatusChange("active")}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <FiPlay className="w-4 h-4" />
              Activate
            </button>
          )}
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero Section */}
          <Card className="overflow-hidden">
            {/* Cover Image */}
            <div className="w-full h-64 bg-gray-300 rounded-t-lg flex items-center justify-center mb-6">
              {gig.imageUrl ? (
                <img src={gig.imageUrl} alt={gig.title} className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-600 font-medium text-lg">{gig.category || "Training Service"}</span>
              )}
            </div>

            <div className="px-6 pb-6">
              {/* Title and Status */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">{gig.title}</h2>
                  {gig.category && (
                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium mb-3">
                      {gig.category}
                    </span>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(gig.status)}`}>
                  {gig.status.charAt(0).toUpperCase() + gig.status.slice(1)}
                </span>
              </div>

              {/* Rating, Reviews, Views */}
              <div className="flex items-center gap-6 mb-4 text-sm text-gray-600">
                {gig.rating ? (
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-500">★</span>
                    <span className="font-medium">{gig.rating}</span>
                    <span className="text-gray-500">({gig.reviews} reviews)</span>
                  </div>
                ) : (
                  <span>No reviews</span>
                )}
                <span>{gig.views} views</span>
              </div>

              {/* Price */}
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  ${gig.price}
                  <span className="text-lg font-normal text-gray-600">/{gig.unit}</span>
                </span>
              </div>
            </div>
          </Card>

          {/* About this service */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">About this service</h3>
            <p className="text-gray-600 leading-relaxed">{gig.description}</p>
          </Card>

          {/* Pricing & Duration */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Duration</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Price</span>
                <span className="font-semibold text-gray-900">
                  ${gig.price}/{gig.unit}
                </span>
              </div>
              {gig.durationMinutes && (
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-semibold text-gray-900">
                    {gig.durationMinutes} minutes
                  </span>
                </div>
              )}
            </div>
          </Card>

          {/* Service Details */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Details</h3>
            <div className="space-y-4">
              {gig.locationType && (
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Location Type</span>
                  <span className="font-semibold text-gray-900">{gig.locationType}</span>
                </div>
              )}
              {gig.maxParticipants !== undefined && (
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Max Participants</span>
                  <span className="font-semibold text-gray-900">{gig.maxParticipants}</span>
                </div>
              )}
              {gig.equipmentIncluded && gig.equipmentIncluded.length > 0 && (
                <div>
                  <span className="text-gray-600 block mb-2">Equipment Included</span>
                  <div className="flex flex-wrap gap-2">
                    {gig.equipmentIncluded.map((equipment, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {equipment}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {gig.fitnessLevels && gig.fitnessLevels.length > 0 && (
                <div>
                  <span className="text-gray-600 block mb-2">Fitness Levels</span>
                  <div className="flex flex-wrap gap-2">
                    {gig.fitnessLevels.map((level, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {level}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Availability & Policies */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability & Policies</h3>
            <div className="space-y-4">
              {gig.cancellationPolicy && (
                <div>
                  <span className="text-gray-600 block mb-2">Cancellation Policy</span>
                  <p className="text-gray-900">{gig.cancellationPolicy}</p>
                </div>
              )}
              {gig.additionalNotes && (
                <div>
                  <span className="text-gray-600 block mb-2">Additional Notes</span>
                  <p className="text-gray-900">{gig.additionalNotes}</p>
                </div>
              )}
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Instant Booking</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  gig.instantBookingEnabled
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {gig.instantBookingEnabled ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Quick Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Summary</h3>
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-gray-600 block mb-1">Price</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ${gig.price}
                    <span className="text-base font-normal text-gray-600">/{gig.unit}</span>
                  </span>
                </div>
                {gig.durationMinutes && (
                  <div>
                    <span className="text-sm text-gray-600 block mb-1">Duration</span>
                    <span className="text-lg font-semibold text-gray-900">{gig.durationMinutes} minutes</span>
                  </div>
                )}
                {gig.locationType && (
                  <div>
                    <span className="text-sm text-gray-600 block mb-1">Location Type</span>
                    <span className="text-lg font-semibold text-gray-900">{gig.locationType}</span>
                  </div>
                )}
                {gig.maxParticipants !== undefined && (
                  <div>
                    <span className="text-sm text-gray-600 block mb-1">Max Participants</span>
                    <span className="text-lg font-semibold text-gray-900">{gig.maxParticipants}</span>
                  </div>
                )}
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <Link
                    to={`/trainer/gigs/${gig.id}/edit`}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <FiEdit className="w-4 h-4" />
                    Edit
                  </Link>
                  {gig.status === "draft" && (
                    <button
                      onClick={() => handleStatusChange("active")}
                      className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
                    >
                      <FiUpload className="w-4 h-4" />
                      Publish
                    </button>
                  )}
                  {gig.status === "active" && (
                    <button
                      onClick={() => handleStatusChange("paused")}
                      className="w-full bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <FiPause className="w-4 h-4" />
                      Pause
                    </button>
                  )}
                  {gig.status === "paused" && (
                    <button
                      onClick={() => handleStatusChange("active")}
                      className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <FiPlay className="w-4 h-4" />
                      Activate
                    </button>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}


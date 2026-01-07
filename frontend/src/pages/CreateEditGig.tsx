// src/pages/CreateEditGig.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCamera } from "react-icons/fi";
import {
  getGigById,
  createGig,
  updateGig,
  publishGig,
  saveDraftGig,
  GigInput,
  Gig,
} from "../api/gigs";
import Card from "../components/ui/Card";
import { ShimmerCard, ShimmerLine } from "../components/ui/Shimmer";

const TRAINER_ID = 101;

const CATEGORIES = [
  "Personal Training Session",
  "Group Fitness Class",
  "Nutrition Consultation",
  "Workout Plan Package",
  "Yoga Session",
  "Pilates Class",
  "HIIT Training",
];

const PRICING_UNITS = [
  "Per Hour",
  "Per Session",
  "Per Person",
  "Per Week",
  "Per Month",
];

const DURATION_OPTIONS = [30, 45, 60, 90];

const LOCATION_TYPES = ["At My Gym", "Client Location", "Online"];

const EQUIPMENT_OPTIONS = [
  "Free Weights",
  "Resistance Bands",
  "Yoga Mats",
  "Cardio Equipment",
  "TRX/Suspension",
  "None Required",
];

const FITNESS_LEVELS = ["Beginner", "Intermediate", "Advanced"];

const CANCELLATION_POLICIES = [
  "24 hours notice required",
  "12 hours notice required",
  "No cancellation",
  "Flexible",
];

export default function CreateEditGig() {
  const { gigId } = useParams<{ gigId?: string }>();
  const navigate = useNavigate();
  const isEditMode = !!gigId;
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<GigInput>({
    title: "",
    description: "",
    price: 0,
    unit: "Per Hour",
    category: "",
    imageUrl: null,
    durationMinutes: 60,
    locationType: "At My Gym",
    maxParticipants: 1,
    equipmentIncluded: [],
    fitnessLevels: [],
    cancellationPolicy: "24 hours notice required",
    additionalNotes: "",
    instantBookingEnabled: false,
  });

  useEffect(() => {
    if (isEditMode && gigId) {
      const fetchGig = async () => {
        setLoading(true);
        try {
          const gig = await getGigById(TRAINER_ID, gigId);
          if (gig) {
            setFormData({
              title: gig.title,
              description: gig.description,
              price: gig.price,
              unit: gig.unit,
              category: gig.category || "",
              imageUrl: gig.imageUrl || null,
              durationMinutes: gig.durationMinutes || 60,
              locationType: gig.locationType || "At My Gym",
              maxParticipants: gig.maxParticipants || 1,
              equipmentIncluded: gig.equipmentIncluded || [],
              fitnessLevels: gig.fitnessLevels || [],
              cancellationPolicy: gig.cancellationPolicy || "24 hours notice required",
              additionalNotes: gig.additionalNotes || "",
              instantBookingEnabled: gig.instantBookingEnabled || false,
            });
            if (gig.imageUrl) {
              setImagePreview(gig.imageUrl);
            }
          } else {
            navigate("/trainer/gigs");
          }
        } catch (err) {
          console.error("Failed to fetch gig", err);
          navigate("/trainer/gigs");
        } finally {
          setLoading(false);
        }
      };
      fetchGig();
    }
  }, [gigId, isEditMode, navigate]);

  const handleInputChange = (
    field: keyof GigInput,
    value: string | number | boolean | string[] | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleEquipmentToggle = (equipment: string) => {
    const current = formData.equipmentIncluded || [];
    const updated = current.includes(equipment)
      ? current.filter((e) => e !== equipment)
      : [...current, equipment];
    handleInputChange("equipmentIncluded", updated);
  };

  const handleFitnessLevelToggle = (level: string) => {
    const current = formData.fitnessLevels || [];
    const updated = current.includes(level)
      ? current.filter((l) => l !== level)
      : [...current, level];
    handleInputChange("fitnessLevels", updated);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      // For now, store the preview URL as imageUrl
      // In production, you'd upload to a server and store the server URL
      handleInputChange("imageUrl", previewUrl);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Gig title is required";
    }
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.price || formData.price < 0) {
      newErrors.price = "Price must be greater than or equal to 0";
    }
    if (!formData.unit) {
      newErrors.unit = "Pricing unit is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveDraft = async () => {
    if (!validate()) return;

    setSubmitting(true);
    try {
      if (isEditMode && gigId) {
        await saveDraftGig(TRAINER_ID, formData, gigId);
      } else {
        await saveDraftGig(TRAINER_ID, formData);
      }
      navigate("/trainer/gigs");
    } catch (err) {
      console.error("Failed to save draft", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePublish = async () => {
    if (!validate()) return;

    setSubmitting(true);
    try {
      if (isEditMode && gigId) {
        await updateGig(TRAINER_ID, gigId, formData, "active");
      } else {
        await createGig(TRAINER_ID, formData, "active");
      }
      navigate("/trainer/gigs");
    } catch (err) {
      console.error("Failed to publish gig", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/trainer/gigs");
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <ShimmerLine width="w-48" height="h-8" className="mb-2" />
          <ShimmerLine width="w-96" height="h-4" />
        </div>
        <div className="space-y-6">
          <ShimmerCard />
          <ShimmerCard />
          <ShimmerCard />
          <ShimmerCard />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/trainer/gigs")}
          className="mb-4 p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
        >
          <FiArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">
          {isEditMode ? "Edit Gig" : "Create New Gig"}
        </h1>
        <p className="text-gray-600">Set up your training service for clients to book.</p>
      </div>

      {/* Form Sections */}
      <div className="space-y-6">
        {/* Basic Information */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="space-y-4">
            {/* Gig Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gig Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="e.g., 1-on-1 Personal Training"
                className={`w-full border rounded-md px-3 py-2 text-sm placeholder-gray-400 ${
                  errors.title ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className={`w-full border rounded-md px-3 py-2 text-sm ${
                  errors.category ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="">Select Category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe your training service, what clients can expect, and your approach..."
                rows={5}
                className={`w-full border rounded-md px-3 py-2 text-sm placeholder-gray-400 ${
                  errors.description ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">{errors.description}</p>
              )}
            </div>

            {/* Gig Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gig Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {imagePreview ? (
                  <div className="mb-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-48 mx-auto rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="mb-4 flex flex-col items-center">
                    <FiCamera className="w-12 h-12 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Upload an image for your gig</p>
                  </div>
                )}
                <label className="inline-block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <span className="cursor-pointer bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm inline-block">
                    Choose File
                  </span>
                </label>
              </div>
            </div>
          </div>
        </Card>

        {/* Pricing & Duration */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Duration</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  value={formData.price || ""}
                  onChange={(e) =>
                    handleInputChange("price", parseFloat(e.target.value) || 0)
                  }
                  min="0"
                  step="0.01"
                  className={`w-full border rounded-md pl-8 pr-3 py-2 text-sm ${
                    errors.price ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </div>

            {/* Pricing Unit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pricing Unit <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.unit}
                onChange={(e) => handleInputChange("unit", e.target.value)}
                className={`w-full border rounded-md px-3 py-2 text-sm ${
                  errors.unit ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                {PRICING_UNITS.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
              {errors.unit && <p className="text-red-500 text-xs mt-1">{errors.unit}</p>}
            </div>

            {/* Session Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Session Duration
              </label>
              <select
                value={formData.durationMinutes || ""}
                onChange={(e) =>
                  handleInputChange("durationMinutes", parseInt(e.target.value) || null)
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Duration</option>
                {DURATION_OPTIONS.map((duration) => (
                  <option key={duration} value={duration}>
                    {duration} minutes
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Service Details */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Details</h2>
          <div className="space-y-4">
            {/* Location Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.locationType}
                onChange={(e) => handleInputChange("locationType", e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {LOCATION_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Max Participants */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Participants
              </label>
              <input
                type="number"
                value={formData.maxParticipants || ""}
                onChange={(e) =>
                  handleInputChange("maxParticipants", parseInt(e.target.value) || 1)
                }
                min="1"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Equipment Included */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Equipment Included
              </label>
              <div className="flex flex-wrap gap-3">
                {EQUIPMENT_OPTIONS.map((equipment) => (
                  <label
                    key={equipment}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={(formData.equipmentIncluded || []).includes(equipment)}
                      onChange={() => handleEquipmentToggle(equipment)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{equipment}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Fitness Levels */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fitness Levels
              </label>
              <div className="flex flex-wrap gap-3">
                {FITNESS_LEVELS.map((level) => (
                  <label
                    key={level}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={(formData.fitnessLevels || []).includes(level)}
                      onChange={() => handleFitnessLevelToggle(level)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{level}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Availability & Policies */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Availability & Policies</h2>
          <div className="space-y-4">
            {/* Cancellation Policy */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cancellation Policy
              </label>
              <select
                value={formData.cancellationPolicy}
                onChange={(e) => handleInputChange("cancellationPolicy", e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {CANCELLATION_POLICIES.map((policy) => (
                  <option key={policy} value={policy}>
                    {policy}
                  </option>
                ))}
              </select>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <textarea
                value={formData.additionalNotes}
                onChange={(e) => handleInputChange("additionalNotes", e.target.value)}
                placeholder="Any additional information, requirements, or policies for clients..."
                rows={4}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Instant Booking */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.instantBookingEnabled}
                  onChange={(e) => handleInputChange("instantBookingEnabled", e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  Enable instant booking (clients can book without approval)
                </span>
              </label>
            </div>
          </div>
        </Card>
      </div>

      {/* Footer Buttons */}
      <div className="mt-8 flex items-center justify-between gap-4">
        <button
          onClick={handleSaveDraft}
          disabled={submitting}
          className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Saving..." : "Save as Draft"}
        </button>
        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            disabled={submitting}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handlePublish}
            disabled={submitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Publishing..." : "Publish Gig"}
          </button>
        </div>
      </div>
    </div>
  );
}


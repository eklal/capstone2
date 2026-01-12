import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTrainerProfile, updateTrainerProfile } from "@/api/trainers";
import { getTrainerAvailability, bulkUpdateAvailability } from "@/api/availability";
import type { TrainerProfileUpdate } from "@/api/trainers";
import type { AvailabilitySlot } from "@/api/availability";

interface TimeSlot {
  day: string;
  start_time: string;
  end_time: string;
  enabled: boolean;
}

const DAYS_OF_WEEK = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const DAY_LABELS: Record<string, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const trainerId = 1; // TODO: Get from auth context

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [experience, setExperience] = useState("0");
  const [hourlyRate, setHourlyRate] = useState("");
  const [professionalTitle, setProfessionalTitle] = useState("");
  const [bio, setBio] = useState("");
  
  // Specializations state
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([]);
  
  // Certifications state
  const [certifications, setCertifications] = useState<Array<{
    name: string;
    issuer: string;
    date: string;
  }>>([]);

  // Availability state
  const [availability, setAvailability] = useState<TimeSlot[]>(
    DAYS_OF_WEEK.map((day) => ({
      day,
      start_time: "06:00",
      end_time: "20:00",
      enabled: day !== "sunday",
    }))
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [profileData, availabilityData] = await Promise.all([
        getTrainerProfile(trainerId),
        getTrainerAvailability(trainerId),
      ]);

      // Set profile data
      const nameParts = profileData.user_name.split(" ");
      setFirstName(nameParts[0] || "");
      setLastName(nameParts.slice(1).join(" ") || "");
      setEmail(profileData.email);
      setPhone(profileData.phone);
      setCity(profileData.city || "");
      setState(profileData.state || "");
      setExperience(profileData.years_of_experience.toString());
      setHourlyRate(profileData.hourly_rate.toString());
      setProfessionalTitle(profileData.professional_title || "");
      setBio(profileData.bio || "");

      // Set specializations
      setSelectedSpecs(
        profileData.specialisations?.map((s) => s.name) || []
      );

      // Set availability from API
      if (availabilityData.length > 0) {
        const newAvailability = DAYS_OF_WEEK.map((day) => {
          const slot = availabilityData.find(
            (a) => a.day_of_week.toLowerCase() === day
          );
          if (slot) {
            return {
              day,
              start_time: slot.start_time.slice(0, 5),
              end_time: slot.end_time.slice(0, 5),
              enabled: slot.is_available,
            };
          }
          return {
            day,
            start_time: "06:00",
            end_time: "20:00",
            enabled: false,
          };
        });
        setAvailability(newAvailability);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSpecToggle = (spec: string) => {
    setSelectedSpecs((prev) =>
      prev.includes(spec)
        ? prev.filter((s) => s !== spec)
        : [...prev, spec]
    );
  };

  const handleAvailabilityToggle = (day: string) => {
    setAvailability((prev) =>
      prev.map((slot) =>
        slot.day === day ? { ...slot, enabled: !slot.enabled } : slot
      )
    );
  };

  const handleTimeChange = (
    day: string,
    field: "start_time" | "end_time",
    value: string
  ) => {
    setAvailability((prev) =>
      prev.map((slot) =>
        slot.day === day ? { ...slot, [field]: value } : slot
      )
    );
  };

  const addCertification = () => {
    setCertifications([
      ...certifications,
      { name: "", issuer: "", date: "" },
    ]);
  };

  const removeCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Update profile
      const profileUpdate: TrainerProfileUpdate = {
        phone,
        city,
        state,
        years_of_experience: parseInt(experience),
        hourly_rate: parseFloat(hourlyRate),
        professional_title: professionalTitle,
        bio,
      };

      await updateTrainerProfile(trainerId, profileUpdate);

      // Update availability
      const availabilitySlots: AvailabilitySlot[] = availability
        .filter((slot) => slot.enabled)
        .map((slot) => ({
          day_of_week: slot.day as any,
          start_time: slot.start_time,
          end_time: slot.end_time,
          is_available: true,
        }));

      await bulkUpdateAvailability(availabilitySlots);

      alert("Profile updated successfully!");
      navigate("/profile");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold">Edit Profile</h1>
              <p className="text-gray-600">
                Update your trainer profile information and showcase your expertise.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate("/profile")}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-black text-white rounded-md disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>

          {/* Profile Information */}
          <div className="border rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Profile Information</h2>

            {/* Profile Photo */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Photo
              </label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-3xl">
                  👤
                </div>
                <div>
                  <button className="px-4 py-2 border rounded-md text-sm mr-2">
                    📤 Upload New Photo
                  </button>
                  <button className="px-4 py-2 text-sm text-gray-600">
                    Remove Photo
                  </button>
                  <p className="text-xs text-gray-500 mt-2">
                    JPG, PNG or GIF. Max size 5MB.
                  </p>
                </div>
              </div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            {/* Email and Phone */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full px-3 py-2 border rounded-md bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            {/* City and State */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="New York"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Select state</option>
                  <option value="New York">New York</option>
                  <option value="California">California</option>
                  <option value="Texas">Texas</option>
                  {/* Add more states */}
                </select>
              </div>
            </div>

            {/* Experience and Rate */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Years of Experience
                </label>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="0">Less than 1 year</option>
                  <option value="1">1-2 years</option>
                  <option value="3">3-5 years</option>
                  <option value="5">5+ years</option>
                  <option value="10">10+ years</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hourly Rate ($)
                </label>
                <input
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="75"
                />
              </div>
            </div>

            {/* Professional Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Professional Title
              </label>
              <input
                type="text"
                value={professionalTitle}
                onChange={(e) => setProfessionalTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Certified Personal Trainer & Nutrition Coach"
              />
            </div>

            {/* Bio */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 border rounded-md h-24"
                placeholder="Tell clients about your experience and expertise..."
              />
            </div>

            {/* Specializations */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specializations
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  "Strength Training",
                  "Cardio Training",
                  "Rehabilitation",
                  "Weight Loss",
                  "Functional Movement",
                  "Group Fitness",
                  "Nutrition Coaching",
                  "Sports Performance",
                  "Yoga",
                ].map((spec) => (
                  <label key={spec} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedSpecs.includes(spec)}
                      onChange={() => handleSpecToggle(spec)}
                      className="rounded"
                    />
                    <span className="text-sm">{spec}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="border rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Certifications</h2>
              <button
                onClick={addCertification}
                className="text-sm text-blue-600"
              >
                + Add Certification
              </button>
            </div>

            {certifications.map((cert, index) => (
              <div key={index} className="flex gap-3 mb-3">
                <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                  🎓
                </div>
                <input
                  type="text"
                  placeholder="Certification Name"
                  value={cert.name}
                  onChange={(e) => {
                    const newCerts = [...certifications];
                    newCerts[index].name = e.target.value;
                    setCertifications(newCerts);
                  }}
                  className="flex-1 px-3 py-2 border rounded-md"
                />
                <input
                  type="text"
                  placeholder="Issuing Organization"
                  value={cert.issuer}
                  onChange={(e) => {
                    const newCerts = [...certifications];
                    newCerts[index].issuer = e.target.value;
                    setCertifications(newCerts);
                  }}
                  className="flex-1 px-3 py-2 border rounded-md"
                />
                <input
                  type="date"
                  value={cert.date}
                  onChange={(e) => {
                    const newCerts = [...certifications];
                    newCerts[index].date = e.target.value;
                    setCertifications(newCerts);
                  }}
                  className="px-3 py-2 border rounded-md"
                />
                <button
                  onClick={() => removeCertification(index)}
                  className="text-red-500"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

          {/* Availability Schedule */}
          <div className="border rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Availability Schedule</h2>

            {availability.map((slot) => (
              <div key={slot.day} className="flex items-center gap-3 mb-3">
                <div className="w-32">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={slot.enabled}
                      onChange={() => handleAvailabilityToggle(slot.day)}
                      className="rounded"
                    />
                    <span className="font-medium">{DAY_LABELS[slot.day]}</span>
                  </label>
                </div>

                {slot.enabled ? (
                  <>
                    <input
                      type="time"
                      value={slot.start_time}
                      onChange={(e) =>
                        handleTimeChange(slot.day, "start_time", e.target.value)
                      }
                      className="px-3 py-2 border rounded-md"
                    />
                    <span>to</span>
                    <input
                      type="time"
                      value={slot.end_time}
                      onChange={(e) =>
                        handleTimeChange(slot.day, "end_time", e.target.value)
                      }
                      className="px-3 py-2 border rounded-md"
                    />
                  </>
                ) : (
                  <span className="text-gray-400 text-sm">
                    Unavailable — click "+ Add Slot" to add time.
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-2">
            <button
              onClick={() => navigate("/profile")}
              className="px-4 py-2 border rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-black text-white rounded-md disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;

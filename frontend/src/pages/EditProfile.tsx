import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTrainerProfile, updateTrainerProfileWithFiles, getSpecialisations } from "@/api/trainers";
import { getTrainerAvailability, bulkUpdateAvailability } from "@/api/availability";
import type { TrainerProfileUpdate, TrainerProfile } from "@/api/trainers";
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
  const { id } = useParams<{ id: string }>();
  const [trainerId, setTrainerId] = useState<number | null>(null);
  const [profileData, setProfileData] = useState<TrainerProfile | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [experience, setExperience] = useState("0");
  const [hourlyRate, setHourlyRate] = useState("");
  const [professionalTitle, setProfessionalTitle] = useState("");
  const [bio, setBio] = useState("");
  
  // Specializations state
  const [selectedSpecs, setSelectedSpecs] = useState<number[]>([]);
  const [availableSpecs, setAvailableSpecs] = useState<Array<{id: number; name: string}>>([]);
  
  // File upload state
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [profilePicPreview, setProfilePicPreview] = useState<string>("");
  const [certificateFiles, setCertificateFiles] = useState<File[]>([]);
  
  // Certifications state (for display/existing)

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      if (!id) {
        alert("Trainer ID not found in URL");
        navigate("/");
        return;
      }
      
      const trainerIdNum = parseInt(id);
      console.log("🔄 Loading trainer profile for ID:", trainerIdNum);
      
      // Get trainer's profile using their ID from URL
      const data = await getTrainerProfile(trainerIdNum);
      console.log("✅ Profile loaded:", data);
      
      setTrainerId(data.id);
      setProfileData(data);
      
      // Fetch available specializations from API
      const specsData = await getSpecialisations();
      setAvailableSpecs(specsData);
      
      // Get availability
      const availabilityData = await getTrainerAvailability(data.id);

      // Set profile data
      setUsername(data.user_name || "");
      setEmail(data.email);
      setPhone(data.phone || "");
      setCity(data.city || "");
      setState(data.state || "");
      setExperience(data.years_of_experience?.toString() || "0");
      setHourlyRate(data.hourly_rate?.toString() || "");
      setProfessionalTitle(data.professional_title || "");
      setBio(data.bio || "");

      // Set specializations (use IDs)
      setSelectedSpecs(
        data.specialisations?.map((s) => s.id) || []
      );

      // Set profile picture preview if exists
      if (data.profile_pic?.file) {
        setProfilePicPreview(data.profile_pic.file);
      }

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

  const handleSpecToggle = (specId: number) => {
    setSelectedSpecs((prev) =>
      prev.includes(specId)
        ? prev.filter((id) => id !== specId)
        : [...prev, specId]
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


  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCertificateFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setCertificateFiles(prev => [...prev, ...files]);
  };

  const removeCertificateFile = (index: number) => {
    setCertificateFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!trainerId) {
      alert("Trainer ID not found");
      return;
    }

    try {
      setSaving(true);

      // Update profile with files
      const profileUpdate: TrainerProfileUpdate = {
        phone,
        city,
        state,
        years_of_experience: parseInt(experience),
        hourly_rate: parseFloat(hourlyRate),
        professional_title: professionalTitle,
        bio,
        specialisations: selectedSpecs, // ✅ Add specializations (already numbers)
      };

      await updateTrainerProfileWithFiles(
        trainerId,
        profileUpdate,
        profilePicFile,
        certificateFiles
      );

      // Update availability
      const availabilitySlots: AvailabilitySlot[] = availability
        .filter((slot) => slot.enabled)
        .map((slot) => ({
          day_of_week: slot.day as AvailabilitySlot["day_of_week"],
          start_time: slot.start_time,
          end_time: slot.end_time,
          is_available: true,
        }));

      await bulkUpdateAvailability(availabilitySlots);

      alert("Profile updated successfully!");
      navigate(`/trainer-profile/${id}`);
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Profile</h1>
            <p className="text-lg text-gray-600">
              Update your trainer profile information and showcase your expertise
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/trainer-profile/${id}`)}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 bg-[var(--primary)] text-white rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">

          {/* Profile Information */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-100">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-xl">👤</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
            </div>

            {/* Profile Photo */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-800 mb-3">
                Profile Photo
              </label>
              <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-xl border-2 border-gray-200">
                <div className="w-24 h-24 rounded-2xl bg-gray-200 flex items-center justify-center text-4xl overflow-hidden shadow-lg border-4 border-white">
                  {profilePicPreview ? (
                    <img
                      src={profilePicPreview}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>👤</span>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    id="profile-pic-upload"
                    accept="image/*"
                    onChange={handleProfilePicChange}
                    className="hidden"
                  />
                  <div className="flex gap-2 mb-2">
                    <label
                      htmlFor="profile-pic-upload"
                      className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold cursor-pointer hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                    >
                      📤 Upload Photo
                    </label>
                    {profilePicPreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setProfilePicFile(null);
                          setProfilePicPreview("");
                        }}
                        className="px-5 py-2.5 border-2 border-red-200 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    JPG, PNG or GIF. Max size 5MB. Recommended: 400x400px
                  </p>
                </div>
              </div>
            </div>

            {/* Username */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
                placeholder="Enter your username"
              />
              <p className="text-xs text-gray-500 mt-2">
                Your display name visible to clients
              </p>
            </div>

            {/* Email and Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            {/* City and State */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
                  placeholder="New York"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  State/Territory
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
                >
                  <option value="">Select state/territory</option>
                  <option value="NSW">New South Wales (NSW)</option>
                  <option value="VIC">Victoria (VIC)</option>
                  <option value="QLD">Queensland (QLD)</option>
                  <option value="SA">South Australia (SA)</option>
                  <option value="WA">Western Australia (WA)</option>
                  <option value="TAS">Tasmania (TAS)</option>
                  <option value="NT">Northern Territory (NT)</option>
                  <option value="ACT">Australian Capital Territory (ACT)</option>
                </select>
              </div>
            </div>

            {/* Experience and Rate */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Years of Experience
                </label>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
                >
                  <option value="0">Less than 1 year</option>
                  <option value="1">1-2 years</option>
                  <option value="3">3-5 years</option>
                  <option value="5">5+ years</option>
                  <option value="10">10+ years</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Hourly Rate ($)
                </label>
                <input
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
                  placeholder="75"
                />
              </div>
            </div>

            {/* Professional Title */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Professional Title
              </label>
              <input
                type="text"
                value={professionalTitle}
                onChange={(e) => setProfessionalTitle(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
                placeholder="Certified Personal Trainer & Nutrition Coach"
              />
            </div>

            {/* Bio */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all resize-none"
                rows={5}
                placeholder="Tell clients about your experience and expertise..."
              />
            </div>

            {/* Specializations */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-800 mb-3">
                Specializations
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {availableSpecs.map((spec) => (
                  <label
                    key={spec.id}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedSpecs.includes(spec.id)
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300 bg-white"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedSpecs.includes(spec.id)}
                      onChange={() => handleSpecToggle(spec.id)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-900">
                      {spec.name}
                    </span>
                  </label>
                ))}
              </div>
              {availableSpecs.length === 0 && (
                <p className="text-sm text-gray-500 italic">
                  Loading specializations...
                </p>
              )}
            </div>
          </div>

          {/* Certificate Files Upload */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-100">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-xl">🎓</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Certifications</h2>
            </div>
            <div className="mb-4 p-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
              <input
                type="file"
                accept="image/*,application/pdf"
                multiple
                onChange={handleCertificateFilesChange}
                className="block w-full text-sm text-gray-700
                  file:mr-4 file:py-3 file:px-6
                  file:rounded-lg file:border-0
                  file:text-sm file:font-bold
                  file:bg-green-600 file:text-white
                  hover:file:bg-green-700 file:cursor-pointer file:transition-colors"
              />
              <p className="text-xs text-gray-500 mt-3">
                Upload certification documents (PDF, JPG, PNG) - Multiple files allowed
              </p>
            </div>
            {certificateFiles.length > 0 && (
              <div className="space-y-3 mb-6">
                <p className="text-sm font-bold text-gray-800 mb-3">
                  Selected Files ({certificateFiles.length}):
                </p>
                {certificateFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-green-50 rounded-xl border-2 border-green-200"
                  >
                    <span className="text-sm text-gray-900 font-medium">
                      📄 {file.name} ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                    <button
                      type="button"
                      onClick={() => removeCertificateFile(index)}
                      className="px-4 py-2 text-sm text-red-600 font-bold hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Existing Certifications from Backend */}
            {profileData?.certifications && profileData.certifications.length > 0 && (
              <div className="mt-6 pt-6 border-t-2 border-gray-100">
                <p className="text-sm font-bold text-gray-800 mb-3">
                  Existing Certifications ({profileData.certifications.length}):
                </p>
                <div className="space-y-3">
                  {profileData.certifications.map((cert, index) => (
                    <div
                      key={cert.id || index}
                      className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border-2 border-blue-200"
                    >
                      <a
                        href={cert.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-700 hover:text-blue-900 font-semibold flex items-center gap-2"
                      >
                        📄 {cert.file.split("/").pop()}
                        <span className="text-xs text-gray-500 font-normal">
                          (Uploaded: {new Date(cert.uploaded_at).toLocaleDateString()})
                        </span>
                      </a>
                      <span className="text-xs text-green-600 font-bold bg-green-100 px-3 py-1 rounded-full">
                        ✓ Uploaded
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Availability Schedule */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-100">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-xl">📅</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Availability Schedule</h2>
            </div>

            <div className="space-y-3">
              {availability.map((slot) => (
                <div
                  key={slot.day}
                  className={`flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    slot.enabled
                      ? "border-green-300 bg-green-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="w-full md:w-40">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={slot.enabled}
                        onChange={() => handleAvailabilityToggle(slot.day)}
                        className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                      />
                      <span className="font-bold text-gray-900">
                        {DAY_LABELS[slot.day]}
                      </span>
                    </label>
                  </div>

                  {slot.enabled ? (
                    <div className="flex flex-1 items-center gap-3">
                      <input
                        type="time"
                        value={slot.start_time}
                        onChange={(e) =>
                          handleTimeChange(slot.day, "start_time", e.target.value)
                        }
                        className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <span className="text-gray-600 font-medium">to</span>
                      <input
                        type="time"
                        value={slot.end_time}
                        onChange={(e) =>
                          handleTimeChange(slot.day, "end_time", e.target.value)
                        }
                        className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  ) : (
                    <span className="text-gray-500 text-sm italic">
                      Check the box to set availability for this day
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-6 border-t-2 border-gray-100">
            <button
              onClick={() => navigate(`/trainer-profile/${id}`)}
              className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-3 bg-[var(--primary)] text-white rounded-xl font-bold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Saving...
                </span>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;

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
                onClick={() => navigate(`/trainer-profile/${id}`)}
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
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-3xl overflow-hidden">
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
                <div>
                  <input
                    type="file"
                    id="profile-pic-upload"
                    accept="image/*"
                    onChange={handleProfilePicChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="profile-pic-upload"
                    className="px-4 py-2 border rounded-md text-sm mr-2 cursor-pointer inline-block hover:bg-gray-50"
                  >
                    📤 Upload New Photo
                  </label>
                  {profilePicPreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setProfilePicFile(null);
                        setProfilePicPreview("");
                      }}
                      className="px-4 py-2 text-sm text-gray-600 hover:text-red-600"
                    >
                      Remove Photo
                    </button>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    JPG, PNG or GIF. Max size 5MB.
                  </p>
                </div>
              </div>
            </div>

            {/* Username */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter your username"
              />
              <p className="text-xs text-gray-500 mt-1">
                Your display name visible to clients
              </p>
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
                  State/Territory
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                {availableSpecs.map((spec) => (
                  <label key={spec.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedSpecs.includes(spec.id)}
                      onChange={() => handleSpecToggle(spec.id)}
                      className="rounded"
                    />
                    <span className="text-sm">{spec.name}</span>
                  </label>
                ))}
              </div>
              {availableSpecs.length === 0 && (
                <p className="text-sm text-gray-500 italic">Loading specializations...</p>
              )}
            </div>
          </div>

          {/* Certificate Files Upload */}
          <div className="border rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Upload Certification Files</h2>
            </div>
            <div className="mb-4">
              <input
                type="file"
                accept="image/*,application/pdf"
                multiple
                onChange={handleCertificateFilesChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-green-50 file:text-green-700
                  hover:file:bg-green-100"
              />
              <p className="text-xs text-gray-500 mt-1">
                Upload certification documents (PDF, JPG, PNG - multiple files allowed)
              </p>
            </div>
            {certificateFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Selected Files ({certificateFiles.length}):
                </p>
                {certificateFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded"
                  >
                    <span className="text-sm text-gray-700">
                      📄 {file.name} ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                    <button
                      type="button"
                      onClick={() => removeCertificateFile(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Existing Certifications from Backend */}
            {profileData?.certifications && profileData.certifications.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Existing Certifications ({profileData.certifications.length}):
                </p>
                <div className="space-y-2">
                  {profileData.certifications.map((cert, index) => (
                    <div
                      key={cert.id || index}
                      className="flex items-center justify-between bg-blue-50 p-2 rounded"
                    >
                      <a
                        href={cert.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-700 hover:underline flex items-center gap-2"
                      >
                        📄 {cert.file.split('/').pop()}
                        <span className="text-xs text-gray-500">
                          (Uploaded: {new Date(cert.uploaded_at).toLocaleDateString()})
                        </span>
                      </a>
                      <span className="text-xs text-green-600">✓ Uploaded</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Certifications */}
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
              onClick={() => navigate(`/trainer-profile/${id}`)}
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

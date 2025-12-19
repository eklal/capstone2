import React, { useEffect } from "react";
import Card from "../ui/Card";
import { TextField } from "../ui/TextField";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import type { TrainerProfileDetail } from "../../features/trainerProfile/trainerProfileSlice";

const ProfileForm: React.FC<{
  profile: TrainerProfileDetail | null;
  onSave?: (payload: Partial<TrainerProfileDetail>) => void;
}> = ({ profile, onSave }) => {
  const [form, setForm] = React.useState({
    fullName: "",
    email: "",
    phone: "",
    experience: "",
    bio: "",
    specialties: [] as string[],
  });

  const [isEditing, setIsEditing] = React.useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        fullName: profile.fullName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        experience: profile.experience || "",
        bio: profile.bio || "",
        specialties: profile.specialties || [],
      });
    }
  }, [profile]);

  const handleSave = () => {
    if (onSave) {
      onSave({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        experience: form.experience,
        bio: form.bio,
        specialties: form.specialties,
      });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (profile) {
      setForm({
        fullName: profile.fullName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        experience: profile.experience || "",
        bio: profile.bio || "",
        specialties: profile.specialties || [],
      });
    }
    setIsEditing(false);
  };

  if (!profile) {
    return (
      <Card>
        <div className="text-center text-gray-500 py-8">Loading profile...</div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Profile Information</h3>
        {!isEditing ? (
          <Button variant="secondary" onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <TextField
            label="Full Name"
            value={form.fullName}
            onChange={(v) => setForm({ ...form, fullName: v })}
            disabled={!isEditing}
          />
        </div>
        <div>
          <TextField
            label="Email"
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
            disabled={!isEditing}
          />
        </div>

        <div>
          <TextField
            label="Phone"
            value={form.phone}
            onChange={(v) => setForm({ ...form, phone: v })}
            disabled={!isEditing}
          />
        </div>
        <div>
          <TextField
            label="Experience"
            value={form.experience}
            onChange={(v) => setForm({ ...form, experience: v })}
            disabled={!isEditing}
          />
        </div>

        <div className="md:col-span-2">
          <TextField
            textarea
            label="Bio"
            value={form.bio}
            onChange={(v) => setForm({ ...form, bio: v })}
            disabled={!isEditing}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm text-gray-600 mb-2">Specializations</label>
          <div className="flex flex-wrap gap-2">
            {form.specialties.map((s: string) => (
              <Badge key={s}>{s}</Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProfileForm;

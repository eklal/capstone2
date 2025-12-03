import React from "react";
import Card from "../ui/Card";
import { TextField } from "../ui/TextField";
import Badge from "../ui/Badge";

const ProfileForm: React.FC<{
  initial?: any;
  onSave?: (payload:any)=>void;
}> = ({ initial = {}, onSave }) => {
  const [form, setForm] = React.useState({
    fullName: initial.fullName || "Alex Thompson",
    email: initial.email || "alex.thompson@email.com",
    phone: initial.phone || "+1 (555) 123-4567",
    experience: initial.experience || "5+ years",
    bio: initial.bio || "Passionate fitness trainer...",
    specialties: initial.specialties || ["Strength Training", "Weight Loss", "Nutrition Coaching"],
  });

  return (
    <Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <TextField label="Full Name" value={form.fullName} onChange={(v)=>setForm({...form, fullName:v})} />
        </div>
        <div>
          <TextField label="Email" value={form.email} onChange={(v)=>setForm({...form, email:v})} />
        </div>

        <div>
          <TextField label="Phone" value={form.phone} onChange={(v)=>setForm({...form, phone:v})} />
        </div>
        <div>
          <TextField label="Experience" value={form.experience} onChange={(v)=>setForm({...form, experience:v})} />
        </div>

        <div className="md:col-span-2">
          <TextField textarea label="Bio" value={form.bio} onChange={(v)=>setForm({...form, bio:v})} />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm text-gray-600 mb-2">Specializations</label>
          <div className="flex flex-wrap gap-2">
            {form.specialties.map((s:string) => <Badge key={s}>{s}</Badge>)}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProfileForm;

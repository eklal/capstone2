import React from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";

const ProfileHeader: React.FC<{
  name: string;
  title: string;
  location: string;
  joined: string;
}> = ({ name, title, location, joined }) => {
  return (
    <Card className="mb-6">
      <div className="flex items-start gap-6">
        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl">👤</div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-semibold">{name}</h2>
              <p className="text-sm text-gray-600">{title}</p>
              <div className="mt-2 text-sm text-gray-500 flex gap-4">
                <span>📍 {location}</span>
                <span>📅 Joined {joined}</span>
              </div>
            </div>

            <div>
              <Button variant="secondary">Edit Profile</Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProfileHeader;

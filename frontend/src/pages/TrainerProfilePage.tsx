import React from "react";
import Topbar from "../components/layout/TrainerNavbar";
import PageContainer from "../components/layout/TrainerPageContainer";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileForm from "../components/profile/ProfileForm";
import ProfileStats from "../components/profile/ProfileStats";
import Certifications from "../components/profile/Certifications";
import AvailabilityCard from "../components/profile/AvailabilityCard";
import ReviewsList from "../components/profile/ReviewsList";

const TrainerProfilePage: React.FC = () => {
  const certs = [
    { title: "NASM-CPT", expires: "Dec 2025" },
    { title: "Nutrition Coach", expires: "Mar 2026" },
    { title: "FMS Level 2", expires: "Aug 2025" },
  ];

  const schedule = {
    monday: "6:00 AM - 8:00 PM",
    tuesday: "6:00 AM - 8:00 PM",
    wednesday: "6:00 AM - 8:00 PM",
    thursday: "6:00 AM - 8:00 PM",
    friday: "6:00 AM - 6:00 PM",
    saturday: "8:00 AM - 4:00 PM",
    sunday: "Unavailable"
  };

  const reviews = [
    { author: "Sarah Johnson", rating: 5, time: "2 days ago", content: "Great trainer!" },
    { author: "Mike Chen", rating: 4, time: "1 week ago", content: "Very knowledgeable." },
  ];

  return (
    <>
      <Topbar />
      <PageContainer>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ProfileHeader name="Alex Thompson" title="Certified Personal Trainer & Nutrition Coach" location="New York, NY" joined="Jan 2023" />
            <ProfileForm />
            <div className="mt-6 bg-white border rounded-lg p-6">
              <ReviewsList reviews={reviews} />
            </div>
          </div>

          <div className="space-y-6">
            <ProfileStats views={1247} rating={4.9} reviews={87} responseRate="98%" />
            <Certifications items={certs} />
            <AvailabilityCard schedule={schedule} />
          </div>
        </div>
      </PageContainer>
    </>
  );
};

export default TrainerProfilePage;

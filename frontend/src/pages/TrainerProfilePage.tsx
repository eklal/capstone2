import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../app/store";
import { setLoading, setProfile, updateProfile, setError, type TrainerProfileDetail } from "../features/trainerProfile/trainerProfileSlice";
import { getTrainerProfileDetail } from "../api/trainers";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileForm from "../components/profile/ProfileForm";
import ProfileStats from "../components/profile/ProfileStats";
import Certifications from "../components/profile/Certifications";
import AvailabilityCard from "../components/profile/AvailabilityCard";
import ReviewsList from "../components/profile/ReviewsList";

const TrainerProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { profile, loading, error } = useSelector((state: RootState) => state.trainerProfile);
  const trainerId = 101; // For now, using hardcoded ID. In future, get from auth/user context

  useEffect(() => {
    const fetchProfile = async () => {
      dispatch(setLoading(true));
      try {
        const profileData = await getTrainerProfileDetail(trainerId);
        dispatch(setProfile(profileData));
      } catch (err) {
        dispatch(setError(err instanceof Error ? err.message : "Failed to fetch profile"));
      }
    };

    if (!profile || profile.id !== trainerId) {
      fetchProfile();
    }
  }, [dispatch, trainerId, profile]);

  const handleSaveProfile = (updatedData: Partial<TrainerProfileDetail>) => {
    dispatch(updateProfile(updatedData));
    // In a real app, you would also call an API to save the changes
    // await updateTrainerProfile(trainerId, updatedData);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">No profile data available</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <ProfileHeader
          name={profile.fullName}
          title={profile.title}
          location={profile.location}
          joined={profile.joined}
        />
        <ProfileForm profile={profile} onSave={handleSaveProfile} />
        <div className="mt-6 bg-white border rounded-lg p-6">
          <ReviewsList reviews={profile.reviews} />
        </div>
      </div>

      <div className="space-y-6">
        <ProfileStats
          views={profile.profileStats.views}
          rating={profile.profileStats.rating}
          reviews={profile.profileStats.reviews}
          responseRate={profile.profileStats.responseRate}
        />
        <Certifications items={profile.certifications} />
        <AvailabilityCard
          schedule={profile.availability}
          onUpdateSchedule={(availability) =>
            handleSaveProfile({ availability })
          }
        />
      </div>
    </div>
  );
};

export default TrainerProfilePage;

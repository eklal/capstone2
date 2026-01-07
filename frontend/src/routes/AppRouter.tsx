import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import { Dashboard } from "@/pages/Dashboard";
import Sample from "@/pages/Sample";
import RegisterTrainer from "@/pages/RegisterTrainer";
import TrainersListPage from "@/pages/TrainersListPage";
import TrainerProfilePage from "@/pages/TrainerProfilePage";
import TrainerDashboard from "@/pages/TrainerDashboard";
import MyGigs from "@/pages/MyGigs";
import GigPreviewPage from "@/pages/GigPreviewPage";
import CreateEditGig from "@/pages/CreateEditGig";

import TrainerPageContainer from "@/components/layout/TrainerPageContainer"; 

interface AppRoute {
  path: string;
  element: React.ReactElement;
}

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* Public Routes */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register/trainer" element={<RegisterTrainer />} />
        <Route path="/how-it-works" element={<Sample />} />
        <Route path="/become-trainer" element={<Sample />} />
        <Route path="/trainer/:id" element={<Sample />} />
        <Route path="/find-trainers" element={<TrainersListPage />} />

        {/* Trainer Dashboard Area (with Sidebar) */}
        <Route element={<TrainerPageContainer />}>
          <Route path="/trainer-dashboard" element={<TrainerDashboard />} />
          <Route path="/trainer-profile" element={<TrainerProfilePage />} />
          <Route path="/trainer/gigs" element={<MyGigs />} />
          <Route path="/trainer/gigs/new" element={<CreateEditGig />} />
          <Route path="/trainer/gigs/:gigId/edit" element={<CreateEditGig />} />
          <Route path="/trainer/gigs/:gigId" element={<GigPreviewPage />} />
          <Route path="/trainer-bookings" element={<Sample />} />
          <Route path="/trainer-income" element={<Sample />} />
          <Route path="/trainer-settings" element={<Sample />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;

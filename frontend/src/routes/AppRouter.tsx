import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import { Dashboard } from "@/pages/Dashboard";
import Sample from "@/pages/Sample";
import RegisterTrainer from "@/pages/RegisterTrainer";
import TrainersListPage from "@/pages/TrainersListPage";
import TrainerDashboard from "@/pages/TrainerDashboard";
import ClientDashboard from "@/pages/ClientDashboard";
import MyGigs from "@/pages/MyGigs";
import GigPreviewPage from "@/pages/GigPreviewPage";
import CreateEditGig from "@/pages/CreateEditGig";
import TrainerProfile from "@/pages/TrainerProfile";
import EditProfile from "@/pages/EditProfile";
import TrainerDetailPage from "@/pages/TrainerDetailPage";
import PaymentPage from "@/pages/PaymentPage";
import TrainerBookings from "@/pages/TrainerBookings";
import MyBookings from "@/pages/MyBookings";

import TrainerPageContainer from "@/components/layout/TrainerPageContainer";
import PublicRoute from "@/components/routes/PublicRoute";
import ProtectedRoute from "@/components/routes/ProtectedRoute";

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* Public Routes - Accessible to everyone */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/how-it-works" element={<Sample />} />
        <Route path="/become-trainer" element={<Sample />} />
        <Route path="/trainer/:id" element={<TrainerDetailPage />} />
        <Route path="/find-trainers" element={<TrainersListPage />} />

        {/* Auth Routes - Redirect to home if already logged in */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        <Route 
          path="/register/trainer" 
          element={
            <PublicRoute>
              <RegisterTrainer />
            </PublicRoute>
          } 
        />

        {/* Protected Client Routes - Require authentication and client role */}
        <Route 
          path="/client-dashboard" 
          element={
            <ProtectedRoute requiredRole="client">
              <ClientDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/my-bookings" 
          element={
            <ProtectedRoute requiredRole="client">
              <MyBookings />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/payment" 
          element={
            <ProtectedRoute requiredRole="client">
              <PaymentPage />
            </ProtectedRoute>
          } 
        />

        {/* Protected Trainer Routes - Require authentication and trainer role */}
        <Route 
          element={
            <ProtectedRoute requiredRole="trainer">
              <TrainerPageContainer />
            </ProtectedRoute>
          }
        >
          <Route path="/trainer-dashboard/:id" element={<TrainerDashboard />} />
          <Route path="/trainer-profile/:id" element={<TrainerProfile />} />
          <Route path="/trainer-profile/:id/edit" element={<EditProfile />} />
          <Route path="/trainer/gigs" element={<MyGigs />} />
          <Route path="/trainer/gigs/new" element={<CreateEditGig />} />
          <Route path="/trainer/gigs/:gigId/edit" element={<CreateEditGig />} />
          <Route path="/trainer/gigs/:gigId" element={<GigPreviewPage />} />
          <Route path="/trainer-bookings" element={<TrainerBookings />} />
          <Route path="/trainer-income" element={<Sample />} />
          <Route path="/trainer-settings" element={<Sample />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;

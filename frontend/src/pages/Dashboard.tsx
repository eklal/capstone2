import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Banner from '@/components/Banner';
import SearchTrainer from '@/components/SearchTrainer';
import FeaturedTrainers from '@/components/FeaturedTrainers';
import HowItWorks from '@/components/HowItWorks';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
// import Sample from '@/pages/Sample';
// import Login from '@/pages/Login';
// import TrainerProfile from '@/pages/TrainerProfile';

export const Dashboard: React.FC = () => (
  <div>
          <Navbar />

    <Banner />
    <SearchTrainer />
    <FeaturedTrainers />
    <HowItWorks />
    <CTASection />
    <Footer/>
  </div>
);


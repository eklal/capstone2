import React from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiStar, FiArrowRight } from 'react-icons/fi';
import { FaDumbbell, FaUsers } from 'react-icons/fa';

const Banner: React.FC = () => {
  return (
    <div className="relative w-full h-[600px] md:h-[700px] overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg"
          alt="Fitness training"
          className="w-full h-full object-cover scale-105 animate-subtle-zoom"
        />
      </div>

      {/* Gradient Overlay - Multiple layers for depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-[var(--primary)]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-[var(--primary)]/10 rounded-full blur-3xl"></div>

      {/* Content Container */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-center h-full py-20">
          <div className="max-w-3xl">

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 animate-slide-up">
              <span className="text-white">Find Your</span>
              <br />
              <span className="text-[var(--primary)] drop-shadow-lg">Perfect Trainer</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl leading-relaxed animate-slide-up-delay">
              Connect with certified fitness professionals, book personalized sessions, 
              and transform your fitness journey with expert guidance.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-slide-up-delay-2">
              <Link to="/find-trainers">
                <button className="group px-8 py-4 bg-[var(--primary)] text-white rounded-xl font-bold text-lg hover:bg-red-700 transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-2">
                  <FiSearch className="group-hover:rotate-12 transition-transform" />
                  <span>Find Trainers</span>
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>

            {/* Stats/Features */}
            <div className="flex flex-wrap gap-8 animate-fade-in-delay">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                  <FaUsers className="text-[var(--primary)] text-xl" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">500+</div>
                  <div className="text-sm text-gray-300">Expert Trainers</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                  <FiStar className="text-yellow-400 text-xl" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">4.9/5</div>
                  <div className="text-sm text-gray-300">Average Rating</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                  <FaDumbbell className="text-[var(--primary)] text-xl" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">50k+</div>
                  <div className="text-sm text-gray-300">Sessions Booked</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
    </div>
  );
};

export default Banner;
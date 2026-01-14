import React from 'react';
import { FiSearch, FiCalendar, FiTarget, FiArrowRight } from 'react-icons/fi';

const HowItWorks: React.FC = () => {
  const steps = [
    { 
      icon: FiSearch, 
      title: 'Browse Trainers', 
      text: 'Search and filter through hundreds of certified trainers based on expertise, location, and availability.',
      step: '01'
    },
    { 
      icon: FiCalendar, 
      title: 'Book Sessions', 
      text: 'Schedule training sessions at your convenience with our easy-to-use booking calendar.',
      step: '02'
    },
    { 
      icon: FiTarget, 
      title: 'Achieve Goals', 
      text: 'Work with your dedicated trainer to reach your fitness goals with personalized programs.',
      step: '03'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-[var(--primary)] rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-10 w-64 h-64 bg-[var(--primary)] rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            How It <span className="text-[var(--primary)]">Works</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Get started with your fitness journey in three simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="relative">
                {/* Connector Arrow - Hidden on mobile, shown between cards on desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-24 -right-6 lg:-right-10 z-10">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-red-100 flex items-center justify-center">
                      <FiArrowRight className="text-[var(--primary)] text-xl lg:text-2xl" />
                    </div>
                  </div>
                )}

                {/* Card */}
                <div className="group relative bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100 hover:border-[var(--primary)] hover:shadow-2xl transition-all duration-300 h-full">
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-[var(--primary)] text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg ring-4 ring-white">
                    {step.step}
                  </div>

                  {/* Icon */}
                  <div className="mb-6 flex justify-center">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                      <Icon className="text-[var(--primary)] text-3xl" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-center leading-relaxed">
                    {step.text}
                  </p>

                  {/* Hover indicator */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--primary)] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-xl"></div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
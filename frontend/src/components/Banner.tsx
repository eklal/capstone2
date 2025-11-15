import React from 'react';
import { Link } from 'react-router-dom';

const Banner: React.FC = () => {
  return (
    // <section
    //   className="relative w-full h-[480px] bg-cover bg-center flex items-center px-8 md:px-20"
    //   style={{
    //     backgroundImage:
    //       "url('https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg')",
    //   }}
    // >
    //   <div className="text-white max-w-xl">
    //     <h1 className="text-4xl md:text-5xl font-bold leading-tight text-[var(--primary)]">Find Your Perfect <br /> Personal Trainer</h1>
    //     <p className="mt-4 text-gray-200 max-w-lg">Connect with certified fitness professionals, book sessions, and achieve your fitness goals with personalised training program</p>

    //     <Link to="/find-trainers" className="inline-block mt-6 bg-[var(--primary)] px-6 py-3 rounded text-white">Find Trainers</Link>
    //   </div>
    // </section>
    <div className="relative w-full h-[500px] md:h-[650px]">
  {/* Background Image */}
  <img
    src="https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg"
    alt="banner"
    className="w-full h-full object-cover"
  />

  {/* Black Overlay */}
  <div className="absolute inset-0 bg-black/60"></div>

  {/* Content */}
  <div className="absolute inset-0 flex flex-col items-start justify-center px-6 md:px-16 text-white">
    <h1 className="text-4xl md:text-5xl font-bold leading-tight text-[var(--primary)]">
      Find Your Perfect <br /> Personal Trainer
    </h1>

    <p className="mt-3 max-w-xl text-gray-200">
      Connect with certified experts to achieve your fitness goals.
    </p>

    <button className="mt-6 bg-[var(--primary)] text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition">
      Find Trainer
    </button>
  </div>
</div>

  );
};

export default Banner;
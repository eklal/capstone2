import React, { useEffect, useState, useRef } from 'react';
import { getFeaturedTrainers } from '@/api/trainers';
import type { TrainerProfile } from '@/api/trainers';
import TrainerCard from './TrainerCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './FeaturedTrainers.css';

const FeaturedTrainers: React.FC = () => {
  const [trainers, setTrainers] = useState<TrainerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    const loadFeaturedTrainers = async () => {
      try {
        setLoading(true);
        const data = await getFeaturedTrainers();
        setTrainers(data);
      } catch (err) {
        console.error('Error loading featured trainers:', err);
        setError('Failed to load featured trainers');
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedTrainers();
  }, []);

  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[var(--primary)] mb-2">Featured Trainers</h2>
          <p className="text-gray-600 text-lg">Top-rated fitness professionals ready to help you achieve your goals</p>
        </div>

        {loading ? (
          <div className="flex justify-center gap-8">
            {[1, 2, 3].map((i) => (
              <div 
                key={i} 
                className="bg-white shadow rounded-xl w-80 h-96 animate-pulse"
              >
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-300"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="mt-4 h-40 bg-gray-300 rounded-lg"></div>
                  <div className="mt-3 space-y-2">
                    <div className="h-3 bg-gray-300 rounded"></div>
                    <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="mt-10 text-center text-red-500">
            {error}
          </div>
        ) : trainers.length > 0 ? (
          <div className="relative">
            {/* Custom Navigation Buttons */}
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 z-10"
              aria-label="Previous slide"
            >
              <FaChevronLeft className="custom-arrow-icon" />
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 z-10"
              aria-label="Next slide"
            >
              <FaChevronRight className="custom-arrow-icon" />
            </button>

            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              spaceBetween={30}
              slidesPerView={1}
              pagination={{ 
                clickable: true,
                dynamicBullets: true,
              }}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              loop={trainers.length > 3}
              breakpoints={{
                640: {
                  slidesPerView: 1,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 25,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 30,
                },
              }}
              className="featured-trainers-swiper pb-12"
            >
              {trainers.map((trainer) => (
                <SwiperSlide key={trainer.id}>
                  <div className="px-2">
                    <TrainerCard trainer={trainer} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <div className="mt-10 text-center text-gray-500">
            No featured trainers available at the moment.
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedTrainers;

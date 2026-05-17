"use client";

import Image from "next/image";
import React, { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { motion } from "framer-motion";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";

import "swiper/css";
import "swiper/css/navigation";

import { getPublishedTestimonials } from "@/app/actions/testimonials";

interface Testimonial {
  id:        string;
  name:      string;
  role:      string;
  image:     string | null;
  message:   string;
  order:     number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Skeleton card shown while loading ───────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 flex flex-col items-center border border-gray-200 animate-pulse">
    <div className="rounded-full h-20 w-20 bg-gray-200 mb-4" />
    <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
    <div className="h-3 w-24 bg-gray-100 rounded mb-4" />
    <div className="h-3 w-full bg-gray-100 rounded mb-2" />
    <div className="h-3 w-5/6 bg-gray-100 rounded mb-2" />
    <div className="h-3 w-4/6 bg-gray-100 rounded" />
  </div>
);

const Testimonials: React.FC = () => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    getPublishedTestimonials()
      .then((data) => setTestimonials(data as Testimonial[]))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div id="testimonials" className="w-full py-2 lg:py-4">
      <div className="w-full max-w-7xl px-4 lg:px-10 mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-5xl md:text-6xl font-black text-[#1a2744] mb-4"
        >
          Testimonials
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-gray-600 max-w-xl mx-auto text-lg lg:text-sm mb-14"
        >
          Hear directly from our clients who trusted Back Byte to deliver.
          Real projects, real results — shared to inspire confidence.
        </motion.p>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 lg:px-10">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : testimonials.length === 0 ? (
          <p className="text-center text-gray-400 py-10">No testimonials yet.</p>
        ) : (
          <>
            <Swiper
              navigation={{
                nextEl: ".custom-next-button",
                prevEl: ".custom-prev-button",
              }}
              loop={testimonials.length > 3}
              modules={[Autoplay, Navigation]}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              className="mySwiper"
              spaceBetween={30}
              slidesPerView={1}
              breakpoints={{
                768:  { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
            >
              {testimonials.map((testi, index) => (
                <SwiperSlide key={testi.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-gradient-to-r from-white via-gray-50 to-white rounded-2xl shadow-xl p-6 md:p-8 flex flex-col items-center hover:scale-105 transform transition-all duration-300 border border-gray-200"
                  >
                    <div className="flex flex-col items-center">
                      <div className="rounded-full h-20 w-20 md:h-24 md:w-24 overflow-hidden mb-4 border-4 border-indigo-300 shadow-inner">
                        <Image
                          src={testi.image ?? "/profile.png"}
                          alt={testi.name}
                          width={96}
                          height={96}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <h4 className="font-semibold text-lg md:text-xl text-gray-900">
                        {testi.name}
                      </h4>
                      <span className="text-sm text-gray-400">{testi.role}</span>
                    </div>
                    <p className="mt-4 text-center text-gray-700 font-serif italic leading-relaxed text-md md:text-lg">
                      &ldquo;{testi.message}&rdquo;
                    </p>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>

            {testimonials.length > 1 && (
              <>
                <button className="custom-prev-button absolute top-1/2 -left-4 md:left-0 transform -translate-y-1/2 z-10 p-3 rounded-full bg-white shadow-lg hover:bg-indigo-50 transition-colors duration-300 text-indigo-600">
                  <GoArrowLeft className="w-5 h-5" />
                </button>
                <button className="custom-next-button absolute top-1/2 -right-4 md:right-0 transform -translate-y-1/2 z-10 p-3 rounded-full bg-white shadow-lg hover:bg-indigo-50 transition-colors duration-300 text-indigo-600">
                  <GoArrowRight className="w-5 h-5" />
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Testimonials;
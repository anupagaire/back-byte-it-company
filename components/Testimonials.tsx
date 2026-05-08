"use client";

import Image from "next/image";
import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { motion } from "framer-motion";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";

import "swiper/css";
import "swiper/css/navigation";

const testimonials = [
  {
    name: "Ram Prasad Gautam",
    image: "/profile.png",
    date: "CTO, FinTech Solutions",
    message:
      "Back Byte transformed our entire digital banking experience. Their attention to detail and technical excellence is unmatched.",
  },
   {
    name: "Rajesh Sharma",
    image: "/profile.png",
    date: "CEO, HealthVista",
    message:
      "Working with Back Byte was a game changer for our hospital management system. Delivery was on time and quality exceeded expectations.",
  },

  {
    name: "Rajesh Sharma",
    image: "/profile.png",
    date: "CEO, HealthVista",
    message:
      "The AI-powered sustainability platform they built for us is nothing short of brilliant. Highly recommended!",
  },
    {
    name: "Rajesh Sharma",
    image: "/profile.png",
    date: "CEO, HealthVista",
    message:
      "Working with Back Byte was a game changer for our hospital management system. Delivery was on time and quality exceeded expectations.",
  },
 
 
];

const Testimonials: React.FC = () => {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <div id="testimonials" className="w-full py-2 lg:py-4 ">
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
          Hear directly from students who turned their study abroad dreams into reality. Real journeys, real challenges, and real growth — shared to inspire your own path.
        </motion.p>
      </div>

      {/* Swiper */}
      <div className="relative max-w-7xl mx-auto px-4 lg:px-10">
        <Swiper
          navigation={{
            nextEl: ".custom-next-button",
            prevEl: ".custom-prev-button",
          }}
          loop={true}
          modules={[Autoplay, Navigation]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          className="mySwiper"
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {testimonials.map((testi, index) => (
            <SwiperSlide key={index}>
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
                      src={testi.image}
                      alt={testi.name}
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <h4 className="font-semibold text-lg md:text-xl text-gray-900">{testi.name}</h4>
                  <span className="text-sm text-gray-400">
                    {new Date(testi.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <p className="mt-4 text-center text-gray-700 font-serif italic leading-relaxed text-md md:text-lg">
                  &ldquo;{testi.message}&rdquo;
                </p>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>

        <button className="custom-prev-button absolute top-1/2 -left-4 md:left-0 transform -translate-y-1/2 z-10 p-3 rounded-full bg-white shadow-lg hover:bg-indigo-50 transition-colors duration-300 text-indigo-600">
          <GoArrowLeft className="w-5 h-5" />
        </button>
        <button className="custom-next-button absolute top-1/2 -right-4 md:right-0 transform -translate-y-1/2 z-10 p-3 rounded-full bg-white shadow-lg hover:bg-indigo-50 transition-colors duration-300 text-indigo-600">
          <GoArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Testimonials;
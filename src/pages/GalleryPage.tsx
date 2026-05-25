"use client";
import GallerySwiper from "@/components/GallerySwiper";
import { AnimatePresence, motion, Variants } from "framer-motion";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const slideFade: Variants = {
  hidden: { opacity: 0, y: 20, transition: { duration: 0.8, ease: "easeOut" } },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.6, ease: "easeOut" } },
};

const GalleryPage = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="gallery"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={slideFade}
          className="relative overflow-x-hidden min-h-screen w-full"
        >
          {/* Header */}
          <div className="bg-linear-to-b from-black via-black/70 to-transparent absolute top-0 left-0 right-0 z-50 text-center pt-8 px-8 pb-24 pointer-events-none">
            <p
              className="text-[9px] uppercase text-white/70 font-light mb-1 tracking-widest"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              A Moment to Remember
            </p>
            <h1 className="font-moontime text-5xl text-white drop-shadow-lg">
              Tangkas & Ais
            </h1>
          </div>

          {/* Gallery Swiper — beri padding-bottom supaya quote tidak ketutup X */}
          <div className="w-full h-screen">
            <GallerySwiper />
          </div>

          {/* Quote footer — diberi margin-bottom agar tidak tertutup tombol X (h-10 + gap = ~72px) */}
          <div
            className="pt-24 bg-linear-to-t from-black via-black/70 to-transparent absolute bottom-0 left-0 right-0 z-[60] text-center pointer-events-none"
            style={{
              paddingBottom: "5rem",
            }} /* 80px — di atas tombol X 40px + gap 40px */
          >
            <p
              className="text-xs text-white/80 italic tracking-wide drop-shadow"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              From this day, forever begins
            </p>
          </div>

          {/* Tombol X di tengah bawah */}
          <Link
            href="/"
            className="
              fixed bottom-6 left-1/2 -translate-x-1/2 z-[60]
              w-10 h-10
              flex items-center justify-center
              rounded-full
              backdrop-blur-md
              bg-white/15
              border border-white/30
              text-white text-base font-light
              shadow-xl
              transition-all duration-300
              hover:bg-white/30 hover:scale-110
              active:scale-95
              select-none
            "
            aria-label="Kembali ke beranda"
          >
            ✕
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GalleryPage;

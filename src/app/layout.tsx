/* eslint-disable @next/next/no-page-custom-font */
"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaMusic, FaPause } from "react-icons/fa";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // 🎵 AUTO PLAY ON LOAD
  useEffect(() => {
    const interval = setInterval(async () => {
      if (audioRef.current) {
        audioRef.current.volume = 0.5;
        try {
          await audioRef.current.play();
          setIsPlaying(true);
          clearInterval(interval);
        } catch (err) {
          console.log("Autoplay blocked by browser", err);
        }
      }
    }, 5);

    return () => clearInterval(interval);
  }, []);

  const toggleMusic = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      try {
        await audioRef.current.play();
      } catch (err) {
        console.log("Play blocked", err);
      }
    }
    setIsPlaying(!isPlaying);
  };
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <title>Wedding Invitation | Tangkas & Ais</title>

        <meta name="description" content="Wedding Invitation Tangkas & Ais" />

        {/* FAVICON */}
        <link rel="icon" href="/images/imglogo.png" />
        <link rel="apple-touch-icon" href="/images/imglogo.png" />

        {/* OPEN GRAPH */}
        <meta
          property="og:title"
          content="Wedding Invitation | Tangkas & Ais"
        />
        <meta
          property="og:description"
          content="Wedding Invitation Tangkas & Ais"
        />
        <meta property="og:image" content="/images/imglogo.png" />

        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=Poppins:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="scroll-smooth min-h-full flex flex-col">
        <div className="bg-linear-to-br from-red-50 via-white to-red-50 min-h-screen flex items-center justify-center">
          <div className="w-full max-w-lg mx-auto  overflow-y-auto scroll-smooth">
            {/* AUDIO */}
            <audio ref={audioRef} loop>
              <source src="/backsound.mp3" type="audio/mpeg" />
            </audio>
            {/* 🎵 MUSIC BUTTON */}
            <motion.button
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{
                repeat: isPlaying ? Infinity : 0,
                duration: 3,
                ease: "linear",
              }}
              onClick={toggleMusic}
              className="fixed bottom-5 right-5 z-50 bg-red-900 text-white p-4 rounded-full shadow-xl"
            >
              {isPlaying ? <FaPause /> : <FaMusic />}
            </motion.button>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}

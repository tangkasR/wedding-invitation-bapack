"use client";
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { GrInstagram } from "react-icons/gr";

const weddingDate = dayjs("2026-06-07 10:00:00");

// ─── Animated vertical line driven by scroll ──────────────────────────────────
const AnimatedLine = ({
  scrollProgress,
  className = "",
}: {
  scrollProgress: ReturnType<typeof useTransform<number, number>>;
  className?: string;
}) => (
  <div className={`w-[1.5px] overflow-hidden ${className}`}>
    <motion.div
      style={{ scaleY: scrollProgress, originY: 0 }}
      className="w-full h-full bg-red-900"
    />
  </div>
);

// ─── Fade up reveal ───────────────────────────────────────────────────────────
const RevealUp = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-10% 0px -10% 0px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ─── Slide from direction ─────────────────────────────────────────────────────
const SlideIn = ({
  children,
  from = "left",
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  from?: "left" | "right";
  delay?: number;
  className?: string;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-10% 0px -10% 0px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: from === "left" ? -80 : 80 }}
      animate={
        isInView
          ? { opacity: 1, x: 0 }
          : { opacity: 0, x: from === "left" ? -80 : 80 }
      }
      transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ─── Floating Hearts ─── */
type Heart = {
  id: number;
  left: string;
  size: string;
  duration: number;
  delay: number;
  drift: number;
  yEnd: number;
};

function FloatingHearts() {
  const [hearts, setHearts] = useState<Heart[]>([]);

  // Generate random hanya di client (setelah mount) untuk menghindari hydration mismatch
  useEffect(() => {
    setHearts(
      [...Array(12)].map((_, i) => ({
        id: i,
        left: `${5 + Math.random() * 90}%`,
        size: `${14 + Math.random() * 14}px`,
        duration: 4 + Math.random() * 5,
        delay: Math.random() * 6,
        drift: (Math.random() - 0.5) * 120,
        yEnd: -(300 + Math.random() * 250),
      }))
    );
  }, []);

  if (hearts.length === 0) return null;

  return (
    <>
      {hearts.map((h) => (
        <motion.div
          key={h.id}
          className="absolute pointer-events-none select-none"
          style={{ left: h.left, bottom: "8%", fontSize: h.size }}
          initial={{ y: 0, x: 0, opacity: 0, rotate: 0 }}
          animate={{
            y: h.yEnd,
            x: [0, h.drift * 0.4, h.drift, h.drift * 0.6, 0],
            opacity: [0, 0.9, 0.9, 0.5, 0],
            rotate: [0, -10, 8, -5, 0],
          }}
          transition={{
            duration: h.duration,
            repeat: Infinity,
            delay: h.delay,
            ease: "easeOut",
          }}
        >
          ❤️
        </motion.div>
      ))}
    </>
  );
}

// function FloatingHearts() {
//   const hearts = useMemo(() => (
//     [...Array(12)].map((_, i) => ({
//       id: i,
//       left: `${5 + Math.random() * 90}%`,          // posisi X acak 5–95%
//       size: `${14 + Math.random() * 14}px`,          // ukuran acak 14–28px
//       duration: 4 + Math.random() * 5,               // durasi acak 4–9 detik
//       delay: Math.random() * 6,                      // delay acak 0–6 detik
//       drift: (Math.random() - 0.5) * 120,            // geser X saat naik ±60px
//       yEnd: -(300 + Math.random() * 250),            // ketinggian acak 300–550px
//     }))
//   ), []);

//   return (
//     <>
//       {hearts.map(h => (
//         <motion.div
//           key={h.id}
//           className="absolute pointer-events-none select-none"
//           style={{ left: h.left, bottom: "8%", fontSize: h.size }}
//           initial={{ y: 0, x: 0, opacity: 0, rotate: 0 }}
//           animate={{
//             y: h.yEnd,
//             x: [0, h.drift * 0.4, h.drift, h.drift * 0.6, 0],
//             opacity: [0, 0.9, 0.9, 0.5, 0],
//             rotate: [0, -10, 8, -5, 0],
//           }}
//           transition={{
//             duration: h.duration,
//             repeat: Infinity,
//             delay: h.delay,
//             ease: "easeOut",
//           }}
//         >
//           ❤️
//         </motion.div>
//       ))}
//     </>
//   );
// }

// ─── Main ─────────────────────────────────────────────────────────────────────
const HomePage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hari: 0,
    jam: 0,
    menit: 0,
    detik: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = weddingDate.diff(dayjs());
      if (diff <= 0) return;
      setTimeLeft({
        hari: Math.floor(diff / 86400000),
        jam: Math.floor((diff / 3600000) % 24),
        menit: Math.floor((diff / 60000) % 60),
        detik: Math.floor((diff / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="overflow-x-hidden">
      <AnimatePresence mode="wait">
        {!isOpen && (
          <motion.div
            key="closed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8 }}
            className="h-screen overflow-y-scroll snap-y snap-mandatory"
            style={{ scrollbarWidth: "none" }}
          >
            {/* SECTION 1 — Hero */}
            <section className="snap-start relative h-screen flex items-end justify-center text-white text-center overflow-hidden">
              <Image
                loading="eager"
                src="/images/img-section2-1.jpg"
                alt="hero"
                fill
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-black/45" />
              {/* {[...Array(10)].map((_, i) => (
                <motion.div key={i} className="absolute text-pink-300 text-xl"
                  style={{ left: `${10 + i * 8}%`, bottom: "10%" }}
                  initial={{ y: 0, opacity: 0 }}
                  animate={{ y: -400, opacity: [0, 1, 0] }}
                  transition={{ duration: 6, repeat: Infinity, delay: i * 0.6 }}>
                  ❤️
                </motion.div>
              ))} */}
              <FloatingHearts />
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="relative z-10 pb-[40%] max-w-[80%] w-full font-serif flex flex-col justify-center"
              >
                <h1 className="text-sm text-center mb-10 text-white">
                  The wait is over, and forever begins 💍
                </h1>
                <div className="flex items-center">
                  <p className="text-xs text-gray-300 text-left text-nowrap">
                    From 10 Sep &apos;24
                  </p>
                  <div className="h-[0.1px] bg-gray-300 w-full mx-2" />
                  <p className="text-xs text-gray-300 text-right text-nowrap">
                    To 7 Jun &apos;26
                  </p>
                </div>
              </motion.div>
            </section>

            {/* SECTION 2 — Open Invitation */}
            <section className="snap-start relative min-h-screen flex flex-col justify-center p-6">
              <RevealUp>
                <div className="relative h-110 rounded-lg overflow-hidden">
                  <p className="font-moontime text-white absolute bottom-2 w-full text-center z-20 text-2xl">
                    Tangkas & Ais
                  </p>
                  <Image
                    loading="eager"
                    src="/images/img-section2-2.jpg"
                    alt="gallery"
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                </div>
              </RevealUp>
              <RevealUp delay={0.2}>
                <div className="max-w-[60%] mx-auto flex flex-col justify-center items-center text-left w-full">
                  <p className="font-serif mt-10 mb-2 text-xs w-full text-left">
                    Dear,
                  </p>
                  <h3 className="font-serif text-center w-full mb-6 font-semibold text-red-900">
                    Family and Friends
                  </h3>
                  <p className="text-gray-600 font-serif mb-8 text-xs w-full text-center leading-5">
                    You are warmly invited to witness <br /> and celebrate our
                    special day.
                  </p>
                  <button
                    onClick={() => {
                      setTimeout(
                        () => window.scrollTo({ top: 0, behavior: "instant" }),
                        600
                      );
                      setTimeout(() => setIsOpen(true), 600);
                    }}
                    className="cursor-pointer w-fit px-4 py-2 rounded bg-red-900 text-white text-xs font-semibold"
                  >
                    OPEN INVITATION
                  </button>
                </div>
              </RevealUp>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            key="open"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="overflow-x-hidden"
          >
            <Section3 />
            <Section4 />
            <Section5 />
            <Section6 timeLeft={timeLeft} />
            <Section7 />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─────────────── Section 3 ─────────────── */
function Section3() {
  const sectionRef = useRef<HTMLElement>(null);

  /* scroll-shrink gambar */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imgScale = useSpring(useTransform(scrollYProgress, [0, 1], [1, 0.78]), {
    stiffness: 100,
    damping: 30,
  });
  const imgBR = useTransform(scrollYProgress, [0, 0.5], [0, 16]);
  // const ringOp    = useTransform(scrollYProgress, [0.05, 0.25], [0, 1]);

  /* foto masuk dari kanan saat pertama kelihatan */
  const imgContRef = useRef(null);
  const imgInView = useInView(imgContRef, {
    once: false,
    margin: "0px 0px -5% 0px",
  });

  /* garis section 3: tumbuh otomatis saat load tanpa perlu scroll */
  const [lineGo, setLineGo] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLineGo(true), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen relative py-20 overflow-hidden flex justify-center items-center"
    >
      <div className="relative h-fit w-full">
        {/* nama besar kiri */}
        <SlideIn from="left" className="absolute left-4 -top-12 z-50">
          <p className="-rotate-2 font-moontime text-red-900 text-7xl leading-14">
            Tangkas <br /> Ais
          </p>
        </SlideIn>

        {/* garis kiri – auto tumbuh saat load */}
        <div className="absolute left-10 top-24 h-86 w-[1.5px] overflow-hidden">
          <motion.div
            style={{ originY: 0 }}
            initial={{ scaleY: 0 }}
            animate={lineGo ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full h-full bg-red-900"
          />
        </div>

        {/* gambar */}
        <div ref={imgContRef} className="relative ms-auto w-[80%] h-110">
          {/* border ring muncul saat mengecil */}
          {/* <motion.div
            style={{ borderRadius: imgBR, opacity: ringOp }}
            className="absolute inset-0 z-10 pointer-events-none rounded-l-lg"
          /> */}
          <motion.div
            style={{
              scale: imgScale,
              borderRadius: imgBR,
              overflow: "hidden",
              translateZ: 0,
              backfaceVisibility: "hidden",
              willChange: "transform",
            }}
            initial={{ x: 100, opacity: 0 }}
            animate={imgInView ? { x: 0, opacity: 1 } : { x: 100, opacity: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full h-full rounded-l-lg origin-right"
          >
            <Image
              loading="eager"
              src="/images/img-section3-1.jpg"
              alt="gallery"
              fill
              className="object-cover rounded-l-lg"
              sizes="100vw"
            />
          </motion.div>
        </div>

        <RevealUp delay={0.2}>
          <div className="font-serif font-normal text-gray-600 text-right mt-12 pr-4">
            <p className="text-xs">At last, the moment has arrived.</p>
            <p className="text-xs">We&apos;re ready to begin our forever.</p>
            <p className="mb-4 text-xs">We&apos;re tying the knot!</p>
            <p className="text-red-900 font-semibold text-sm">
              #ForeverWithYou
            </p>
          </div>
        </RevealUp>
      </div>
    </section>
  );
}

// ─── Section 4 ────────────────────────────────────────────────────────────────
function Section4() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const logoOpacity = useTransform(scrollYProgress, [0.05, 0.35], [0, 1]);

  // const logoLeft = useTransform(scrollYProgress, [0.05, 0.35], [-120, 0]);
  // const logoRight = useTransform(scrollYProgress, [0.05, 0.35], [120, 0]);
  // const logoSpringL = useSpring(logoLeft, { stiffness: 90, damping: 20 });
  // const logoSpringR = useSpring(logoRight, { stiffness: 90, damping: 20 });

  const brideRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: bS } = useScroll({
    target: brideRef,
    offset: ["start end", "end start"],
  });
  const brideScale = useSpring(useTransform(bS, [0, 0.6], [1, 0.85]), {
    stiffness: 80,
    damping: 25,
  });
  const imgBRBridge = useTransform(bS, [0, 0.5], [0, 12]);

  const groomRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: gS } = useScroll({
    target: groomRef,
    offset: ["start end", "end start"],
  });
  const groomScale = useSpring(useTransform(gS, [0, 0.6], [1, 0.84]), {
    stiffness: 80,
    damping: 25,
  });
  const imgBRGroom = useTransform(gS, [0, 0.5], [0, 12]);

  return (
    <section ref={ref} id="section-4" className="relative w-full">
      {/* Logo A & T dari kiri-kanan */}
      <motion.div
        style={{ opacity: logoOpacity }}
        className="relative w-full pt-20 flex items-center justify-center"
      >
        <div className="flex items-center justify-center gap-0 relative">
          {/* <motion.span style={{ x: logoSpringL }} className="font-moontime text-red-900 text-8xl leading-none">A</motion.span> */}
          <Image
            loading="eager"
            src="/images/imglogo.png"
            alt="logo"
            width={80}
            height={80}
            className="object-contain mx-2"
          />
          {/* <motion.span style={{ x: logoSpringR }} className="font-moontime text-red-900 text-8xl leading-none">T</motion.span> */}
        </div>
      </motion.div>

      <RevealUp delay={0.1}>
        <p className="font-normal font-serif text-gray-600 text-center text-xs w-full leading-5 mt-8 mb-6 px-4">
          Together with our beloved families, <br /> we warmly invite you to
          join us in celebrating <br /> the beginning of our marriage.
        </p>
      </RevealUp>

      {/* Bride */}
      <div ref={brideRef} className="relative w-full mt-16 h-110">
        <SlideIn from="left" className="absolute left-6 -top-6 z-50">
          <h1 className="font-moontime text-7xl text-red-900">Bride</h1>
        </SlideIn>
        <motion.div
          style={{
            scale: brideScale,
            borderRadius: imgBRBridge,
            overflow: "hidden",
            translateZ: 0,
            backfaceVisibility: "hidden",
            willChange: "transform",
          }}
          className="bg-transparent relative w-full h-full origin-center"
        >
          <div className="px-4 pb-2 z-50 absolute bottom-0 flex justify-end w-full text-white">
            <p className="font-serif text-xs">Puspitalia Dwi Aisah</p>
            {/* <p className="text-gray-200 flex items-center gap-1 text-[9px]">
              <span>@aiskw_</span>
            </p> */}
          </div>
          <Image
            loading="eager"
            src="/images/img-section4-bridge5.jpg"
            alt="bride"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>
      </div>
      <RevealUp delay={0.1}>
        <div className="font-serif text-gray-600 font-medium text-left -mt-4 px-9 mb-10">
          <p className="text-[11px]">Putri dari</p>
          <p className="text-[11px]">Bapak Sumarjono Setyawan</p>
          <p className="mb-4 text-[11px]">Ibu Rusmiyati</p>
        </div>
      </RevealUp>

      {/* Groom */}
      <div ref={groomRef} className="relative w-full mt-16 h-110">
        <SlideIn from="right" className="absolute right-4 -top-6 z-50">
          <h1 className="font-moontime text-7xl text-red-900">Groom</h1>
        </SlideIn>
        <motion.div
          style={{
            scale: groomScale,
            borderRadius: imgBRGroom,
            overflow: "hidden",
            translateZ: 0,
            backfaceVisibility: "hidden",
            willChange: "transform",
          }}
          className="bg-transparent relative w-full h-full origin-center"
        >
          <div className="px-4 pb-2 z-50 absolute bottom-0 flex justify-start w-full text-white">
            {/* <p className="text-gray-200 flex items-center gap-1 text-[9px]">
              <span>@tangkasr_</span>
            </p> */}
            <p className="font-serif text-xs">Tangkas Risdianto</p>
          </div>
          <Image
            loading="eager"
            src="/images/img-section4-groom2.jpg"
            alt="groom"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>
      </div>
      <RevealUp delay={0.1}>
        <div className="font-serif text-gray-600 font-medium text-right -mt-4 px-9 pb-20">
          <p className="text-[11px]">Putra dari</p>
          <p className="text-[11px]">Bapak Aris Munandar</p>
          <p className="mb-4 text-[11px]">Ibu Wartinah</p>
        </div>
      </RevealUp>
    </section>
  );
}

// ─── Section 5 ────────────────────────────────────────────────────────────────
function Section5() {
  const imgRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: imgRef,
    offset: ["start end", "center center"],
  });

  const imgX = useSpring(useTransform(scrollYProgress, [0, 1], [220, 0]), {
    stiffness: 80,
    damping: 20,
  });
  const imgOpacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);
  const imgScale = useSpring(useTransform(scrollYProgress, [0, 1], [1.08, 1]), {
    stiffness: 80,
    damping: 25,
  });

  return (
    <section
      id="section-5"
      className="min-h-screen pb-20 mt-20 relative w-full"
    >
      <div ref={imgRef} className="relative w-full h-110 overflow-hidden">
        <motion.div
          style={{ x: imgX, scale: imgScale, opacity: imgOpacity }}
          className="relative w-full h-full"
        >
          <Image
            loading="eager"
            src="/images/img-section5-3.jpg"
            alt="love story"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>
      </div>

      {/* <RevealUp> */}
      <div className="z-50 w-full -rotate-8 absolute left-8">
        <p className="-mt-12 leading-16 font-moontime text-7xl -rotate-8 text-red-900">
          Our Love <br /> Story
        </p>
      </div>
      {/* </RevealUp> */}

      <RevealUp delay={0.2}>
        <div className="font-serif text-gray-600 text-xs text-right mt-16 px-4 max-w-[60%] ms-auto">
          <p className="mb-4">
            Kami pertama kali bertemu pada suatu hari yang menyenangkan,
            diperkenalkan oleh seorang teman, dan apa yang dimulai sebagai
            percakapan sederhana segera mengalir dengan begitu alami. Dari
            obrolan ringan, berubah menjadi tawa yang kami harap tak pernah
            berakhir.
          </p>
          <p className="mb-4">
            Seiring berjalannya waktu, kami melewati berbagai momen, baik suka
            maupun duka, bersama. Kami saling belajar, berbagi begitu banyak
            kenangan, dan selalu memberikan dukungan tanpa henti satu sama lain.
          </p>
          <p>
            Kini, kami siap melangkah ke tahap berikutnya dan memulai babak baru
            dalam kehidupan kami bersama. Dengan penuh kebahagiaan, kami
            mengundang Anda untuk turut merayakan momen istimewa ini pada{" "}
            <span className="font-bold text-red-900">7 Juni 2026</span>.
          </p>
        </div>
      </RevealUp>

      <RevealUp delay={0.3}>
        <p className="font-serif mt-8 px-4 flex gap-1 items-center justify-end text-red-900 font-semibold">
          <span className="text-[10px]">Met &apos;24</span>
          <span className="h-px w-4 bg-red-900"></span>
          <span className="text-[10px]">Wed &apos;26</span>
        </p>
      </RevealUp>
    </section>
  );
}

// ─── Section 6 ────────────────────────────────────────────────────────────────
function Section6({
  timeLeft,
}: {
  timeLeft: { hari: number; jam: number; menit: number; detik: number };
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const imgScale = useSpring(useTransform(scrollYProgress, [0, 1], [1.8, 1]), {
    stiffness: 80,
    damping: 25,
  });
  const lineProgress = useTransform(scrollYProgress, [0.1, 0.9], [0, 1]);

  const ref2 = useRef<HTMLDivElement>(null);
  const { scrollYProgress: scrollYProgress2 } = useScroll({
    target: ref2,
    offset: ["start 2.5", "end 0.5"],
  });
  // ← tambah ini, pakai scrollYProgress yang sama tapi range berbeda
  const line2Progress = useTransform(scrollYProgress2, [0.4, 0.85], [0, 1]);
  const horizProgress = useTransform(scrollYProgress2, [0.6, 0.95], [0, 1]);
  return (
    <section
      ref={ref}
      id="section-6"
      className="min-h-screen pb-40 mt-20 relative w-full"
    >
      <p className="rounded-full font-sans font-semibold z-20 mb-4 text-red-950 -rotate-90 absolute left-6 top-4 text-[9px] w-fit">
        The Day
      </p>

      {/* Vertikal 1 */}
      <div className="absolute left-10 top-12 h-100 w-[1.5px] overflow-hidden">
        <motion.div
          style={{ scaleY: lineProgress, originY: 0 }}
          className="w-full h-full bg-red-950"
        />
      </div>

      <div className="relative ms-auto w-[80%] h-110 rounded-l-lg overflow-hidden">
        <motion.div
          style={{ scale: imgScale }}
          className="relative w-full h-full"
        >
          <Image
            loading="eager"
            src="/images/img-section6-3.jpg"
            alt="special day"
            fill
            className="object-cover rounded-l-lg"
            sizes="100vw"
          />
        </motion.div>
      </div>

      {/* <RevealUp> */}
      <div className="z-50 absolute left-6">
        <p className="mt-8 font-moontime text-left text-red-900 text-6xl w-full">
          Our Special <br /> Day
        </p>
      </div>
      {/* </RevealUp> */}

      {/* Vertikal 2 */}
      <div className="absolute left-10 top-152 h-110 w-[1.5px] overflow-hidden">
        <motion.div
          style={{ scaleY: line2Progress, originY: 0 }}
          className="w-full h-full bg-red-950"
        />
      </div>

      {/* Horizontal */}
      <div className="w-full absolute left-0 top-252 h-0.5 overflow-hidden">
        <motion.div
          style={{ scaleX: horizProgress, originX: 1 }}
          className="w-full h-full bg-red-950"
        />
      </div>

      <RevealUp delay={0.2}>
        <div ref={ref2} className="text-right mt-30 pr-4">
          <p className="font-serif font-semibold text-2xl text-red-950 mb-2">
            Resepsi
          </p>
          <p className="font-serif text-gray-600 text-xl">
            Minggu, 7 Juni 2026
          </p>
          <p className="font-serif text-gray-600 text-xl mb-10">
            11:00 WIB - 13:30 WIB
          </p>
          <p className="font-serif font-semibold text-2xl text-red-950 mb-2">
            Lokasi
          </p>
          <p className="ms-auto max-w-[240px] mb-6 font-serif text-gray-600 text-xl">
            Jl. Kirangga, Jetis Wetan Rt 03 / Rw 01, Pacarejo, <br /> Kec.
            Semanu, Kabupaten Gunungkidul, <br /> Daerah Istimewa Yogyakarta
          </p>
          <button
            onClick={() =>
              window.open("https://maps.app.goo.gl/3t7kpVXTEMmr6ecR8", "_blank")
            }
            className="cursor-pointer mb-20 w-fit px-4 py-2 rounded bg-red-900 text-white font-bold"
          >
            Google Maps
          </button>
          <div className="font-sans text-gray-900 font-semibold flex items-center gap-1 ms-auto w-fit mb-4 text-2xl">
            <p>07</p>
            <p>/</p>
            <p>06</p>
            <p>/</p>
            <p>2026</p>
          </div>
          <motion.section className="font-sans flex items-center ms-auto w-fit rounded text-red-900 bg-red-200/30">
            {Object.entries(timeLeft).map(([key, value]) => (
              <motion.div key={key} className="px-2 py-1">
                <p className="font-semibold text-2xl">{value}</p>
                <p className="capitalize">{key}</p>
              </motion.div>
            ))}
          </motion.section>
        </div>
      </RevealUp>
    </section>
  );
}

// function Section6({
//   timeLeft,
// }: {
//   timeLeft: { hari: number; jam: number; menit: number; detik: number };
// }) {
//   const ref = useRef<HTMLDivElement>(null);
//   const { scrollYProgress } = useScroll({
//     target: ref,
//     offset: ["start end", "center center"],
//   });
//   const imgScale = useSpring(useTransform(scrollYProgress, [0, 1], [1.8, 1]), {
//     stiffness: 80,
//     damping: 25,
//   });
//   const lineProgress = useTransform(scrollYProgress, [0.1, 0.9], [0, 1]);

//   return (
//     <section
//       ref={ref}
//       id="section-6"
//       className="min-h-screen pb-40 mt-20 relative w-full"
//     >
//       <p className="rounded-full font-sans font-semibold z-20 mb-4 text-red-950 -rotate-90 absolute left-6 top-4 text-[9px] w-fit">
//         The Day
//       </p>

//       {/* Vertikal 1 */}
//       <div className="absolute left-10 top-12 h-100 w-[1.5px] overflow-hidden">
//         <motion.div
//           style={{ scaleY: lineProgress, originY: 0 }}
//           className="w-full h-full bg-red-950"
//         />
//       </div>

//       <div className="relative ms-auto w-[80%] h-110 rounded-l-lg overflow-hidden">
//         <motion.div
//           style={{ scale: imgScale }}
//           className="relative w-full h-full"
//         >
//           <Image
//             loading="eager"
//             src="/images/hero.jpg"
//             alt="special day"
//             fill
//             className="object-cover rounded-l-lg"
//             sizes="100vw"
//           />
//         </motion.div>
//       </div>

//       {/* <RevealUp> */}
//       <div className="z-50 absolute left-6">
//         <p className="mt-8 font-moontime text-left text-red-900 text-6xl w-full">
//           Our Special <br /> Day
//         </p>
//       </div>
//       {/* </RevealUp> */}

//       {/* Vertikal 2 */}
//       <div className="absolute left-10 top-152 h-98 w-[1.5px] overflow-hidden">
//         <motion.div
//           style={{ scaleY: lineProgress, originY: 0 }}
//           className="w-full h-full bg-red-950"
//         />
//       </div>
//       {/* Horizontal */}
//       <div className="w-full absolute left-0 top-240 h-0.5 overflow-hidden">
//         <motion.div
//           style={{ scaleY: lineProgress, originY: 0 }}
//           className="w-full h-full bg-red-950"
//         />
//       </div>

//       {/* <div className="w-[1.5px] bg-red-950 absolute left-10 top-152 h-128 rounded-full" /> */}
//       {/* <div className="w-full bg-red-950 absolute left-0 top-268 h-0.5" /> */}

//       <RevealUp delay={0.2}>
//         <div className="text-right mt-30 pr-4">
//           {/* <p className="font-serif font-semibold text-lg text-red-950 mb-2">
//             Akad Nikah
//           </p>
//           <p className="text-[11px] text-gray-600 font-serif">
//             Sunday, June 7, 2026
//           </p>
//           <p className="text-[11px] text-gray-600 font-serif mb-10">
//             09:00 WIB - finish
//           </p> */}
//           <p className="font-serif font-semibold text-lg text-red-950 mb-2">
//             Resepsi
//           </p>
//           <p className="text-[11px] text-gray-600 font-sans font-semibold tracking-wide">
//             Minggu, 7 Juni 2026
//           </p>
//           <p className="text-[11px] text-gray-600 font-sans font-semibold tracking-wide mb-10">
//             11:00 WIB - 13:30 WIB
//           </p>
//           <p className="font-serif font-semibold text-lg text-red-950 mb-2">
//             Lokasi
//           </p>
//           <p className="mb-6 text-[11px] text-gray-600 font-sans font-semibold tracking-wide">
//             Jl. Kirangga, Jetis Wetan, Pacarejo, <br /> Kec. Semanu, Kabupaten
//             Gunungkidul, <br /> Daerah Istimewa Yogyakarta
//           </p>
//           <button
//             onClick={() =>
//               window.open("https://maps.app.goo.gl/3t7kpVXTEMmr6ecR8", "_blank")
//             }
//             className="cursor-pointer mb-8 w-fit px-4 py-2 rounded bg-red-900 text-white text-xs font-bold"
//           >
//             Google Map
//           </button>
//           <div className="font-sans text-gray-900 font-semibold flex items-center gap-1 ms-auto w-fit mb-4 text-[11px]">
//             <p>07</p>
//             <p>/</p>
//             <p>06</p>
//             <p>/</p>
//             <p>2026</p>
//           </div>
//           <motion.section className="font-sans flex items-center ms-auto w-fit rounded text-red-900 bg-red-200/30">
//             {Object.entries(timeLeft).map(([key, value]) => (
//               <motion.div key={key} className="px-2 py-1">
//                 <p className="font-semibold text-[10px]">{value}</p>
//                 <p className="capitalize text-[8px]">{key}</p>
//               </motion.div>
//             ))}
//           </motion.section>
//         </div>
//       </RevealUp>
//     </section>
//   );
// }

/* ─────────────── Section 7 ─────────────── */
function Section7() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });

  /* gambar membesar dari kecil ke ukuran asli */
  const scaleL = useSpring(useTransform(scrollYProgress, [0, 1], [0.8, 1.05]), {
    stiffness: 80,
    damping: 25,
  });
  const scaleR = useSpring(useTransform(scrollYProgress, [0, 1], [0.8, 1.05]), {
    stiffness: 80,
    damping: 25,
  });
  /* border radius dan ring hilang saat sudah full */
  const brL = useTransform(scrollYProgress, [0, 0.85], [16, 0]);
  const brR = useTransform(scrollYProgress, [0, 0.85], [16, 0]);
  const ringOp = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      ref={sectionRef}
      id="section-7"
      className="min-h-screen flex justify-center items-center w-full"
    >
      <div className="relative h-fit w-full">
        <div className="absolute z-40 top-50 w-full pointer-events-none">
          <Image
            loading="eager"
            src="/images/imglogowhite.png"
            alt="logo"
            width={500}
            height={500}
            className="object-contain bg-transparent w-1/3 mx-auto h-full mb-12"
          />
        </div>
        <div className="grid grid-cols-2">
          <div className="mt-16 relative w-full h-110 overflow-hidden">
            <motion.div
              style={{ borderRadius: brL, opacity: ringOp }}
              className="absolute inset-0 z-10 pointer-events-none"
            />
            <motion.div
              style={{ scale: scaleL, borderRadius: brL }}
              className="relative w-full h-full overflow-hidden"
            >
              <Image
                loading="eager"
                src="/images/img-section7-bridge2.jpg"
                alt="gallery left"
                fill
                className="object-cover"
                sizes="100vw"
              />
            </motion.div>
          </div>
          <div className="relative w-full h-110 overflow-hidden">
            <motion.div
              style={{ borderRadius: brR, opacity: ringOp }}
              className="absolute inset-0 z-10 pointer-events-none"
            />
            <motion.div
              style={{ scale: scaleR, borderRadius: brR }}
              className="relative w-full h-full overflow-hidden"
            >
              <Image
                loading="eager"
                src="/images/img-section7-groom1.jpg"
                alt="gallery right"
                fill
                className="object-cover"
                sizes="100vw"
              />
            </motion.div>
          </div>
        </div>
        <RevealUp delay={0.2}>
          <div className="flex justify-end -mt-8 pr-4 pb-10">
            <Link
              href="/gallery"
              className="cursor-pointer w-fit px-4 py-2 rounded bg-red-900 text-white text-xs font-bold"
            >
              OPEN GALLERY
            </Link>
          </div>
        </RevealUp>
      </div>
    </section>
  );
}

export default HomePage;

"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

/* ══════════════════════════════════════════
   DATA — 24 foto
══════════════════════════════════════════ */
const PHOTOS = Array.from({ length: 25 }, (_, i) => ({
  id: i,
  src: [
    "/images/gallery/studio1-1.jpg",
    "/images/gallery/studio2-1.jpg",
    "/images/gallery/studio3.jpg",
    "/images/gallery/studio4.jpg",
    "/images/gallery/studio5.jpg",
    "/images/gallery/studio6.jpg",
    "/images/gallery/studio7-1.jpg",
    "/images/gallery/studio8-3.jpg",
    "/images/gallery/studio9-1.jpg",
    "/images/gallery/studio10-1.jpg",
    "/images/gallery/studio11-1.jpg",
    "/images/gallery/mercusuar1-1.jpg",
    "/images/gallery/mercusuar2.jpg",
    "/images/gallery/mercusuar3.jpg",
    "/images/gallery/mercusuar4-3.jpg",
    "/images/gallery/mercusuar5.jpg",
    "/images/gallery/mercusuar6.jpg",
    "/images/gallery/mercusuar7.jpg",
    "/images/gallery/mercusuar9-1.jpg",
    "/images/gallery/mercusuar11-1.jpg",
    "/images/gallery/mercusuar8-3.jpg",
    "/images/gallery/pantai2.jpg",
    "/images/gallery/pantai1-2.jpg",
    "/images/gallery/pantai3-3.jpg",
    "/images/gallery/pantai4.jpg",
  ][i],
  label: [
    "Sejak Pertama Kali",
    "Di Antara Kita",
    "Genggam Tanganku",
    "Selalu Bersamamu",
    "Satu Langkah Lagi",
    "Dekat di Hati",
    "Tatapan Terdalam",
    "Dalam Diamku",
    "Rumah Itu Dirimu",
    "Jarak Tak Berarti",
    "Kamu, Segalanya",
    "Di Tepi Cahaya",
    "Malam yang Hangat",
    "Denyut yang Sama",
    "Selamanya Bersamamu",
    "Nafas Terakhirku",
    "Cinta Itu Sunyi",
    "Kenangan Abadi",
    "Tempat Aku Pulang",
    "Sayap Untuk Terbang",
    "Senja Milik Kita",
    "Bisikan Angin Laut",
    "Janji di Tepi Ombak",
    "Dua Menjadi Satu",
    "Cerita Kita",
  ][i],
  pos: [
    "50% 25%",
    "45% 55%",
    "60% 45%",
    "50% 70%",
    "35% 40%",
    "65% 35%",
    "50% 15%",
    "40% 60%",
    "55% 45%",
    "50% 60%",
    "38% 30%",
    "62% 40%",
    "50% 80%",
    "44% 50%",
    "56% 50%",
    "50% 22%",
    "36% 58%",
    "64% 58%",
    "50% 68%",
    "48% 42%",
    "52% 38%",
    "50% 72%",
    "44% 30%",
    "56% 62%",
    "56% 62%",
  ][i],
}));

/* ══════════════════════════════════════════
   PLACEMENTS — 24 items, all portrait/square
   Items 0-19: original layout unchanged
   Items 20-23: new rows 13-15
   No overlaps. No landscape.
══════════════════════════════════════════ */
// [colStart, rowStart, colSpan, rowSpan]
const PLACEMENTS: [number, number, number, number][] = [
  // ── Items 0-19: unchanged ──
  [1, 1, 2, 2], //  0  big 2×2     rows 1-2,   cols 1-2
  [3, 1, 1, 2], //  1  tall 1×2    rows 1-2,   col 3
  [1, 3, 1, 2], //  2  tall 1×2    rows 3-4,   col 1
  [2, 3, 1, 1], //  3  small       row 3,      col 2
  [3, 3, 1, 1], //  4  small       row 3,      col 3
  [2, 4, 1, 1], //  5  small       row 4,      col 2
  [3, 4, 1, 1], //  6  small       row 4,      col 3
  [1, 5, 1, 1], //  7  small       row 5,      col 1
  [2, 5, 1, 1], //  8  small       row 5,      col 2
  [3, 5, 1, 2], //  9  tall 1×2    rows 5-6,   col 3
  [1, 6, 1, 1], // 10  small       row 6,      col 1
  [2, 6, 1, 1], // 11  small       row 6,      col 2
  [1, 7, 1, 2], // 12  tall 1×2    rows 7-8,   col 1
  [2, 7, 2, 2], // 13  big 2×2     rows 7-8,   cols 2-3
  [1, 9, 2, 2], // 14  big 2×2     rows 9-10,  cols 1-2
  [3, 9, 1, 2], // 15  tall 1×2    rows 9-10,  col 3
  [1, 11, 1, 2], // 16  tall 1×2    rows 11-12, col 1
  [2, 11, 1, 1], // 17  small       row 11,     col 2
  [3, 11, 1, 2], // 18  tall 1×2    rows 11-12, col 3
  [2, 12, 1, 1], // 19  small       row 12,     col 2
  // ── Items 20-23: new rows 13-15 ──
  [1, 13, 2, 2], // 20  big 2×2     rows 13-14, cols 1-2
  [3, 13, 1, 2], // 21  tall 1×2    rows 13-14, col 3
  [1, 15, 1, 1], // 22  small       row 15,     col 1
  [2, 15, 1, 1], // 23  small       row 15,     col 2
  [3, 15, 1, 1], // 23  small       row 15,     col 2
];

/* ══════════════════════════════════════════
   LIGHTBOX
══════════════════════════════════════════ */
function Lightbox({
  index,
  onClose,
  onPrev,
  onNext,
}: {
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const photo = PHOTOS[index];

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose, onPrev, onNext]);

  const tx = useRef(0);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: "rgba(10,6,4,0.96)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
      onTouchStart={(e) => {
        tx.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        const dx = tx.current - e.changedTouches[0].clientX;
        if (Math.abs(dx) > 50) {
          e.stopPropagation();
          dx > 0 ? onNext() : onPrev();
        }
      }}
    >
      {/* [←] [card] [→] */}
      <div
        className="flex items-center gap-4 w-full"
        style={{ maxWidth: "min(420px, 94vw)", padding: "0 12px" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* PREV */}
        <button
          onClick={onPrev}
          disabled={index === 0}
          className="flex-shrink-0 flex items-center justify-center rounded-full transition-all duration-300"
          style={{
            width: 40,
            height: 40,
            border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(255,255,255,0.08)",
            color:
              index === 0 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.85)",
            cursor: index === 0 ? "default" : "pointer",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* CARD */}
        <div className="flex-1 flex flex-col gap-3 min-w-0">
          <div
            className="relative w-full overflow-hidden"
            style={{
              aspectRatio: "3/4",
              borderRadius: 6,
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.8)",
            }}
          >
            <Image
              key={index}
              src={photo.src}
              alt={photo.label}
              fill
              className="object-cover"
              style={{ objectPosition: photo.pos }}
              sizes="420px"
            />
            {(["tl", "tr", "bl", "br"] as const).map((corner) => (
              <span
                key={corner}
                className="absolute pointer-events-none"
                style={{
                  width: 16,
                  height: 16,
                  top: corner[0] === "t" ? 0 : undefined,
                  bottom: corner[0] === "b" ? 0 : undefined,
                  left: corner[1] === "l" ? 0 : undefined,
                  right: corner[1] === "r" ? 0 : undefined,
                  borderTop:
                    corner[0] === "t"
                      ? "1px solid rgba(255,255,255,0.45)"
                      : undefined,
                  borderBottom:
                    corner[0] === "b"
                      ? "1px solid rgba(255,255,255,0.45)"
                      : undefined,
                  borderLeft:
                    corner[1] === "l"
                      ? "1px solid rgba(255,255,255,0.45)"
                      : undefined,
                  borderRight:
                    corner[1] === "r"
                      ? "1px solid rgba(255,255,255,0.45)"
                      : undefined,
                }}
              />
            ))}
          </div>

          <div className="flex items-center justify-center gap-2">
            <span
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: "0.78rem",
                color: "rgba(255,255,255,0.5)",
                letterSpacing: "0.1em",
              }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <span
              style={{
                width: 1,
                height: 10,
                background: "rgba(255,255,255,0.2)",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: "0.8rem",
                fontStyle: "italic",
                color: "rgba(255,255,255,0.75)",
              }}
            >
              {photo.label}
            </span>
            <span
              style={{
                width: 1,
                height: 10,
                background: "rgba(255,255,255,0.2)",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: "0.75rem",
                color: "rgba(255,255,255,0.35)",
              }}
            >
              / {PHOTOS.length}
            </span>
          </div>

          <div
            style={{
              height: 1,
              background: "rgba(255,255,255,0.1)",
              borderRadius: 1,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${((index + 1) / PHOTOS.length) * 100}%`,
                background: "rgba(255,255,255,0.5)",
                transition: "width 0.35s ease",
              }}
            />
          </div>
        </div>

        {/* NEXT */}
        <button
          onClick={onNext}
          disabled={index === PHOTOS.length - 1}
          className="flex-shrink-0 flex items-center justify-center rounded-full transition-all duration-300"
          style={{
            width: 40,
            height: 40,
            border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(255,255,255,0.08)",
            color:
              index === PHOTOS.length - 1
                ? "rgba(255,255,255,0.2)"
                : "rgba(255,255,255,0.85)",
            cursor: index === PHOTOS.length - 1 ? "default" : "pointer",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* CLOSE */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 flex items-center justify-center rounded-full transition-all duration-300"
        style={{
          width: 36,
          height: 36,
          border: "1px solid rgba(255,255,255,0.2)",
          background: "rgba(255,255,255,0.08)",
          color: "rgba(255,255,255,0.7)",
          cursor: "pointer",
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════
   GALLERY SWIPER — infinite vertical scroll
══════════════════════════════════════════ */
export default function GallerySwiper() {
  const [active, setActive] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const ROW_UNIT = 130; // px per row unit
  const GAP = 4;
  const TOTAL_ROWS = 15; // rows 1-15 (items 0-19 use rows 1-12, items 20-23 use rows 13-15)
  const SINGLE_HEIGHT = TOTAL_ROWS * (ROW_UNIT + GAP) - GAP;

  const autoScrollRef = useRef<number>(0);
  const pausedRef = useRef(false);
  const posRef = useRef(SINGLE_HEIGHT);
  const lastTimeRef = useRef<number>(0);
  const SPEED = 38; // px/s

  // Start at middle copy for seamless loop
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = SINGLE_HEIGHT;
      posRef.current = SINGLE_HEIGHT;
    }
  }, [SINGLE_HEIGHT]);

  const runScroll = useCallback(
    (ts: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = ts;
      const dt = (ts - lastTimeRef.current) / 1000;
      lastTimeRef.current = ts;

      if (!pausedRef.current && scrollRef.current) {
        posRef.current += SPEED * dt;
        if (posRef.current >= SINGLE_HEIGHT * 2) {
          posRef.current -= SINGLE_HEIGHT;
          scrollRef.current.scrollTop = posRef.current;
        } else {
          scrollRef.current.scrollTop = posRef.current;
        }
      }
      autoScrollRef.current = requestAnimationFrame(runScroll);
    },
    [SINGLE_HEIGHT]
  );

  useEffect(() => {
    autoScrollRef.current = requestAnimationFrame(runScroll);
    return () => cancelAnimationFrame(autoScrollRef.current);
  }, [runScroll]);

  // Pause auto-scroll when lightbox is open
  useEffect(() => {
    pausedRef.current = active !== null;
  }, [active]);

  // Sync posRef on manual scroll + wrap for infinite effect
  const onScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const y = scrollRef.current.scrollTop;
    posRef.current = y;
    if (y < SINGLE_HEIGHT * 0.5) {
      posRef.current = y + SINGLE_HEIGHT;
      scrollRef.current.scrollTop = posRef.current;
    } else if (y >= SINGLE_HEIGHT * 2) {
      posRef.current = y - SINGLE_HEIGHT;
      scrollRef.current.scrollTop = posRef.current;
    }
  }, [SINGLE_HEIGHT]);

  const close = useCallback(() => setActive(null), []);
  const prev = useCallback(
    () => setActive((p) => (p !== null ? Math.max(0, p - 1) : 0)),
    []
  );
  const next = useCallback(
    () =>
      setActive((p) => (p !== null ? Math.min(PHOTOS.length - 1, p + 1) : 0)),
    []
  );

  const renderGrid = (keyPrefix: string) => (
    <div
      key={keyPrefix}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gridAutoRows: `${ROW_UNIT}px`,
        gap: `${GAP}px`,
        width: "100%",
        height: SINGLE_HEIGHT,
        flexShrink: 0,
      }}
    >
      {PHOTOS.map((photo, i) => {
        const [cs, rs, csp, rsp] = PLACEMENTS[i];
        return (
          <button
            key={`${keyPrefix}-${i}`}
            onClick={() => setActive(i)}
            style={{
              gridColumn: `${cs} / span ${csp}`,
              gridRow: `${rs} / span ${rsp}`,
              position: "relative",
              overflow: "hidden",
              cursor: "pointer",
              borderRadius: 3,
              border: "none",
              padding: 0,
              background: "#111",
            }}
          >
            <Image
              src={photo.src}
              alt={photo.label}
              fill
              sizes="(max-width: 500px) 50vw, 33vw"
              className="object-cover"
              style={{
                objectPosition: photo.pos,
                transition: "transform 0.5s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLImageElement).style.transform =
                  "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLImageElement).style.transform =
                  "scale(1)";
              }}
              loading={i < 6 ? "eager" : "lazy"}
            />
            {/* Hover overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                background:
                  "linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.6) 100%)",
                opacity: 0,
                transition: "opacity 0.35s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.opacity = "1";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.opacity = "0";
              }}
            />
            {/* Label on hover */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "5px 7px",
                fontFamily: "'Playfair Display',serif",
                fontSize: "clamp(0.48rem,1.4vw,0.62rem)",
                fontStyle: "italic",
                color: "rgba(255,255,255,0.9)",
                textShadow: "0 1px 6px rgba(0,0,0,0.9)",
                pointerEvents: "none",
                opacity: 0,
                transform: "translateY(3px)",
                transition: "opacity 0.35s, transform 0.35s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.opacity = "1";
                el.style.transform = "translateY(0)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.opacity = "0";
                el.style.transform = "translateY(3px)";
              }}
            >
              {photo.label}
            </div>
          </button>
        );
      })}
    </div>
  );

  return (
    <>
      {/* SCROLL CONTAINER — 3 copies for infinite loop */}
      <div
        ref={scrollRef}
        onScroll={onScroll}
        style={
          {
            width: "100%",
            height: "100%",
            overflowY: "scroll",
            overflowX: "hidden",
            scrollbarWidth: "none",
            background: "#080604",
          } as React.CSSProperties
        }
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          {renderGrid("copy-a")}
          {renderGrid("copy-b")}
          {renderGrid("copy-c")}
        </div>
      </div>

      {/* LIGHTBOX */}
      {active !== null && (
        <Lightbox index={active} onClose={close} onPrev={prev} onNext={next} />
      )}
    </>
  );
}

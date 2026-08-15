"use client";

import { useEffect, useState, useCallback, useMemo } from "react";

export default function RocketIntro() {
  const [phase, setPhase] = useState<"playing" | "fading" | "done">("playing");

  // Starfield positions
  const stars = useMemo(
    () =>
      Array.from({ length: 65 }, (_, i) => ({
        id: i,
        left: `${(i * 37 + 13) % 100}%`,
        top: `${(i * 53 + 7) % 100}%`,
        size: 1 + (i % 3),
        delay: (i * 0.07) % 2.5,
        duration: 1.2 + (i % 3) * 0.8,
      })),
    []
  );

  // Spark trail particles
  const sparks = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        delay: 0.6 + i * 0.08,
        top: `${32 + ((i * 7) % 22)}%`,
        left: `${20 + ((i * 9) % 25)}%`,
        size: 3 + (i % 3),
      })),
    []
  );

  useEffect(() => {
    const fadeTimer = setTimeout(() => setPhase("fading"), 4200);
    const doneTimer = setTimeout(() => setPhase("done"), 5000);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  const handleSkip = useCallback(() => {
    if (phase === "playing") {
      setPhase("fading");
      setTimeout(() => setPhase("done"), 800);
    }
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      onClick={handleSkip}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "#030305",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        overflow: "hidden",
        perspective: "1000px",
        opacity: phase === "fading" ? 0 : 1,
        transition: "opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
        pointerEvents: phase === "fading" ? "none" : "auto",
      }}
    >
      {/* ── 3D Starfield ── */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {stars.map((s) => (
          <div
            key={s.id}
            style={{
              position: "absolute",
              left: s.left,
              top: s.top,
              width: s.size,
              height: s.size,
              background: "#ffffff",
              borderRadius: "50%",
              boxShadow: s.size > 2 ? "0 0 6px #ffffff" : "none",
              animation: `star-twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* ── Background Glow ── */}
      <div
        style={{
          position: "absolute",
          width: "550px",
          height: "550px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(230, 20, 20, 0.2) 0%, rgba(0, 115, 230, 0.18) 45%, transparent 75%)",
          animation: "glow-breathe 3.5s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      {/* ── 3D Stage Container ── */}
      <div
        style={{
          position: "relative",
          width: "min(360px, 86vw)",
          height: "min(400px, 88vw)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transformStyle: "preserve-3d",
          animation: "stage-3d-float 4s ease-in-out infinite alternate",
        }}
      >
        {/* ── SVG Logo Graphic (100% Reliable Rendering, No Fragile SVG Filters) ── */}
        <svg
          viewBox="0 0 400 440"
          style={{
            width: "100%",
            height: "100%",
            overflow: "visible",
            filter: "drop-shadow(0 15px 25px rgba(0, 0, 0, 0.8))",
          }}
        >
          {/* ── 1. RED OUTER RING (Enclosing center with top-left cutout) ── */}
          <path
            d="M 120 130 A 100 100 0 1 1 178 82"
            fill="none"
            stroke="#ff1a1a"
            strokeWidth="28"
            strokeLinecap="round"
            style={{
              strokeDasharray: 750,
              strokeDashoffset: 750,
              animation: "ring-draw-3d 1.3s cubic-bezier(0.4, 0, 0.2, 1) 0.2s forwards",
              filter: "drop-shadow(0 0 12px rgba(255, 26, 26, 0.8))",
            }}
          />

          {/* ── 2. BLUE 'e' (Inside red ring, extending out top-left) ── */}
          <g
            style={{
              opacity: 0,
              animation: "e-assemble-3d 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.9s forwards",
              filter: "drop-shadow(0 0 14px rgba(0, 153, 255, 0.8))",
            }}
          >
            {/* Outer body loop of 'e' */}
            <path
              d="M 125 180 C 125 240 160 270 200 270 C 255 270 275 225 272 180 C 270 140 235 110 195 110 C 145 110 125 145 125 180 Z"
              fill="none"
              stroke="#0088ff"
              strokeWidth="26"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Crossbar extending UP-LEFT out through the red cutout */}
            <path
              d="M 125 180 L 272 180 C 250 140 200 120 165 105 L 115 80"
              fill="none"
              stroke="#0088ff"
              strokeWidth="26"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* ── 3. ROCKET (Flying in 3D to top-left tip of 'e') ── */}
          <g
            style={{
              opacity: 0,
              animation:
                "rocket-fly-3d 2.8s cubic-bezier(0.15, 0.85, 0.3, 1) 0.3s forwards",
              filter: "drop-shadow(0 0 10px rgba(255, 51, 0, 0.7))",
            }}
          >
            {/* Exhaust Flame */}
            <path
              d="M 115 80 L 158 107 C 142 101 132 93 115 80 Z"
              fill="#ff9900"
              style={{ animation: "flame-flicker 0.12s ease-in-out infinite" }}
            />
            <path
              d="M 115 80 L 148 100 C 138 96 128 90 115 80 Z"
              fill="#ffff00"
              opacity="0.9"
            />

            {/* Rocket Blue Wings / Tail Fins */}
            <path d="M 102 65 L 118 85 L 110 88 Z" fill="#0055cc" />
            <path d="M 88 78 L 108 98 L 102 90 Z" fill="#0077ff" />

            {/* Rocket Main Red Fuselage */}
            <path
              d="M 52 40 C 72 48 95 72 112 80 C 92 78 68 60 52 40 Z"
              fill="#ff2a2a"
            />
            {/* Fuselage Shadow Line */}
            <path
              d="M 66 52 C 80 62 98 75 112 80 C 95 78 78 65 66 52 Z"
              fill="#990000"
              opacity="0.55"
            />

            {/* White Stripe Accent */}
            <path
              d="M 58 45 L 68 53 L 64 57 L 54 49 Z"
              fill="#ffffff"
            />

            {/* Black Tip Cone */}
            <path
              d="M 52 40 L 58 45 L 54 49 Z"
              fill="#1a1a1a"
            />
          </g>

          {/* ── 4. TYPOGRAPHY ── */}
          <g
            style={{
              opacity: 0,
              animation: "text-fade-in-3d 0.8s ease-out 1.7s forwards",
            }}
          >
            {/* E-CELL Bold Blue Text */}
            <text
              x="200"
              y="350"
              textAnchor="middle"
              fill="#0077ff"
              fontSize="48"
              fontWeight="900"
              fontFamily="'Space Grotesk', 'Inter', system-ui, sans-serif"
              letterSpacing="3"
              style={{ filter: "drop-shadow(0 0 15px rgba(0, 119, 255, 0.7))" }}
            >
              E-CELL
            </text>

            {/* BVCOENM Subtitle Text */}
            <text
              x="200"
              y="390"
              textAnchor="middle"
              fill="#00c3ff"
              fontSize="20"
              fontWeight="700"
              fontFamily="'Space Grotesk', 'Inter', system-ui, sans-serif"
              letterSpacing="10"
            >
              BVCOENM
            </text>
          </g>
        </svg>

        {/* Trail Sparks */}
        {sparks.map((sp) => (
          <div
            key={sp.id}
            style={{
              position: "absolute",
              width: sp.size,
              height: sp.size,
              background: "#ffcc00",
              borderRadius: "50%",
              top: sp.top,
              left: sp.left,
              opacity: 0,
              boxShadow: "0 0 10px 2px #ff6600",
              animation: `particle-drift 0.8s ease-out ${sp.delay}s forwards`,
            }}
          />
        ))}
      </div>

      {/* Skip Hint */}
      <div
        style={{
          position: "absolute",
          bottom: "2rem",
          fontSize: "0.75rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "#52525b",
          opacity: 0,
          animation: "text-fade-in-3d 0.5s ease-out 2.5s forwards",
        }}
      >
        Click anywhere to skip
      </div>
    </div>
  );
}

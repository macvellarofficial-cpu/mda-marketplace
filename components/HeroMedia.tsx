"use client";

import React, { useRef, useState, useEffect } from "react";

export default function HeroMedia() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.85; // Subtle cinematic slow motion
    }
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">
      {/* Industrial African Mining Video Loop */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        onLoadedData={() => setIsVideoLoaded(true)}
        poster="https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1920&q=80"
        className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${
          isVideoLoaded ? "opacity-35 scale-105" : "opacity-25"
        }`}
        style={{
          filter: "contrast(1.15) brightness(0.7) saturate(0.9)",
          transform: "scale(1.05)",
        }}
      >
        <source
          src="https://assets.mixkit.co/videos/preview/mixkit-heavy-machinery-digging-in-a-quarry-41718-large.mp4"
          type="video/mp4"
        />
      </video>

      {/* Primary Atmospheric Dual Gradient: Fade to canvas background */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-[#0B0C10]/80 to-transparent dark:from-[#0B0C10] dark:via-[#0B0C10]/80 light:from-[#F8FAFC] light:via-[#F8FAFC]/85" />

      {/* Top Header Transition Vignette */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0B0C10] to-transparent dark:from-[#0B0C10] light:from-[#F8FAFC]/90" />

      {/* Radial Focal Spotlight: Keeps typography ultra-legible */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(11,12,16,0.3)_0%,rgba(11,12,16,0.95)_100%)] dark:opacity-100 light:opacity-90" />

      {/* Gold Ambient Dust Horizon */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[450px] rounded-full blur-[140px] pointer-events-none opacity-20"
        style={{ backgroundColor: "var(--color-primary, #D4AF37)" }}
      />
    </div>
  );
}

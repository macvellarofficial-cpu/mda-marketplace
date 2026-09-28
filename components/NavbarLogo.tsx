"use client";

import React from "react";
import Image from "next/image";

interface NavbarLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function NavbarLogo({
  className = "",
  size = "md",
}: NavbarLogoProps) {
  const heightClass =
    size === "sm"
      ? "h-9"
      : size === "lg"
      ? "h-14 sm:h-16"
      : "h-11 sm:h-12";

  return (
    <div
      className={`flex items-center hover:opacity-95 transition-opacity cursor-pointer select-none bg-transparent ${className}`}
    >
      <div className="relative flex items-center">
        <Image
          src="/logo.svg"
          alt="Mineral Dealers Africa"
          width={220}
          height={60}
          priority
          unoptimized
          className={`${heightClass} w-auto object-contain drop-shadow-[0_0_15px_rgba(212,175,55,0.25)]`}
        />
      </div>
    </div>
  );
}


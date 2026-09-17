import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#F3F4F6]">
      {children}
    </div>
  );
}

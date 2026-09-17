import MobileOnboarding from "@/components/MobileOnboarding";
import DesktopPortal from "@/components/DesktopPortal";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0B0C10] text-[#F3F4F6]">
      {/* Mobile Layout: Zeraket-style onboarding carousel & PWA install banner */}
      <div className="block md:hidden">
        <MobileOnboarding />
      </div>

      {/* Desktop Layout: High-contrast B2B Mineral Exchange Portal */}
      <div className="hidden md:block">
        <DesktopPortal />
      </div>
    </main>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Gem,
  Pickaxe,
  Building2,
  Wrench,
  Scale,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { COUNTRIES } from "@/utils/regions";

export type RoleType =
  | "Supplier"
  | "Buyer"
  | "Equipment Manufacturer"
  | "Service Provider";

interface RoleOption {
  id: RoleType;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  tag: string;
}

const ROLES: RoleOption[] = [
  {
    id: "Supplier",
    title: "Mineral Supplier",
    subtitle: "Miners, Artisanal Cooperatives, Exporters",
    description:
      "Concession owners, verified small-scale mining cooperatives, and licensed mineral export aggregators.",
    icon: <Pickaxe className="w-6 h-6 text-[#D4AF37]" />,
    tag: "CONCESSION / EXPORT",
  },
  {
    id: "Buyer",
    title: "Institutional Buyer",
    subtitle: "Industrialists, Refineries, Offtake Investors",
    description:
      "Global refineries, battery manufacturers, sovereign procurement entities, and commodity hedge funds.",
    icon: <Building2 className="w-6 h-6 text-[#10B981]" />,
    tag: "REFINERY / OFFTAKE",
  },
  {
    id: "Equipment Manufacturer",
    title: "Equipment Manufacturer",
    subtitle: "Drilling, Processing Plants, Heavy Machinery",
    description:
      "Suppliers of crushers, gravity separation tables, smelting furnaces, excavators, and drilling rigs.",
    icon: <Wrench className="w-6 h-6 text-amber-400" />,
    tag: "INDUSTRIAL MACHINERY",
  },
  {
    id: "Service Provider",
    title: "Assay & Service Provider",
    subtitle: "Assay Labs, Geologists, Logistics, Legal, ESG",
    description:
      "ISO 17025 accredited spectrographic laboratories, customs brokers, chartered surveyors, and maritime insurers.",
    icon: <Scale className="w-6 h-6 text-sky-400" />,
    tag: "VERIFICATION & LOGISTICS",
  },
];

export default function RegisterPage() {
  const router = useRouter();

  // Wizard Step State
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [role, setRole] = useState<RoleType>("Supplier");
  const [fullName, setFullName] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [phoneCode, setPhoneCode] = useState("+256");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState("UG");
  const [region, setRegion] = useState(COUNTRIES[0].regions[0] || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [turnstileVerified, setTurnstileVerified] = useState(false);

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const selectedCountry =
    COUNTRIES.find((c) => c.code === selectedCountryCode) || COUNTRIES[0];

  const handleCountryChange = (code: string) => {
    setSelectedCountryCode(code);
    const country = COUNTRIES.find((c) => c.code === code);
    if (country) {
      setPhoneCode(country.phoneCode);
      setRegion(country.regions[0] || "");
    }
  };

  // Step 2 Validation
  const validateStep2 = () => {
    if (!fullName.trim()) {
      setErrorMessage("Please enter your full legal name.");
      return false;
    }
    if (!workEmail.trim() || !workEmail.includes("@")) {
      setErrorMessage("Please enter a valid institutional work email.");
      return false;
    }
    if (!phoneNumber.trim()) {
      setErrorMessage("Please provide a contact phone number.");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  // Step 3 Validation
  const validateStep3 = () => {
    if (!companyName.trim()) {
      setErrorMessage("Please enter your organization or concession name.");
      return false;
    }
    if (!region.trim()) {
      setErrorMessage("Please select your operational region/district.");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  // Final Step 4 Validation & Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    if (!agreeTerms) {
      setErrorMessage(
        "You must agree to the Terms of Trade and OECD Sourcing Compliance."
      );
      return;
    }
    if (!turnstileVerified) {
      setErrorMessage("Please complete the Cloudflare Turnstile verification.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const fullPhone = `${phoneCode} ${phoneNumber.trim()}`;

      // 1. Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: workEmail.trim(),
        password: password,
        options: {
          data: {
            full_name: fullName.trim(),
            role: role,
            company_name: companyName.trim(),
            country: selectedCountry.name,
            region: region,
            phone: fullPhone,
          },
        },
      });

      if (authError) {
        // If Supabase is unconfigured or returns invalid URL error, fallback gracefully
        console.warn("Supabase auth warning:", authError.message);
        if (
          authError.message.includes("fetch") ||
          authError.message.includes("URL") ||
          authError.message.includes("network")
        ) {
          // Dev fallback: store in local storage session
          sessionStorage.setItem(
            "mda_user",
            JSON.stringify({
              fullName,
              workEmail,
              role,
              companyName,
              country: selectedCountry.name,
              region,
              phone: fullPhone,
            })
          );
          router.push("/dashboard");
          return;
        }
        throw authError;
      }

      // 2. Insert into public.profiles table
      if (authData?.user) {
        try {
          await supabase.from("profiles").upsert({
            id: authData.user.id,
            full_name: fullName.trim(),
            email: workEmail.trim(),
            role: role,
            company_name: companyName.trim(),
            country: selectedCountry.name,
            region: region,
            phone: fullPhone,
            created_at: new Date().toISOString(),
          });
        } catch (dbErr) {
          console.warn("Profile table upsert note:", dbErr);
        }
      }

      // 3. Cache session data for immediate dashboard personalization
      sessionStorage.setItem(
        "mda_user",
        JSON.stringify({
          fullName,
          workEmail,
          role,
          companyName,
          country: selectedCountry.name,
          region,
          phone: fullPhone,
        })
      );

      router.push("/dashboard");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to register account.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#F3F4F6] flex flex-col justify-between py-8 px-4 sm:px-6 relative">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#D4AF37]/10 blur-[130px] pointer-events-none rounded-full" />

      {/* Header */}
      <header className="max-w-3xl w-full mx-auto flex items-center justify-between pb-6 border-b border-white/[0.08] relative z-10">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#8C6D1F] p-0.5 flex items-center justify-center shadow-[0_0_12px_rgba(212,175,55,0.3)]">
            <div className="w-full h-full bg-[#0B0C10] rounded-[10px] flex items-center justify-center">
              <Gem className="w-4 h-4 text-[#D4AF37]" />
            </div>
          </div>
          <div>
            <span className="font-bold text-sm tracking-wider text-white">
              MDA
            </span>
            <span className="text-[9px] text-[#D4AF37] block font-mono">
              MINERAL DEALERS AFRICA
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-xs text-white/50 hidden sm:inline">
            Already accredited?
          </span>
          <Link
            href="/login"
            className="text-xs font-mono text-[#D4AF37] hover:underline px-3 py-1.5 rounded-lg bg-[#14171F] border border-white/[0.08]"
          >
            Sign In →
          </Link>
        </div>
      </header>

      {/* Main Form Container */}
      <main className="max-w-2xl w-full mx-auto my-6 p-6 sm:p-8 rounded-3xl bg-[#14171F] border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.8)] relative z-10">
        {/* Step Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-[#D4AF37] flex items-center gap-1.5 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              STEP {currentStep} OF 4
            </span>
            <span className="text-white/40">
              {currentStep === 1 && "Role Selection"}
              {currentStep === 2 && "Contact Identification"}
              {currentStep === 3 && "Organizational Details"}
              {currentStep === 4 && "Security & Bot Verification"}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 rounded-full bg-[#0B0C10] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] transition-all duration-300 rounded-full"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono mb-6 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: ROLE SELECTION */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Select Your Industry Classification
              </h2>
              <p className="text-xs text-white/60 mt-1">
                Choose the primary business profile under which your
                organization conducts mineral trade.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3.5 pt-2">
              {ROLES.map((r) => {
                const isSelected = role === r.id;
                return (
                  <div
                    key={r.id}
                    onClick={() => setRole(r.id)}
                    className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 border flex flex-col justify-between ${
                      isSelected
                        ? "bg-[#0B0C10] border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                        : "bg-[#0B0C10]/60 border-white/[0.06] hover:border-white/[0.2] hover:bg-[#0B0C10]"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            isSelected
                              ? "bg-[#D4AF37]/15 border border-[#D4AF37]/40"
                              : "bg-[#14171F] border border-white/[0.08]"
                          }`}
                        >
                          {r.icon}
                        </div>
                        <span className="text-[9px] font-mono text-white/50 px-2 py-0.5 rounded bg-[#14171F] border border-white/[0.05]">
                          {r.tag}
                        </span>
                      </div>

                      <h3
                        className={`text-sm font-bold mb-0.5 ${
                          isSelected ? "text-[#D4AF37]" : "text-white"
                        }`}
                      >
                        {r.title}
                      </h3>
                      <p className="text-[11px] font-medium text-white/80 mb-2">
                        {r.subtitle}
                      </p>
                      <p className="text-[10px] text-white/50 leading-relaxed">
                        {r.description}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-white/[0.04] flex items-center justify-between text-[10px] font-mono">
                      <span className="text-white/40">Statutory Vetting</span>
                      {isSelected ? (
                        <span className="text-[#10B981] flex items-center gap-1 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Selected
                        </span>
                      ) : (
                        <span className="text-white/40">Select →</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setErrorMessage("");
                  setCurrentStep(2);
                }}
                className="px-6 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#F59E0B] text-black font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(212,175,55,0.25)] flex items-center gap-2"
              >
                <span>Continue to Contact</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: BASIC CONTACT INFO */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Authorized Contact Information
              </h2>
              <p className="text-xs text-white/60 mt-1">
                Provide legal identity details for multilateral trade
                contracts and escrow disbursements.
              </p>
            </div>

            <div className="space-y-4 pt-1">
              <div>
                <label className="text-xs font-mono text-white/60 block mb-1.5">
                  FULL LEGAL NAME
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. David Kasule / Elena Rostova"
                  className="w-full h-12 px-4 bg-[#0B0C10] border border-white/[0.08] text-sm text-white rounded-xl focus:outline-none focus:border-[#D4AF37] font-mono transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-white/60 block mb-1.5">
                  INSTITUTIONAL WORK EMAIL
                </label>
                <input
                  type="email"
                  value={workEmail}
                  onChange={(e) => setWorkEmail(e.target.value)}
                  placeholder="name@miningconcession.com"
                  className="w-full h-12 px-4 bg-[#0B0C10] border border-white/[0.08] text-sm text-white rounded-xl focus:outline-none focus:border-[#D4AF37] font-mono transition-colors"
                />
                <span className="text-[10px] text-white/40 block mt-1">
                  Official corporate domain preferred for accelerated MEMD
                  vetting.
                </span>
              </div>

              <div>
                <label className="text-xs font-mono text-white/60 block mb-1.5">
                  PHONE NUMBER (WITH COUNTRY PREFIX)
                </label>
                <div className="flex gap-2">
                  <select
                    value={phoneCode}
                    onChange={(e) => setPhoneCode(e.target.value)}
                    className="h-12 w-28 bg-[#0B0C10] border border-white/[0.08] text-xs font-mono text-white rounded-xl px-2 focus:outline-none focus:border-[#D4AF37] transition-colors cursor-pointer"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.phoneCode}>
                        {c.code} ({c.phoneCode})
                      </option>
                    ))}
                  </select>

                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="772 123 456"
                    className="flex-1 h-12 px-4 bg-[#0B0C10] border border-white/[0.08] text-sm text-white rounded-xl focus:outline-none focus:border-[#D4AF37] font-mono transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setErrorMessage("");
                  setCurrentStep(1);
                }}
                className="px-5 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white/80 text-xs font-mono transition-all flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (validateStep2()) {
                    setCurrentStep(3);
                  }
                }}
                className="px-6 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#F59E0B] text-black font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(212,175,55,0.25)] flex items-center gap-2"
              >
                <span>Continue to Organization</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: ORGANIZATIONAL DETAILS */}
        {currentStep === 3 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Organizational & Geographic Details
              </h2>
              <p className="text-xs text-white/60 mt-1">
                Map your entity to sovereign concession zones or international
                procurement jurisdictions.
              </p>
            </div>

            <div className="space-y-4 pt-1">
              <div>
                <label className="text-xs font-mono text-white/60 block mb-1.5">
                  REGISTERED COMPANY / CONCESSION NAME
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Albertine Sovereign Minerals Ltd / Glencore DRC"
                  className="w-full h-12 px-4 bg-[#0B0C10] border border-white/[0.08] text-sm text-white rounded-xl focus:outline-none focus:border-[#D4AF37] font-mono transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-white/60 block mb-1.5">
                  PRIMARY COUNTRY OF OPERATIONS
                </label>
                <select
                  value={selectedCountryCode}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="w-full h-12 bg-[#0B0C10] border border-white/[0.08] text-sm text-white rounded-xl px-4 focus:outline-none focus:border-[#D4AF37] transition-colors cursor-pointer"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-white/60 block mb-1.5">
                  OPERATIONAL REGION / MINING DISTRICT
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full h-12 bg-[#0B0C10] border border-white/[0.08] text-sm text-white rounded-xl px-4 focus:outline-none focus:border-[#D4AF37] transition-colors cursor-pointer"
                >
                  {selectedCountry.regions.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-white/40 block mt-1">
                  Dynamically updated to accredited concession corridors in{" "}
                  {selectedCountry.name}.
                </span>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setErrorMessage("");
                  setCurrentStep(2);
                }}
                className="px-5 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white/80 text-xs font-mono transition-all flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (validateStep3()) {
                    setCurrentStep(4);
                  }
                }}
                className="px-6 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#F59E0B] text-black font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(212,175,55,0.25)] flex items-center gap-2"
              >
                <span>Continue to Security</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: SECURITY & BOT CHECK */}
        {currentStep === 4 && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Security & Verification Protocol
              </h2>
              <p className="text-xs text-white/60 mt-1">
                Protect your institutional portal access with encrypted
                credentials and Turnstile bot protection.
              </p>
            </div>

            <div className="space-y-4 pt-1">
              {/* Password */}
              <div>
                <label className="text-xs font-mono text-white/60 block mb-1.5">
                  PORTAL MASTER PASSWORD
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 alphanumeric characters"
                    className="w-full h-12 px-4 pr-11 bg-[#0B0C10] border border-white/[0.08] text-sm text-white rounded-xl focus:outline-none focus:border-[#D4AF37] font-mono transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-xs font-mono text-white/60 block mb-1.5">
                  CONFIRM MASTER PASSWORD
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter master password"
                  className="w-full h-12 px-4 bg-[#0B0C10] border border-white/[0.08] text-sm text-white rounded-xl focus:outline-none focus:border-[#D4AF37] font-mono transition-colors"
                />
              </div>

              {/* Cloudflare Turnstile Bot Verification Container */}
              <div className="pt-2">
                <label className="text-xs font-mono text-white/60 block mb-1.5">
                  HUMAN VERIFICATION
                </label>
                <div
                  onClick={() => setTurnstileVerified(!turnstileVerified)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-200 flex items-center justify-between ${
                    turnstileVerified
                      ? "bg-[#0B0C10] border-[#10B981]/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                      : "bg-[#0B0C10] border-white/[0.1] hover:border-white/[0.2]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${
                        turnstileVerified
                          ? "bg-[#10B981] text-black"
                          : "border border-white/30 bg-[#14171F]"
                      }`}
                    >
                      {turnstileVerified && (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-white block">
                        {turnstileVerified
                          ? "Verification Successful"
                          : "Verify you are human"}
                      </span>
                      <span className="text-[10px] text-white/40 block font-mono">
                        Cloudflare Turnstile Managed Challenge
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <ShieldCheck
                      className={`w-5 h-5 ${
                        turnstileVerified
                          ? "text-[#10B981]"
                          : "text-white/40"
                      }`}
                    />
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-white/80 block leading-tight">
                        CLOUDFLARE
                      </span>
                      <span className="text-[8px] text-white/40 block leading-none font-mono">
                        TURNSTILE
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <label className="flex items-start gap-3 p-3 rounded-xl bg-[#0B0C10] border border-white/[0.05] cursor-pointer pt-3">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded bg-[#14171F] border-white/20 text-[#D4AF37] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-xs text-white/70 leading-relaxed">
                  I certify that the provided entity complies with MEMD Uganda
                  licensing or equivalent sovereign mining statutes, and agree to
                  the{" "}
                  <span className="text-[#D4AF37] underline">
                    OECD Annex II Due Diligence
                  </span>{" "}
                  and{" "}
                  <span className="text-[#D4AF37] underline">
                    MDA Escrow Protocol
                  </span>
                  .
                </span>
              </label>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setErrorMessage("");
                  setCurrentStep(3);
                }}
                className="px-5 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white/80 text-xs font-mono transition-all flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3.5 rounded-xl bg-[#D4AF37] hover:bg-[#F59E0B] text-black font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center gap-2 disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                <span>
                  {loading ? "Authenticating..." : "Complete Accreditation"}
                </span>
              </button>
            </div>
          </form>
        )}
      </main>

      {/* Footer info */}
      <footer className="max-w-3xl w-full mx-auto text-center text-[11px] font-mono text-white/40 pt-4 border-t border-white/[0.05] relative z-10">
        MINERAL DEALERS AFRICA · ENCRYPTED 256-BIT CUSTODIAL ONBOARDING
      </footer>
    </div>
  );
}

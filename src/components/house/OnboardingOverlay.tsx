"use client";

import { useMemo, useRef, useState } from "react";
import { HOUSE_META, type House } from "@/lib/constants/houses";
import { COUNTRIES } from "@/lib/constants/countries";
import { MascotAvatar } from "@/components/house/MascotAvatar";
import { cn } from "@/lib/utils";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png"]);

type Props = {
  userHouse: House;
  userId: string;
  initialNickname?: string | null;
  initialNationality?: string | null;
  initialProfileUrl?: string | null;
};

export function OnboardingOverlay({
  userHouse,
  userId,
  initialNickname,
  initialNationality,
  initialProfileUrl,
}: Props) {
  const [visible, setVisible] = useState(true);
  const [closing, setClosing] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(() =>
    initialNickname && initialNationality ? 2 : 1,
  );
  const [nickname, setNickname] = useState(initialNickname ?? "");
  const [nationality, setNationality] = useState(initialNationality ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [nationalityOpen, setNationalityOpen] = useState(false);
  const [nationalitySearch, setNationalitySearch] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const houseMeta = HOUSE_META[userHouse];
  const selectedCountry = COUNTRIES.find((c) => c.name === nationality);
  const filteredCountries = useMemo(
    () =>
      COUNTRIES.filter((c) =>
        c.name.toLowerCase().includes(nationalitySearch.toLowerCase()),
      ),
    [nationalitySearch],
  );

  async function handleConfirmNickname() {
    const trimmed = nickname.trim();
    if (trimmed.length < 2 || trimmed.length > 30) {
      setError("Alias must be 2–30 characters.");
      return;
    }
    if (!nationality) {
      setError("Select your nationality.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/auth/complete-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: trimmed, nationality }),
      });
      if (res.ok) {
        setStep(initialProfileUrl ? 3 : 2);
      } else {
        const data = await res.json();
        setError(data.error ?? "Something went wrong. Try again.");
      }
    } finally {
      setSaving(false);
    }
  }

  function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      setError("Please choose a JPEG or PNG image.");
      event.target.value = "";
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError("Image is too large (max 5MB).");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => setError("Could not read the selected image.");
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        setError("Could not read the selected image.");
        return;
      }
      setPhotoPreview(reader.result);
      setError("");
    };
    reader.readAsDataURL(file);
  }

  async function handleConfirmPhoto() {
    if (!photoPreview) {
      setError("Upload a photo to continue.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      const res = await fetch(`/api/students/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profilePic: photoPreview }),
      });
      if (res.ok) {
        setStep(3);
      } else {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Something went wrong. Try again.");
      }
    } catch {
      setError("Network error — please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (!visible) return null;

  return (
    <div
      onAnimationEnd={() => {
        if (closing) setVisible(false);
      }}
      className={cn(
        "fixed inset-0 z-50 flex flex-col justify-end bg-[rgba(243,238,229,0.88)] backdrop-blur-[2px]",
        closing
          ? "animate-[overlayOut_0.3s_ease-in_both]"
          : "animate-[overlayIn_0.3s_ease-out_both]",
      )}
    >
      <div
        className={cn(
          "border-t border-accent/28 bg-surface pt-7 px-6 pb-10",
          closing
            ? "animate-[slideDown_0.3s_ease-in_both]"
            : "animate-[slideUp_0.35s_ease-out_both]",
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png"
          onChange={handlePhotoChange}
          className="hidden"
          tabIndex={-1}
        />
        {step === 1 ? (
          <>
            <div className="mb-3.5 font-mono text-[8px] uppercase tracking-[4px] text-danger">
              STEP 1 OF 3 · AGENT INTAKE
            </div>
            <div className="mb-1.5 font-display text-[18px] text-foreground">
              Register Your Details
            </div>
            <div className="mb-[22px] text-[14px] leading-[1.6] text-muted">
              Every operative needs a code name and a home base on file.
            </div>

            <div className="mb-1.5 font-mono text-[9px] uppercase tracking-[2px] text-accent">
              Alias
            </div>
            <div className="mb-3.5 flex items-center gap-2.5 border border-accent/25 bg-background px-3.5 py-3">
              <div className="font-mono text-[11px] text-accent">›</div>
              <input
                type="text"
                placeholder="e.g. Shadow, Oracle, Wraith..."
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value);
                  if (error) setError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleConfirmNickname();
                }}
                className="flex-1 border-none bg-transparent font-serif text-[16px] text-foreground caret-accent outline-none"
              />
            </div>

            <div className="mb-1.5 font-mono text-[9px] uppercase tracking-[2px] text-accent">
              Nationality
            </div>
            <button
              type="button"
              onClick={() => {
                setNationalityOpen((open) => !open);
                setNationalitySearch("");
              }}
              className={cn(
                "flex w-full cursor-pointer items-center gap-2.5 border border-accent/25 bg-background px-3.5 py-3 text-left",
                nationalityOpen ? "mb-0" : error ? "mb-2" : "mb-3.5",
              )}
            >
              <div className="font-mono text-[11px] text-accent">›</div>
              {selectedCountry && (
                <div className="text-[16px] leading-none">
                  {selectedCountry.flag}
                </div>
              )}
              <div
                className={cn(
                  "flex-1 font-serif text-[16px]",
                  nationality ? "text-foreground" : "text-muted-fg",
                )}
              >
                {nationality || "Select your nationality..."}
              </div>
              <div
                className={cn(
                  "text-[10px] text-accent transition-transform duration-[180ms] ease-out",
                  nationalityOpen ? "rotate-180" : "rotate-0",
                )}
              >
                ▾
              </div>
            </button>

            <div
              className={cn(
                "overflow-hidden border-t-0 bg-background transition-all duration-200 ease-in-out",
                nationalityOpen
                  ? "mb-3.5 max-h-[230px] border border-accent/25"
                  : "mb-0 max-h-0 border-0",
              )}
            >
              <div className="sticky top-0 flex items-center gap-2 border-b border-accent/18 bg-background px-3 py-[9px]">
                <div className="text-[11px] text-accent">⌕</div>
                <input
                  type="text"
                  placeholder="Search country..."
                  value={nationalitySearch}
                  onChange={(e) => setNationalitySearch(e.target.value)}
                  className="flex-1 border-none bg-transparent font-mono text-[12px] tracking-[0.5px] text-foreground outline-none"
                />
              </div>
              <div className="max-h-[180px] overflow-y-auto">
                {filteredCountries.length === 0 ? (
                  <div className="px-3.5 py-4 text-center text-[12px] italic text-muted-fg">
                    No matches.
                  </div>
                ) : (
                  filteredCountries.map((country) => (
                    <div
                      key={country.code}
                      onClick={() => {
                        setNationality(country.name);
                        setNationalityOpen(false);
                        if (error) setError("");
                      }}
                      className={cn(
                        "flex cursor-pointer items-center gap-2.5 border-l-2 px-3.5 py-[9px] text-[14px] text-foreground",
                        country.name === nationality
                          ? "border-accent bg-accent/8"
                          : "border-transparent",
                      )}
                    >
                      <span className="w-5 text-[15px]">{country.flag}</span>
                      {country.name}
                    </div>
                  ))
                )}
              </div>
            </div>

            {error && (
              <div className="mb-3.5 font-mono text-[10px] tracking-[1px] text-danger">
                ✕ {error}
              </div>
            )}

            <button
              onClick={handleConfirmNickname}
              disabled={saving}
              className={cn(
                "w-full border-none bg-dark p-3.5 text-center",
                saving
                  ? "cursor-not-allowed opacity-[.65]"
                  : "cursor-pointer opacity-100",
              )}
            >
              <div className="font-display text-[13px] tracking-[2px] text-[#D8C0A0]">
                {saving ? "Saving..." : "Confirm Alias"}
              </div>
            </button>
          </>
        ) : step === 2 ? (
          <>
            <div className="mb-3.5 font-mono text-[8px] uppercase tracking-[4px] text-danger">
              STEP 2 OF 3 · AGENT PHOTO
            </div>
            <div className="mb-1.5 font-display text-[18px] text-foreground">
              Submit Your Photo
            </div>
            <div className="mb-[22px] text-[14px] leading-[1.6] text-muted">
              Field agents require a photo on file for identification.
            </div>

            <div className="mb-3.5 flex justify-center">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label={
                    photoPreview ? "Change profile photo" : "Upload profile photo"
                  }
                  className={cn(
                    "relative flex size-[108px] cursor-pointer items-center justify-center overflow-hidden rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent",
                    photoPreview
                      ? "border-2 border-accent bg-background"
                      : "border-2 border-dashed border-accent/40 bg-background",
                  )}
                  style={
                    photoPreview
                      ? {
                          backgroundImage: `url("${photoPreview}")`,
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "cover",
                        }
                      : undefined
                  }
                >
                  {!photoPreview && (
                    <svg
                      viewBox="0 0 24 24"
                      width="34"
                      height="34"
                      fill="none"
                      stroke="#1C1A17"
                      strokeWidth="1.3"
                      className="opacity-35"
                      aria-hidden
                    >
                      <circle cx="12" cy="8" r="3.4" />
                      <path d="M4.5 20c1-4 4.2-6 7.5-6s6.5 2 7.5 6" />
                    </svg>
                  )}
                  {photoPreview && (
                    <>
                      <div className="absolute top-[3px] left-[3px] w-2 h-2 border-t-[1.5px] border-l-[1.5px] border-accent" />
                      <div className="absolute top-[3px] right-[3px] w-2 h-2 border-t-[1.5px] border-r-[1.5px] border-accent" />
                      <div className="absolute bottom-[3px] left-[3px] w-2 h-2 border-b-[1.5px] border-l-[1.5px] border-accent" />
                      <div className="absolute bottom-[3px] right-[3px] w-2 h-2 border-b-[1.5px] border-r-[1.5px] border-accent" />
                    </>
                  )}
                </button>
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-1 -bottom-1 flex size-9 items-center justify-center rounded-full border-2 border-surface bg-accent"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="none"
                    stroke="#EDE1C4"
                    strokeWidth="1.8"
                    aria-hidden
                  >
                    <path d="M4 8h3l1.5-2h7L17 8h3v11H4z" />
                    <circle cx="12" cy="13.5" r="3.2" />
                  </svg>
                </span>
              </div>
            </div>

            {error && (
              <div className="mb-3.5 text-center font-mono text-[10px] tracking-[1px] text-danger">
                ✕ {error}
              </div>
            )}

            <button
              onClick={handleConfirmPhoto}
              disabled={!photoPreview || saving}
              className={cn(
                "w-full border-none bg-dark p-3.5 text-center",
                !photoPreview || saving
                  ? "cursor-not-allowed opacity-[.65]"
                  : "cursor-pointer opacity-100",
              )}
            >
              <div className="font-display text-[13px] tracking-[2px] text-[#D8C0A0]">
                {saving ? "Uploading..." : "Continue"}
              </div>
            </button>
          </>
        ) : (
          <div className="pt-6 text-center">
            <div className="animate-[revealPot_0.6s_ease-out_1.2s_both] border border-accent/30 bg-background p-5 opacity-0">

              <div className="mb-2 font-mono text-[7px] tracking-[3px] text-danger uppercase">
                STEP 3 OF 3 · DIVISION ASSIGNMENT
              </div>
              <div className="mb-2 font-mono text-[8px] tracking-[3px] text-accent">
                YOU HAVE BEEN ASSIGNED TO
              </div>
              <div className="mb-3.5 h-0.5 bg-accent/25" />
              <div className="flex justify-center">
                <MascotAvatar
                  url={houseMeta.mascot}
                  name={houseMeta.name}
                  size={64}
                  color={houseMeta.color}
                />
              </div>
              <div
                className="mt-2.5 mb-1 text-center font-display text-[20px] leading-[1.3]"
                style={{ color: houseMeta.color }}
              >
                {houseMeta.name}
              </div>
              <div
                className="mb-1.5 text-center font-mono text-[13px] tracking-[2px] opacity-80"
                style={{ color: houseMeta.color }}
              >
                {houseMeta.tagline}
              </div>
              <div className="mb-1 font-serif text-[14px] italic text-muted">
                {houseMeta.desc}
              </div>
              <button
                onClick={() => setClosing(true)}
                className="mt-2 w-full cursor-pointer border-none bg-accent p-3.5 text-center"
              >
                <div className="font-display text-[13px] tracking-[2px] text-background">
                  Enter Division HQ
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

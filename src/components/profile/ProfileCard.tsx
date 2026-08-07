"use client";

import { HOUSE_META } from "@/lib/constants/houses";
import { cn } from "@/lib/utils";
import type { PublicStudent } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaInstagram, FaDiscord } from "react-icons/fa";
import { FaLine } from "react-icons/fa6";
import { PhotoViewer } from "@/components/profile/PhotoViewer";

type ProfileCardStudent = Pick<
  PublicStudent,
  | "id"
  | "studentId"
  | "role"
  | "displayName"
  | "nickname"
  | "profileUrl"
  | "house"
  | "instagram"
  | "discord"
  | "line"
  | "nationality"
>;

type ProfileCardProps = {
  student: ProfileCardStudent;
  editable?: boolean;
};

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png"]);

const roleLabels: Record<ProfileCardStudent["role"], string> = {
  junior: "JUNIOR",
  senior: "SENIOR",
  house_leader: "HOUSE LEADER",
};

function ContactRow({
  label,
  value,
  icon,
  background,
  editing,
  onChange,
  buildHref,
}: {
  label: string;
  value: string | null;
  icon: React.ReactNode;
  background: string;
  editing?: boolean;
  onChange?: (value: string) => void;
  buildHref?: (value: string) => string;
}) {
  const displayValue = value?.trim();
  const isEmpty = !editing && !displayValue;
  const href =
    !editing && displayValue && buildHref ? buildHref(displayValue) : undefined;

  const rowClassName = cn(
    "w-full flex items-center gap-2 bg-surface border border-dark/10 p-2 min-[440px]:p-3 min-w-0 text-accent rounded-sm",
    isEmpty && "border-dashed cursor-not-allowed",
    href &&
      "cursor-pointer transition-colors hover:bg-accent/5 hover:border-accent/30",
  );

  const rowContent = (
    <>
      <div
        className={cn(
          "w-8 h-8 min-[440px]:w-6 min-[440px]:h-6 rounded-md shrink-0 flex items-center justify-center text-white text-[17px] min-[440px]:text-[13px]",
          isEmpty && "grayscale opacity-50",
        )}
        style={{ background }}
      >
        {icon}
      </div>
      {editing ? (
        <input
          type="text"
          value={value ?? ""}
          onChange={(event) => onChange?.(event.target.value)}
          maxLength={50}
          placeholder={label.toLowerCase()}
          aria-label={label}
          className="w-full min-w-0 bg-transparent border-b border-accent/40 outline-none px-0.5 text-[16px] min-[440px]:text-[14px] text-foreground caret-[#A86A2A] placeholder:text-muted-fg"
        />
      ) : (
        <div
          className={`-mt-0.5 min-w-0 flex-1 text-[16px] min-[440px]:text-[14px] truncate ${isEmpty ? "text-muted-fg" : "text-foreground"}`}
          aria-label={label}
        >
          {displayValue || "-"}
        </div>
      )}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${label}: ${displayValue}`}
        className={rowClassName}
      >
        {rowContent}
      </a>
    );
  }

  return <div className={rowClassName}>{rowContent}</div>;
}

function EditIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      className="min-[440px]:w-[13px] min-[440px]:h-[13px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      className="min-[440px]:w-[13px] min-[440px]:h-[13px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

function CancelIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      className="min-[440px]:w-[13px] min-[440px]:h-[13px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      className="min-[440px]:w-[13px] min-[440px]:h-[13px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      className="min-[440px]:w-[18px] min-[440px]:h-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 7h3l1.5-2h7L17 7h3v12H4z" />
      <circle cx="12" cy="13" r="3.2" />
    </svg>
  );
}

function ProfilePhoto({
  profileUrl,
  hasPhoto,
  editing,
  onPickPhoto,
  onView,
}: {
  profileUrl: string;
  hasPhoto: boolean;
  editing: boolean;
  onPickPhoto?: () => void;
  onView?: () => void;
}) {
  return (
    <div className="relative shrink-0">
      <div
        className="size-20 flex items-center justify-center relative overflow-hidden bg-background border-2 border-accent"
        style={{
          backgroundImage: `url("${profileUrl}")`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <div className="absolute top-[3px] left-[3px] w-2 h-2 border-t-[1.5px] border-l-[1.5px] border-accent" />
        <div className="absolute top-[3px] right-[3px] w-2 h-2 border-t-[1.5px] border-r-[1.5px] border-accent" />
        <div className="absolute bottom-[3px] left-[3px] w-2 h-2 border-b-[1.5px] border-l-[1.5px] border-accent" />
        <div className="absolute bottom-[3px] right-[3px] w-2 h-2 border-b-[1.5px] border-r-[1.5px] border-accent" />

        {editing && onPickPhoto && (
          <button
            type="button"
            onClick={onPickPhoto}
            aria-label="Change profile photo"
            className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-1 bg-dark/45 text-background cursor-pointer transition-colors hover:bg-dark/55"
          >
            <CameraIcon />
            <span className="text-[10px] tracking-[1.5px] font-mono">
              {hasPhoto ? "CHANGE" : "ADD"}
            </span>
          </button>
        )}
        {!editing && onView && (
          <button
            type="button"
            onClick={onView}
            aria-label={`View full-size photo${hasPhoto ? "" : " placeholder"}`}
            className="absolute inset-0 z-10 cursor-pointer transition-colors hover:bg-dark/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          />
        )}
      </div>
      <div
        className={cn(
          "absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 whitespace-nowrap",
          hasPhoto ? "bg-success" : "bg-danger",
        )}
      >
        <div
          className={cn(
            "text-[9px] tracking-[2px] font-mono",
            hasPhoto ? "text-[#d0f0c0]" : "text-[#f0c0c0]",
          )}
        >
          {hasPhoto ? "VERIFIED" : "UNVERIFIED"}
        </div>
      </div>
    </div>
  );
}

export function ProfileCard({ student, editable = false }: ProfileCardProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentStudent, setCurrentStudent] = useState(student);
  const [editing, setEditing] = useState(false);
  const [nickname, setNickname] = useState(student.nickname ?? "");
  const [instagram, setInstagram] = useState(student.instagram ?? "");
  const [discord, setDiscord] = useState(student.discord ?? "");
  const [line, setLine] = useState(student.line ?? "");
  const [pendingProfilePic, setPendingProfilePic] = useState<string | null>(
    null,
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [confirmingLogout, setConfirmingLogout] = useState(false);
  const [viewingPhoto, setViewingPhoto] = useState(false);
  const logoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!confirmingLogout) return;
    function handleClickOutside(event: MouseEvent) {
      if (!logoutRef.current?.contains(event.target as Node)) {
        setConfirmingLogout(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [confirmingLogout]);

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.push("/");
      router.refresh();
    }
  }

  const house = HOUSE_META[currentStudent.house];
  const displayedNickname = editing ? nickname : currentStudent.nickname;
  const alias = displayedNickname?.trim() || "—";
  const nationality =
    currentStudent.nationality?.trim() || "Nationality undisclosed";
  const displayedProfileUrl = pendingProfilePic ?? currentStudent.profileUrl;

  function startEditing() {
    setNickname(currentStudent.nickname ?? "");
    setInstagram(currentStudent.instagram ?? "");
    setDiscord(currentStudent.discord ?? "");
    setLine(currentStudent.line ?? "");
    setPendingProfilePic(null);
    setError(null);
    setEditing(true);
  }

  function cancelEditing() {
    setNickname(currentStudent.nickname ?? "");
    setInstagram(currentStudent.instagram ?? "");
    setDiscord(currentStudent.discord ?? "");
    setLine(currentStudent.line ?? "");
    setPendingProfilePic(null);
    setError(null);
    setEditing(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
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
      setPendingProfilePic(reader.result);
      setError(null);
    };
    reader.readAsDataURL(file);
  }

  async function saveChanges() {
    if (saving) return;

    const trimmedNickname = nickname.trim();
    const currentNickname = currentStudent.nickname?.trim() ?? "";
    const nicknameChanged = trimmedNickname !== currentNickname;
    if (
      nicknameChanged &&
      (trimmedNickname.length < 2 || trimmedNickname.length > 30)
    ) {
      setError("Nickname must be between 2 and 30 characters.");
      return;
    }

    const body: {
      nickname?: string;
      profilePic?: string;
      instagram?: string;
      discord?: string;
      line?: string;
    } = {};
    if (nicknameChanged) body.nickname = trimmedNickname;
    if (pendingProfilePic) body.profilePic = pendingProfilePic;

    const trimmedInstagram = instagram.trim();
    if (trimmedInstagram !== (currentStudent.instagram?.trim() ?? "")) {
      body.instagram = trimmedInstagram;
    }
    const trimmedDiscord = discord.trim();
    if (trimmedDiscord !== (currentStudent.discord?.trim() ?? "")) {
      body.discord = trimmedDiscord;
    }
    const trimmedLine = line.trim();
    if (trimmedLine !== (currentStudent.line?.trim() ?? "")) {
      body.line = trimmedLine;
    }

    if (Object.keys(body).length === 0) {
      setEditing(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const response = await fetch(`/api/students/${currentStudent.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) {
        setError(result?.error ?? "Failed to update profile.");
        return;
      }

      setCurrentStudent(result as ProfileCardStudent);
      setNickname((result as ProfileCardStudent).nickname ?? "");
      setInstagram((result as ProfileCardStudent).instagram ?? "");
      setDiscord((result as ProfileCardStudent).discord ?? "");
      setLine((result as ProfileCardStudent).line ?? "");
      setPendingProfilePic(null);
      setEditing(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      setError("Network error — please try again.");
    } finally {
      setSaving(false);
    }
  }

  const contactFields = [
    {
      key: "instagram",
      label: "INSTAGRAM",
      icon: <FaInstagram />,
      background:
        "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",
      value: instagram,
      onChange: setInstagram,
      buildHref: (handle: string) =>
        `https://instagram.com/${handle.replace(/^@/, "")}`,
    },
    {
      key: "line",
      label: "LINE",
      icon: <FaLine />,
      background: "#00B900",
      value: line,
      onChange: setLine,
      buildHref: (id: string) =>
        `https://line.me/ti/p/~${id.replace(/^~/, "")}`,
    },
    {
      key: "discord",
      label: "DISCORD",
      icon: <FaDiscord />,
      background: "#5865F2",
      value: discord,
      onChange: setDiscord,
      buildHref: undefined,
    },
  ];

  return (
    <section className="relative overflow-hidden max-w-content mx-auto">
      <div className="absolute top-1/2 -right-5 -translate-y-1/2 -rotate-[35deg] font-display text-[40px] whitespace-nowrap pointer-events-none tracking-[4px] text-accent/10">
        CLASSIFIED
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png"
        onChange={handlePhotoChange}
        className="hidden"
        tabIndex={-1}
      />

      <div className="mb-3.5 relative flex items-center justify-between gap-3 flex-wrap">
        <div className="text-[10px] text-danger tracking-[2px] uppercase font-mono whitespace-nowrap">
          AGENT DOSSIER · {editing ? "EDITING" : "READ ONLY"}
        </div>
        {editable && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {editing ? (
              <>
                <button
                  type="button"
                  onClick={cancelEditing}
                  disabled={saving}
                  aria-label="Cancel"
                  title="Cancel"
                  className="w-11 h-11 min-[440px]:w-6.5 min-[440px]:h-6.5 flex items-center justify-center border border-dark/25 text-muted cursor-pointer transition-colors hover:bg-dark/5 disabled:opacity-60"
                >
                  <CancelIcon />
                </button>
                <button
                  type="button"
                  onClick={saveChanges}
                  disabled={saving}
                  aria-label={saving ? "Saving..." : "Save file"}
                  title={saving ? "Saving..." : "Save file"}
                  className="w-11 h-11 min-[440px]:w-6.5 min-[440px]:h-6.5 flex items-center justify-center border border-blue-600 bg-blue-600/15 text-blue-600 cursor-pointer transition-colors hover:bg-blue-600/25 disabled:opacity-60"
                >
                  <SaveIcon />
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={startEditing}
                aria-label="Edit file"
                title="Edit file"
                className="w-11 h-11 min-[440px]:w-6.5 min-[440px]:h-6.5 flex items-center justify-center border border-accent/35 bg-accent/8 text-accent cursor-pointer transition-colors hover:bg-accent/15"
              >
                <EditIcon />
              </button>
            )}
            <div className="w-px h-4 bg-dark/15 mx-0.5" />
            <div className="relative" ref={logoutRef}>
              <button
                type="button"
                onClick={() => setConfirmingLogout((v) => !v)}
                disabled={loggingOut}
                aria-label="Log out"
                aria-expanded={confirmingLogout}
                title={loggingOut ? "Logging out..." : "Log out"}
                className="w-11 h-11 min-[440px]:w-6.5 min-[440px]:h-6.5 flex items-center justify-center border border-danger/45 text-danger cursor-pointer transition-colors hover:bg-danger/10 disabled:opacity-60"
              >
                <LogoutIcon />
              </button>
              {confirmingLogout && (
                <div className="absolute top-8 right-0 z-10 bg-background border border-dark/15 shadow-lg p-3">
                  <div className="text-[11px] text-muted mb-2.5 leading-snug">
                    Log out of this session?
                  </div>
                  <div className="flex items-center justify-between gap-1.5">
                    <button
                      type="button"
                      onClick={() => setConfirmingLogout(false)}
                      className="px-3.5 py-2.5 min-[440px]:px-2.5 min-[440px]:py-1 text-[11px] tracking-[1.5px] font-mono uppercase text-muted cursor-pointer border border-dark/25 hover:bg-dark/5"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="px-3.5 py-2.5 min-[440px]:px-2.5 min-[440px]:py-1 text-[11px] tracking-[1.5px] font-mono uppercase text-white bg-danger border border-danger cursor-pointer disabled:opacity-60 text-nowrap"
                    >
                      {loggingOut ? "..." : "Log out"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4 items-start relative">
        <ProfilePhoto
          profileUrl={displayedProfileUrl ?? "/detective-conan-pfp.png"}
          hasPhoto={Boolean(displayedProfileUrl)}
          editing={editing}
          onPickPhoto={() => fileInputRef.current?.click()}
          onView={() => setViewingPhoto(true)}
        />
        <PhotoViewer
          open={viewingPhoto}
          onClose={() => setViewingPhoto(false)}
          profileUrl={displayedProfileUrl ?? "/detective-conan-pfp.png"}
          alias={alias}
          hasPhoto={Boolean(displayedProfileUrl)}
          studentId={currentStudent.id}
        />

        <div className="flex-1 min-w-0">
          <h1 className="font-display text-[17px] text-foreground leading-tight mb-1 break-words m-0">
            {editing ? (
              <input
                type="text"
                value={nickname}
                onChange={(event) => setNickname(event.target.value)}
                maxLength={30}
                placeholder="alias"
                aria-label="Alias / nickname"
                className="w-full bg-transparent border-b border-accent/40 outline-none px-0.5 font-display text-[17px] text-foreground caret-[#A86A2A] placeholder:text-muted-fg"
              />
            ) : (
              alias
            )}
          </h1>
          <div className="text-[13px] text-accent mb-1 tracking-[1px]">
            {currentStudent.displayName}
          </div>
          <div className="mb-2.5 font-mono text-[11px] text-muted tracking-[1.5px]">
            ID · {currentStudent.studentId}
          </div>
          <div className="flex gap-1.5 flex-wrap mb-2.5">
            <div
              className="px-2 py-0.5 text-[10px] tracking-[1px] font-mono"
              style={{
                background: `${house.color}1A`,
                border: `1px solid ${house.color}4D`,
                color: house.color,
              }}
            >
              {house.name.toUpperCase()}
            </div>
            <div className="px-2 py-0.5 bg-danger/8 border border-danger/25 text-[10px] text-danger tracking-[1px] font-mono">
              {roleLabels[currentStudent.role]}
            </div>
          </div>
          {/*<div className="text-xs text-muted tracking-[1px]">{nationality}</div>*/}
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-danger/6 border border-danger/20 px-3 py-2 text-[12px] text-danger">
          {error}
        </div>
      )}

      <div className="mt-4.5 pt-4 border-t border-dark/8 relative">
        <div className="text-[10px] text-muted-fg tracking-[3px] uppercase mb-3 font-mono">
          CONTACT CHANNELS
        </div>
        <div
          className={
            editing ? "grid grid-cols-1 sm:grid-cols-3 gap-2" : "flex gap-2"
          }
        >
          {contactFields.map(
            ({ key, label, icon, background, value, onChange, buildHref }) => (
              <ContactRow
                key={key}
                label={label}
                value={
                  editing
                    ? value
                    : currentStudent[key as keyof typeof currentStudent]
                }
                editing={editing}
                onChange={onChange}
                icon={icon}
                background={background}
                buildHref={buildHref}
              />
            ),
          )}
        </div>
      </div>
    </section>
  );
}

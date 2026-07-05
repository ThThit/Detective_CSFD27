"use client";

import { HOUSE_META } from "@/lib/constants/houses";
import type { PublicStudent } from "@/types";
import { useRef, useState } from "react";

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

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
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
}: {
  label: string;
  value: string | null;
  icon: React.ReactNode;
  background: string;
}) {
  const displayValue = value?.trim() || "—";

  return (
    <div className="flex items-center gap-2.5 bg-background border border-dark/10 px-3 py-2.5">
      <div
        className="w-6 h-6 rounded-[6px] shrink-0 flex items-center justify-center text-white font-bold font-sans text-[10px]"
        style={{ background }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-[8px] text-muted-fg tracking-[1px] mb-0.5 font-mono">
          {label}
        </div>
        <div
          className={`text-[14px] break-words ${displayValue === "—" ? "text-muted-fg" : "text-foreground"}`}
        >
          {displayValue}
        </div>
      </div>
    </div>
  );
}

function CameraIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
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
  editing,
  onPickPhoto,
}: {
  profileUrl: string | null;
  editing: boolean;
  onPickPhoto?: () => void;
}) {
  return (
    <div className="relative shrink-0">
      <div
        className="size-20 flex items-center justify-center relative overflow-hidden bg-background border-2 border-accent"
        style={{
          backgroundImage: profileUrl ? `url("${profileUrl}")` : undefined,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        {!profileUrl && (
          <div className="text-[8px] text-muted-fg text-center leading-[1.4] font-mono">
            PROFILE
            <br />
            PHOTO
          </div>
        )}
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
            <span className="text-[7px] tracking-[1.5px] font-mono">
              {profileUrl ? "CHANGE" : "ADD"}
            </span>
          </button>
        )}
      </div>
      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-success px-1.5 py-0.5 whitespace-nowrap">
        <div className="text-[6px] text-[#d0f0c0] tracking-[2px] font-mono">
          VERIFIED
        </div>
      </div>
    </div>
  );
}

export function ProfileCard({ student, editable = false }: ProfileCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentStudent, setCurrentStudent] = useState(student);
  const [editing, setEditing] = useState(false);
  const [nickname, setNickname] = useState(student.nickname ?? "");
  const [pendingProfilePic, setPendingProfilePic] = useState<string | null>(
    null,
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const house = HOUSE_META[currentStudent.house];
  const displayedNickname = editing ? nickname : currentStudent.nickname;
  const alias = displayedNickname?.trim() || "—";
  const nationality =
    currentStudent.nationality?.trim() || "Nationality undisclosed";
  const displayedProfileUrl = pendingProfilePic ?? currentStudent.profileUrl;

  function startEditing() {
    setNickname(currentStudent.nickname ?? "");
    setPendingProfilePic(null);
    setError(null);
    setEditing(true);
  }

  function cancelEditing() {
    setNickname(currentStudent.nickname ?? "");
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
      setError("Image is too large (max 2MB).");
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

    const body: { nickname?: string; profilePic?: string } = {};
    if (nicknameChanged) body.nickname = trimmedNickname;
    if (pendingProfilePic) body.profilePic = pendingProfilePic;

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
      setPendingProfilePic(null);
      setEditing(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      setError("Network error — please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="bg-surface relative overflow-hidden max-w-content mx-auto">
      <div className="absolute top-1/2 -right-5 -translate-y-1/2 -rotate-[35deg] font-display text-[40px] whitespace-nowrap pointer-events-none tracking-[4px] text-accent/5">
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

      <div className="mb-3.5 relative flex items-center justify-between gap-3">
        <div className="text-[7px] text-danger tracking-[4px] uppercase font-mono">
          AGENT DOSSIER · {editing ? "EDITING" : "READ ONLY"}
        </div>
        {editable && (
          <div className="flex items-center gap-2">
            {editing && (
              <button
                type="button"
                onClick={cancelEditing}
                disabled={saving}
                className="px-2 py-[5px] text-[9px] text-muted tracking-[2px] font-mono cursor-pointer disabled:opacity-60"
              >
                CANCEL
              </button>
            )}
            <button
              type="button"
              onClick={editing ? saveChanges : startEditing}
              disabled={saving}
              aria-label={editing ? "Save file" : "Edit file"}
              className={`px-3 py-[5px] border text-[9px] tracking-[2px] font-mono transition-colors disabled:opacity-60 ${
                editing
                  ? "border-accent bg-accent/15 text-accent cursor-pointer"
                  : "border-accent/35 bg-accent/8 text-accent cursor-pointer"
              }`}
            >
              {saving ? "SAVING..." : editing ? "SAVE FILE" : "EDIT FILE"}
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-4 items-start relative">
        <ProfilePhoto
          profileUrl={displayedProfileUrl}
          editing={editing}
          onPickPhoto={() => fileInputRef.current?.click()}
        />

        <div className="flex-1 min-w-0">
          <h1 className="font-display text-[17px] text-foreground leading-tight mb-1 break-words m-0">
            {currentStudent.displayName}
          </h1>
          <div className="text-[13px] text-accent mb-2.5 tracking-[1px]">
            {editing ? (
              <span className="flex items-baseline gap-1">
                Alias:
                <input
                  type="text"
                  value={nickname}
                  onChange={(event) => setNickname(event.target.value)}
                  maxLength={30}
                  placeholder="alias"
                  aria-label="Alias / nickname"
                  className="flex-1 min-w-0 bg-transparent border-b border-accent/40 outline-none px-0.5 text-[13px] font-semibold text-accent caret-[#A86A2A] placeholder:text-accent/40"
                />
              </span>
            ) : (
              <>
                Alias: <strong>{alias}</strong>
              </>
            )}
          </div>
          <div className="flex gap-1.5 flex-wrap mb-2.5">
            <div
              className="px-2 py-0.5 text-[8px] tracking-[1px] font-mono"
              style={{
                background: `${house.color}1A`,
                border: `1px solid ${house.color}4D`,
                color: house.color,
              }}
            >
              {house.name.toUpperCase()}
            </div>
            <div className="px-2 py-0.5 bg-danger/8 border border-danger/25 text-[8px] text-danger tracking-[1px] font-mono">
              {roleLabels[currentStudent.role]}
            </div>
          </div>
          <div className="text-xs text-muted tracking-[1px]">{nationality}</div>
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-danger/6 border border-danger/20 px-3 py-2 text-[12px] text-danger">
          {error}
        </div>
      )}

      <div className="mt-4.5 pt-4 border-t border-dark/8 relative">
        <div className="text-[8px] text-muted-fg tracking-[3px] uppercase mb-3 font-mono">
          CONTACT CHANNELS
        </div>
        <div className="flex flex-col gap-2">
          <ContactRow
            label="INSTAGRAM"
            value={currentStudent.instagram}
            icon={
              <div className="w-2.5 h-2.5 rounded-[3px] border-[1.5px] border-white" />
            }
            background="linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)"
          />
          <ContactRow
            label="DISCORD"
            value={currentStudent.discord}
            icon="D"
            background="#5865F2"
          />
          <ContactRow
            label="LINE"
            value={currentStudent.line}
            icon="L"
            background="#00B900"
          />
        </div>
      </div>
    </section>
  );
}

"use client";

import { HOUSE_META } from "@/lib/constants/houses";
import type { PublicStudent } from "@/types";

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

type EditableField =
  | "nickname"
  | "nationality"
  | "instagram"
  | "discord"
  | "line";

type ProfileCardProps = {
  student: ProfileCardStudent;
  /** Click handler for the EDIT FILE / SAVE FILE toggle (own-profile page). */
  onEdit?: () => void;
  /** Flips the dossier into in-place edit mode. */
  editMode?: boolean;
  /** Disables the toggle and shows a saving label while a PATCH is in flight. */
  saving?: boolean;
  /** Called as the user types into an editable field (edit mode only). */
  onFieldChange?: (field: EditableField, value: string) => void;
  /** Called when the user taps the photo to pick/crop a new picture. */
  onPickPhoto?: () => void;
};

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
  placeholder,
}: {
  label: string;
  value: string | null;
  icon: React.ReactNode;
  background: string;
  editing: boolean;
  onChange?: (value: string) => void;
  placeholder?: string;
}) {
  const displayValue = value?.trim() || "—";

  return (
    <div
      className={`flex items-center gap-2.5 bg-background border px-3 py-2.5 transition-colors ${
        editing ? "border-accent/30" : "border-dark/10"
      }`}
    >
      <div
        className="w-6 h-6 rounded-[6px] shrink-0 flex items-center justify-center text-white font-bold font-sans text-[10px]"
        style={{ background }}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[8px] text-muted-fg tracking-[1px] mb-0.5 font-mono">
          {label}
        </div>
        {editing && onChange ? (
          <input
            type="text"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            aria-label={label}
            className="w-full bg-transparent border-none outline-none p-0 text-[14px] text-foreground caret-[#A86A2A] placeholder:text-muted-fg/70"
          />
        ) : (
          <div
            className={`text-[14px] break-words ${displayValue === "—" ? "text-muted-fg" : "text-foreground"}`}
          >
            {displayValue}
          </div>
        )}
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
  student,
  editMode,
  onPickPhoto,
}: {
  student: ProfileCardStudent;
  editMode: boolean;
  onPickPhoto?: () => void;
}) {
  return (
    <div className="relative shrink-0">
      <div
        className="w-20 flex items-center justify-center relative overflow-hidden bg-background border-2 border-accent"
        style={{
          height: 96,
          backgroundImage: student.profileUrl
            ? `url("${student.profileUrl}")`
            : undefined,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        {!student.profileUrl && (
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

        {editMode && onPickPhoto && (
          <button
            type="button"
            onClick={onPickPhoto}
            aria-label="Change profile photo"
            className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-1 bg-dark/45 text-background cursor-pointer transition-colors hover:bg-dark/55"
          >
            <CameraIcon />
            <span className="text-[7px] tracking-[1.5px] font-mono">
              {student.profileUrl ? "CHANGE" : "ADD"}
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

export function ProfileCard({
  student,
  onEdit,
  editMode = false,
  saving = false,
  onFieldChange,
  onPickPhoto,
}: ProfileCardProps) {
  const house = HOUSE_META[student.house];
  const alias = student.nickname?.trim() || "—";
  const nationality = student.nationality?.trim() || "Nationality undisclosed";
  const editing = editMode && Boolean(onFieldChange);

  return (
    <section className="bg-surface relative overflow-hidden max-w-content mx-auto p-5">
      <div className="absolute top-1/2 -right-5 -translate-y-1/2 -rotate-[35deg] font-display text-[40px] whitespace-nowrap pointer-events-none tracking-[4px] text-accent/5">
        CLASSIFIED
      </div>

      <div className="mb-3.5 relative flex items-center justify-between">
        <div className="text-[7px] text-danger tracking-[4px] uppercase font-mono">
          AGENT DOSSIER · {editMode ? "EDITING" : "READ ONLY"}
        </div>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            disabled={saving}
            aria-label={editMode ? "Save file" : "Edit file"}
            className={`px-3 py-[5px] border text-[9px] tracking-[2px] font-mono transition-colors disabled:opacity-60 ${
              editMode
                ? "border-accent bg-accent/15 text-accent cursor-pointer"
                : "border-dark/15 bg-transparent text-muted hover:text-accent hover:border-accent/35 cursor-pointer"
            }`}
          >
            {saving ? "SAVING..." : editMode ? "SAVE FILE" : "EDIT FILE"}
          </button>
        )}
      </div>

      <div className="flex gap-4 items-start relative">
        <ProfilePhoto
          student={student}
          editMode={editMode}
          onPickPhoto={onPickPhoto}
        />

        <div className="flex-1 min-w-0">
          <h1 className="font-display text-[17px] text-foreground leading-tight mb-1 break-words m-0">
            {student.displayName}
          </h1>
          <div className="text-[13px] text-accent mb-2.5 tracking-[1px]">
            {editing ? (
              <span className="flex items-baseline gap-1">
                Alias:
                <input
                  type="text"
                  value={student.nickname ?? ""}
                  onChange={(e) => onFieldChange?.("nickname", e.target.value)}
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
              {roleLabels[student.role]}
            </div>
          </div>
          {editing ? (
            <input
              type="text"
              value={student.nationality ?? ""}
              onChange={(e) => onFieldChange?.("nationality", e.target.value)}
              placeholder="Nationality"
              aria-label="Nationality"
              className="w-full bg-transparent border-b border-accent/40 outline-none px-0.5 text-xs text-muted tracking-[1px] caret-[#A86A2A] placeholder:text-muted/50"
            />
          ) : (
            <div className="text-xs text-muted tracking-[1px]">{nationality}</div>
          )}
        </div>
      </div>

      <div className="mt-4.5 pt-4 border-t border-dark/8 relative">
        <div className="text-[8px] text-muted-fg tracking-[3px] uppercase mb-3 font-mono">
          CONTACT CHANNELS
        </div>
        <div className="flex flex-col gap-2">
          <ContactRow
            label="INSTAGRAM"
            value={student.instagram}
            editing={editMode}
            onChange={onFieldChange && ((v) => onFieldChange("instagram", v))}
            placeholder="@username"
            icon={
              <div className="w-2.5 h-2.5 rounded-[3px] border-[1.5px] border-white" />
            }
            background="linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)"
          />
          <ContactRow
            label="DISCORD"
            value={student.discord}
            editing={editMode}
            onChange={onFieldChange && ((v) => onFieldChange("discord", v))}
            placeholder="username"
            icon="D"
            background="#5865F2"
          />
          <ContactRow
            label="LINE"
            value={student.line}
            editing={editMode}
            onChange={onFieldChange && ((v) => onFieldChange("line", v))}
            placeholder="LINE ID"
            icon="L"
            background="#00B900"
          />
        </div>
      </div>
    </section>
  );
}

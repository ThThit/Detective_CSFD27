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

type ProfileCardProps = {
  student: ProfileCardStudent;
  onEdit?: () => void;
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

function ProfilePhoto({ student }: { student: ProfileCardStudent }) {
  return (
    <div className="relative shrink-0">
      <div
        className="w-20 flex items-center justify-center relative overflow-hidden bg-background border-2 border-accent/30"
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
        <div className="absolute top-[3px] left-[3px] w-2 h-2 border-t-[1.5px] border-l-[1.5px] border-accent/45" />
        <div className="absolute top-[3px] right-[3px] w-2 h-2 border-t-[1.5px] border-r-[1.5px] border-accent/45" />
        <div className="absolute bottom-[3px] left-[3px] w-2 h-2 border-b-[1.5px] border-l-[1.5px] border-accent/45" />
        <div className="absolute bottom-[3px] right-[3px] w-2 h-2 border-b-[1.5px] border-r-[1.5px] border-accent/45" />
      </div>
      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-success px-1.5 py-0.5 whitespace-nowrap">
        <div className="text-[6px] text-[#d0f0c0] tracking-[2px] font-mono">
          VERIFIED
        </div>
      </div>
    </div>
  );
}

export function ProfileCard({ student, onEdit }: ProfileCardProps) {
  const house = HOUSE_META[student.house];
  const alias = student.nickname?.trim() || "—";
  const nationality = student.nationality?.trim() || "Nationality undisclosed";

  return (
    <section className="bg-surface border-b border-dark/10d pb-5 relative overflow-hidden max-w-content mx-auto">
      <div className="absolute top-1/2 -right-5 -translate-y-1/2 -rotate-[35deg] font-display text-[40px] whitespace-nowrap pointer-events-none tracking-[4px] text-accent/5">
        CLASSIFIED
      </div>

      <div className="mb-3.5 relative flex items-center justify-between">
        <div className="text-[7px] text-danger tracking-[4px] uppercase font-mono">
          AGENT DOSSIER · READ ONLY
        </div>
        {onEdit && (
          <button
            type="button"
            aria-label="Edit file"
            className="px-3 py-[5px] border border-accent/35 bg-accent/8 text-[9px] text-accent tracking-[2px] cursor-default font-mono"
          >
            EDIT FILE
          </button>
        )}
      </div>

      <div className="flex gap-4 items-start relative">
        <ProfilePhoto student={student} />

        <div className="flex-1 min-w-0">
          <h1 className="font-display text-[17px] text-foreground leading-tight mb-1 break-words m-0">
            {student.displayName}
          </h1>
          <div className="text-[13px] text-accent mb-2.5 tracking-[1px]">
            Alias: <strong>{alias}</strong>
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
          <div className="text-xs text-muted tracking-[1px]">{nationality}</div>
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
            icon={
              <div className="w-2.5 h-2.5 rounded-[3px] border-[1.5px] border-white" />
            }
            background="linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)"
          />
          <ContactRow
            label="DISCORD"
            value={student.discord}
            icon="D"
            background="#5865F2"
          />
          <ContactRow
            label="LINE"
            value={student.line}
            icon="L"
            background="#00B900"
          />
        </div>
      </div>
    </section>
  );
}

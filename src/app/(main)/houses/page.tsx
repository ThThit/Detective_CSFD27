import { FileItem } from "@/components/house/FileItem";
import { MascotLogo } from "@/components/house/MascotLogo";
import { OnboardingOverlay } from "@/components/house/OnboardingOverlay";
import { db } from "@/db";
import { student } from "@/db/schema";
import { getSessionData } from "@/lib/auth";
import { HOUSE_META, HOUSES, type House } from "@/lib/constants/houses";
import { and, eq, isNull } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function HousesPage() {
  const session = await getSessionData();
  if (!session) redirect("/api/auth/login");

  const [userRows, ...houseCounts] = await Promise.all([
    db.select().from(student).where(eq(student.id, session.userId)),
    ...HOUSES.map((house) =>
      db
        .select({ id: student.id })
        .from(student)
        .where(and(eq(student.house, house), isNull(student.deletedAt))),
    ),
  ]);

  const user = userRows[0];
  if (!user) redirect("/api/auth/login");

  if (Date.now() - user.updatedAt.getTime() > 60_000) {
    await db
      .update(student)
      .set({ updatedAt: new Date() })
      .where(eq(student.id, user.id));
  }

  const memberCounts = Object.fromEntries(
    HOUSES.map((house, i) => [house, houseCounts[i].length]),
  ) as Record<House, number>;

  const grid = (
    <div className="mx-auto w-full max-w-[720px] px-6">
      <div className="relative border-b border-[rgba(47,36,31,0.08)] pb-[22px] pt-7">
        {/*<div className="absolute right-0 top-1">
          <InkStamp>Confidential</InkStamp>
        </div>*/}

        <div className="mb-2 text-[11px] uppercase tracking-[4px] text-[#8b2020] [font-family:var(--font-special-elite),monospace]">
          Detective Divisions
        </div>
        <div className="mb-2.5 text-[26px] leading-[1.25] text-[#1C1A17] [font-family:var(--font-cinzel-decorative),serif]">
          Choose Your Division
        </div>
        <div className="text-base leading-[1.5] text-[#5C4E3E]">
          Four elite detective agencies. One mission. Find your senior
          operative.
        </div>
      </div>

      <div className="grid min-[440px]:grid-cols-2 gap-4 pb-8 pt-6">
        {HOUSES.map((house, index) => {
          const meta = HOUSE_META[house];
          const [r, g, b] = meta.rgb;

          return (
            <FileItem
              index={index}
              key={house}
              href={`/houses/${house}`}
              color={meta.color}
            >
              <div className="flex gap-3 items-center">
                <MascotLogo
                  url={meta.mascot}
                  name={meta.name}
                  size={60}
                  color={meta.color}
                />

                <div>
                  <div
                    className="text-sm leading-[1.3] [font-family:var(--font-cinzel-decorative),serif]"
                    style={{ color: meta.color }}
                  >
                    {meta.name}
                  </div>

                  <div className="mb-0.5 text-sm italic leading-[1.5] text-[#7A6A58] [font-family:var(--font-cormorant-garamond),serif]">
                    {meta.tagline}
                  </div>
                  <div
                    className="px-2 py-0.5 text-[8px] tracking-[1px] font-mono"
                    style={{
                      background: `rgba(${r},${g},${b},0.1)`,
                      border: `1px solid rgba(${r},${g},${b},0.3)`,
                      color: meta.color,
                    }}
                  >
                    {memberCounts[house]} AGENTS
                  </div>
                </div>
              </div>
            </FileItem>
          );
        })}
      </div>
    </div>
  );

  if (user.nickname === null) {
    return (
      <OnboardingOverlay userHouse={user.house as House}>
        {grid}
      </OnboardingOverlay>
    );
  }

  return <div className="flex-1 overflow-y-auto">{grid}</div>;
}

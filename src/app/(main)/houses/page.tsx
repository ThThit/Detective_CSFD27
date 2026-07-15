import { redirect } from "next/navigation";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { student } from "@/db/schema";
import { getSessionData } from "@/lib/auth";
import { HOUSE_META, HOUSES, type House } from "@/lib/constants/houses";
import { HouseCard } from "@/components/house/HouseCard";
import { OnboardingOverlay } from "@/components/house/OnboardingOverlay";
import { InkStamp } from "@/components/ui/InkStamp";

export default async function HousesPage() {
  const session = await getSessionData();
  if (!session) redirect("/login");

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
  if (!user) redirect("/login");

  const memberCounts = Object.fromEntries(
    HOUSES.map((house, i) => [house, houseCounts[i].length]),
  ) as Record<House, number>;

  const grid = (
    <div
      style={{
        width: "100%",
        maxWidth: 720,
        margin: "0 auto",
        padding: "0 24px",
      }}
    >
      <div
        style={{
          padding: "28px 0 22px",
          borderBottom: "1px solid rgba(47,36,31,0.08)",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", top: 4, right: 0 }}>
          <InkStamp>Confidential</InkStamp>
        </div>

        <div
          style={{
            fontSize: 11,
            color: "#8b2020",
            letterSpacing: 4,
            textTransform: "uppercase",
            marginBottom: 10,
            fontFamily: "var(--font-special-elite), monospace",
          }}
        >
          Detective Divisions
        </div>
        <div
          style={{
            fontFamily: "var(--font-cinzel-decorative), serif",
            fontSize: 26,
            color: "#1C1A17",
            lineHeight: 1.25,
            marginBottom: 10,
          }}
        >
          Choose Your Division
        </div>
        <div style={{ fontSize: 16, color: "#5C4E3E", lineHeight: 1.65 }}>
          Four elite detective agencies. One mission. Find your senior
          operative.
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          padding: "24px 0 32px",
        }}
      >
        {HOUSES.map((house) => (
          <HouseCard
            key={house}
            houseKey={house}
            memberCount={memberCounts[house]}
          />
        ))}
      </div>
    </div>
  );

  if (user.nickname === null) {
    return (
      <OnboardingOverlay userHouse={user.house as House}>{grid}</OnboardingOverlay>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: "auto" }}>
      {grid}
    </div>
  );
}

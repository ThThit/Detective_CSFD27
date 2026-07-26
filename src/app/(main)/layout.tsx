import { getSessionData } from "@/lib/auth";
import { BottomTabs } from "@/components/layout/bottom-tabs";
import { RouteTransition } from "@/components/layout/route-transition";
import { OnboardingOverlay } from "@/components/house/OnboardingOverlay";
import { db } from "@/db";
import { student } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { House } from "@/lib/constants/houses";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionData();
  const isAdmin = session?.isAdmin ?? false;

  const [user] = session
    ? await db.select().from(student).where(eq(student.id, session.userId))
    : [];
  const needsOnboarding =
    !!user && (user.nickname === null || user.nationality === null);

  return (
    <>
      <RouteTransition>{children}</RouteTransition>
      <BottomTabs isAdmin={isAdmin} />
      {needsOnboarding && user && (
        <OnboardingOverlay
          userHouse={user.house as House}
          initialNickname={user.nickname}
          initialNationality={user.nationality}
        />
      )}
    </>
  );
}
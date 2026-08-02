import { getSessionData } from "@/lib/auth";
import { getCurrentStudent } from "@/lib/current-student";
import { BottomTabs } from "@/components/layout/bottom-tabs";
import { RouteTransition } from "@/components/layout/route-transition";
import { OnboardingOverlay } from "@/components/house/OnboardingOverlay";
import type { House } from "@/lib/constants/houses";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionData();
  const isAdmin = session?.isAdmin ?? false;

  const user = await getCurrentStudent();
  const needsOnboarding =
    !!user &&
    (user.nickname === null ||
      user.nationality === null ||
      user.profileUrl === null);

  return (
    <>
      <RouteTransition>{children}</RouteTransition>
      <BottomTabs isAdmin={isAdmin} />
      {needsOnboarding && user && (
        <OnboardingOverlay
          userHouse={user.house as House}
          userId={user.id}
          initialNickname={user.nickname}
          initialNationality={user.nationality}
          initialProfileUrl={user.profileUrl}
        />
      )}
    </>
  );
}
import { getSessionData } from "@/lib/auth";
import { BottomTabs } from "@/components/layout/bottom-tabs";
import { RouteTransition } from "@/components/layout/route-transition";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionData();
  const isAdmin = session?.isAdmin ?? false;

  return (
    <>
      <RouteTransition>{children}</RouteTransition>
      <BottomTabs isAdmin={isAdmin} />
    </>
  );
}
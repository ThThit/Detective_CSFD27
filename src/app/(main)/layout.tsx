import { getSessionData } from "@/lib/auth";
import { BottomTabs } from "@/components/layout/bottom-tabs";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionData();
  const isAdmin = session?.isAdmin ?? false;

  return (
    <>
      {children}
      <BottomTabs isAdmin={isAdmin} />
    </>
  );
}
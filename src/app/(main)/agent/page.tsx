"use client";

import { ProfileCard } from "@/components/profile/ProfileCard";
import type { MeResponse } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function toProfileStudent(user: MeResponse) {
  return {
    id: user.id,
    studentId: user.studentId,
    role: user.role,
    displayName: user.displayName,
    nickname: user.nickname,
    profileUrl: user.profileUrl,
    house: user.house,
    instagram: user.instagram,
    discord: user.discord,
    line: user.line,
    nationality: user.nationality,
  };
}

export default function AgentPage() {
  const router = useRouter();
  const [user, setUser] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    fetch("/api/auth/me")
      .then(async (res) => {
        if (!res.ok) {
          router.replace("/login");
          return;
        }
        const me: MeResponse = await res.json();
        if (!ignore) setUser(me);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex flex-col font-serif">
      <main className="flex-1 overflow-y-auto">
        {loading && (
          <div className="m-4 bg-surface border border-dark/8 p-5 text-muted text-[13px] tracking-[2px] font-mono">
            RETRIEVING AGENT DOSSIER...
          </div>
        )}

        {!loading && user && (
          <ProfileCard student={toProfileStudent(user)} onEdit={() => {}} />
        )}

        {/* === DEV 4: Edit mode controls (senior/junior shared) === */}

        {/* === DEV 5: Mentee & Hints section — seniors/house_leaders only === */}

        {/* === DEV 6: Accusation terminal — juniors only === */}
      </main>
    </div>
  );
}

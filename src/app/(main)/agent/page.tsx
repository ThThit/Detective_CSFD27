"use client";

import { ProfileCard } from "@/components/profile/ProfileCard";
import { ImageCropper } from "@/components/profile/ImageCropper";
import type { MeResponse, PublicStudent } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type EditableField =
  | "nickname"
  | "nationality"
  | "instagram"
  | "discord"
  | "line";
const EDITABLE_FIELDS: EditableField[] = [
  "nickname",
  "nationality",
  "instagram",
  "discord",
  "line",
];

type EditForm = Record<EditableField, string>;

/** Shape the `MeResponse` into the read-only props `ProfileCard` expects. */
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

function formFromUser(user: MeResponse): EditForm {
  return {
    nickname: user.nickname ?? "",
    nationality: user.nationality ?? "",
    instagram: user.instagram ?? "",
    discord: user.discord ?? "",
    line: user.line ?? "",
  };
}

export default function AgentPage() {
  const router = useRouter();
  const [user, setUser] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Edit-mode state (page-level, so the DEV 5/DEV 6 sections below can read it).
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<EditForm | null>(null);
  const [pendingPic, setPendingPic] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  function enterEdit() {
    if (!user) return;
    setForm(formFromUser(user));
    setPendingPic(null);
    setShowCropper(false);
    setError(null);
    setEditMode(true);
  }

  function updateField(field: EditableField, value: string) {
    setForm((prev) => (prev ? { ...prev, [field]: value } : prev));
  }

  function cancelEdit() {
    setEditMode(false);
    setForm(null);
    setPendingPic(null);
    setShowCropper(false);
    setError(null);
  }

  async function handleSave() {
    if (!user || !form || saving) return;
    setSaving(true);
    setError(null);

    // Send only the fields the user changed, plus a new photo if any.
    const body: Partial<Record<EditableField | "profilePic", string>> = {};
    for (const field of EDITABLE_FIELDS) {
      const next = form[field].trim();
      const current = user[field] ?? "";
      if (next !== current) body[field] = next;
    }
    if (pendingPic) body.profilePic = pendingPic;

    if (Object.keys(body).length === 0) {
      setSaving(false);
      setEditMode(false);
      setForm(null);
      return;
    }

    try {
      const res = await fetch(`/api/students/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Failed to update profile.");
        return;
      }
      const updated = data as PublicStudent;
      setUser((prev) => (prev ? { ...prev, ...updated } : prev));
      setEditMode(false);
      setForm(null);
      setPendingPic(null);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setSaving(false);
    }
  }

  // While editing, the card reflects the in-progress form + pending photo.
  const cardStudent =
    !user
      ? null
      : editMode && form
        ? {
            ...toProfileStudent(user),
            nickname: form.nickname,
            nationality: form.nationality,
            instagram: form.instagram,
            discord: form.discord,
            line: form.line,
            profileUrl: pendingPic ?? user.profileUrl,
          }
        : toProfileStudent(user);

  return (
    <div className="min-h-screen bg-background flex flex-col font-serif">
      <main className="flex-1 overflow-y-auto">
        {loading && (
          <div className="m-4 bg-surface border border-dark/8 p-5 text-muted text-[13px] tracking-[2px] font-mono">
            RETRIEVING AGENT DOSSIER...
          </div>
        )}

        {!loading && user && cardStudent && (
          <>
            <ProfileCard
              student={cardStudent}
              editMode={editMode}
              saving={saving}
              onEdit={editMode ? handleSave : enterEdit}
              onFieldChange={updateField}
              onPickPhoto={() => setShowCropper(true)}
            />

            {/* === DEV 4: Edit mode controls (senior/junior shared) === */}
            {editMode && (
              <div className="max-w-content mx-auto mt-2 px-5 flex items-center justify-between gap-3">
                <span className="text-[10px] text-muted-fg tracking-[1px] font-mono">
                  EDITING — TAP SAVE FILE TO CONFIRM
                </span>
                <button
                  type="button"
                  onClick={cancelEdit}
                  disabled={saving}
                  className="text-[10px] text-muted hover:text-danger tracking-[1px] font-mono cursor-pointer disabled:opacity-50"
                >
                  CANCEL
                </button>
              </div>
            )}

            {editMode && error && (
              <div className="max-w-content mx-auto mt-3 bg-danger/6 border border-danger/20 px-3.5 py-2.5 flex items-center gap-2.5">
                <div className="w-[5px] h-[5px] rounded-full bg-danger shrink-0" />
                <div className="text-[13px] text-danger leading-snug">{error}</div>
              </div>
            )}

            {showCropper && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-dark/60 p-5"
                role="dialog"
                aria-modal="true"
                aria-label="Update profile photo"
                onClick={() => setShowCropper(false)}
              >
                <div
                  className="w-full max-w-content max-h-[85vh] overflow-y-auto bg-surface border border-dark/10 p-5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="text-[8px] text-muted-fg tracking-[3px] uppercase mb-3 font-mono">
                    UPDATE PROFILE PHOTO
                  </div>
                  <ImageCropper
                    onComplete={(dataUri) => {
                      setPendingPic(dataUri);
                      setShowCropper(false);
                    }}
                    onCancel={() => setShowCropper(false)}
                  />
                </div>
              </div>
            )}

            {/* === DEV 5: Mentee & Hints section — seniors/house_leaders only ===
                `editMode` (and `setEditMode`) are page-level state and are in scope here. */}

            {/* === DEV 6: Accusation terminal — juniors only === */}
          </>
        )}
      </main>
    </div>
  );
}

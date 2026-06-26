"use client";

/**
 * TEMPORARY — Dev 4 isolation sandbox (URL: /dev4).
 * Exercises the image cropper + profile PATCH end-to-end without touching
 * Dev 3's files. DELETE this route group and `app/api/_sandbox` before the PR;
 * the real UI lives in `/agent` once Dev 3 merges the readonly skeleton.
 */

import { useState } from "react";
import { ImageCropper } from "@/components/profile/ImageCropper";

const FIELDS = ["nickname", "nationality", "instagram", "discord", "line"] as const;
type Field = (typeof FIELDS)[number];

export default function Dev4Sandbox() {
  const [form, setForm] = useState<Record<Field, string>>({
    nickname: "",
    nationality: "",
    instagram: "",
    discord: "",
    line: "",
  });
  const [pendingPic, setPendingPic] = useState<string | null>(null);
  const [result, setResult] = useState<string>("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    setResult("");

    const body: Record<string, string> = {};
    for (const field of FIELDS) {
      if (form[field].trim() !== "") body[field] = form[field];
    }
    if (pendingPic) body.profilePic = pendingPic;

    try {
      const res = await fetch("/api/dev4-sandbox/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      setResult(`${res.status} ${res.statusText}\n${JSON.stringify(json, null, 2)}`);
    } catch (err) {
      setResult(`Request failed: ${String(err)}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main style={{ maxWidth: 480, margin: "0 auto", padding: 24, fontFamily: "system-ui" }}>
      <h1 style={{ fontWeight: 700, marginBottom: 4 }}>Dev 4 sandbox</h1>
      <p style={{ color: "#7A6A58", marginBottom: 16, fontSize: 14 }}>
        Temporary harness for the profile editor. The cropper works offline; the
        save needs a logged-in session to succeed.
      </p>

      <h2 style={{ fontSize: 14, fontWeight: 600 }}>Profile picture</h2>
      <ImageCropper onComplete={setPendingPic} />
      {pendingPic && (
        <div style={{ marginTop: 8 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={pendingPic}
            alt="Cropped preview"
            width={120}
            height={120}
            style={{ borderRadius: "50%", objectFit: "cover" }}
          />
          <p style={{ fontSize: 12, color: "#7A6A58" }}>
            base64 length: {pendingPic.length.toLocaleString()} chars
          </p>
        </div>
      )}

      <h2 style={{ fontSize: 14, fontWeight: 600, marginTop: 16 }}>Fields</h2>
      {FIELDS.map((field) => (
        <label key={field} style={{ display: "block", marginBottom: 8 }}>
          <span style={{ display: "block", fontSize: 12, color: "#7A6A58" }}>{field}</span>
          <input
            value={form[field]}
            onChange={(e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))}
            style={{ width: "100%", padding: 6, border: "1px solid #ccc" }}
          />
        </label>
      ))}

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        style={{ marginTop: 8, padding: "8px 16px" }}
      >
        {saving ? "Saving…" : "Save (PATCH)"}
      </button>

      {result && (
        <pre
          style={{
            marginTop: 16,
            padding: 12,
            background: "#f0ece2",
            fontSize: 12,
            whiteSpace: "pre-wrap",
          }}
        >
          {result}
        </pre>
      )}
    </main>
  );
}

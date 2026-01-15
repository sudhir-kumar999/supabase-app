"use client";

import { useEffect, useState } from "react";

export default function ProfileNameEditor({
  initialName,
}: {
  initialName: string;
}) {
  // 🔥 hydration-safe state
  const [name, setName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🔥 set value AFTER hydration
  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  // 🔥 prevent SSR / hydration mismatch
  if (name === null) return null;

  const saveName = async () => {
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setMessage(data.message || "Failed to update");
      return;
    }

    setMessage("Name updated successfully ✅");
  };

  return (
    <div className="space-y-2">
      <label className="block font-semibold">
        Name
      </label>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />

      <button
        onClick={saveName}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
      >
        {loading ? "Saving..." : "Save Name"}
      </button>

      {message && (
        <p className="text-sm text-green-600">{message}</p>
      )}
    </div>
  );
}

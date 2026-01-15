"use client";

export default function LogoutButton() {
  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });

    // 🔥 HARD RESET so cookies + middleware sync
    window.location.replace("/login");
  };

  return (
    <button
      onClick={logout}
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded"
    >
      Logout
    </button>
  );
}

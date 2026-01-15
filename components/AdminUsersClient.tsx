"use client";

import { useState } from "react";

type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export default function AdminUsersClient({
  users,
}: {
  users: UserProfile[];
}) {
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState("");

  const saveName = async (id: string) => {
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: id, name }),
    });
    window.location.reload();
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Delete user permanently?")) return;

    await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: id }),
    });
    window.location.reload();
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-5xl">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Manage Users
      </h1>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td className="border p-2">
                {editId === u.id ? (
                  <input
                    defaultValue={u.name}
                    className="border px-2 py-1"
                    onChange={(e) => setName(e.target.value)}
                  />
                ) : (
                  u.name
                )}
              </td>

              <td className="border p-2">{u.email}</td>
              <td className="border p-2">{u.role}</td>

              <td className="border p-2 space-x-2">
                {editId === u.id ? (
                  <button
                    onClick={() => saveName(u.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditId(u.id);
                      setName(u.name);
                    }}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                )}

                <button
                  onClick={() => deleteUser(u.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

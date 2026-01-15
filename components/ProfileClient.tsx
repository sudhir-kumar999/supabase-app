"use client";

import Link from "next/link";
import ProfileNameEditor from "@/components/ProfileNameEditor";

export default function ProfileClient({ profile }: { profile: any }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-center">
        User Profile
      </h1>

      <ProfileNameEditor initialName={profile.name} />

      <div className="space-y-3 mt-6">
        <p>
          <span className="font-semibold">Email:</span>{" "}
          {profile.email}
        </p>

        <p>
          <span className="font-semibold">Role:</span>{" "}
          {profile.role}
        </p>

        <p className="text-sm text-gray-500">
          Joined on{" "}
          {new Date(profile.created_at).toDateString()}
        </p>
      </div>

      <Link
        href="/todos"
        className="block w-full text-center bg-black text-white py-2 rounded hover:bg-gray-800 mt-6"
      >
        Go to My Todos
      </Link>
    </div>
  );
}

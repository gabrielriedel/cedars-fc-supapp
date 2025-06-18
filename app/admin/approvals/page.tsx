"use client";

import { useEffect, useState } from "react";

// Define a proper User type
type PendingUser = {
  id: string;
  email: string;
  user_metadata?: {
    role?: string;
  };
};

export default function ApprovalsPage() {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);

  useEffect(() => {
    const fetchPendingUsers = async () => {
      const res = await fetch("/api/admin/users");
      const data: PendingUser[] = await res.json();
      setPendingUsers(data);
    };

    fetchPendingUsers();
  }, []);

  const approveUser = async (userId: string) => {
    const res = await fetch("/api/admin/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    if (res.ok) {
      setPendingUsers((prev) => prev.filter((u) => u.id !== userId));
    } else {
      const { error } = await res.json();
      console.error(error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Pending Approvals</h1>
      {pendingUsers.length === 0 ? (
        <p>No pending users</p>
      ) : (
        <ul className="space-y-4">
          {pendingUsers.map((user) => (
            <li
              key={user.id}
              className="flex justify-between items-center border p-4 rounded"
            >
              <div>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Role:</strong> {user.user_metadata?.role}
                </p>
              </div>
              <button
                onClick={() => approveUser(user.id)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Approve
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

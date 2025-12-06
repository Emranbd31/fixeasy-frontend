"use client";

import React from "react";

export default function ChatLauncher({
  currentUserId,
  currentUserRole,
  resolveConversation,
  label = "Chat",
}: {
  currentUserId: string;
  currentUserRole: "professional" | "client" | "admin";
  resolveConversation: () => Promise<string>;
  label?: string;
}) {
  const handleOpen = async () => {
    await resolveConversation();
    // In a full implementation, open chat UI here.
  };

  return (
    <button
      type="button"
      onClick={handleOpen}
      className="fixed bottom-6 right-6 rounded-full bg-blue-600 px-4 py-3 text-white shadow-lg hover:bg-blue-700"
    >
      {label}
    </button>
  );
}

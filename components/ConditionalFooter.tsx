"use client";

import React from "react";

export default function ConditionalFooter() {
    // Hide footer on admin pages
    if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin")) {
        return null;
    }

    return (
        <footer className="w-full py-6 text-center text-gray-500 text-sm border-t mt-10">
            <p>© {new Date().getFullYear()} FixEasy Ireland — All Rights Reserved</p>
        </footer>
    );
}

"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";

export default function ConditionalFooter() {
    const pathname = usePathname() || "";
    // Hide the public footer on all /admin/* pages
    if (pathname.startsWith("/admin")) return null;
    return <Footer />;
}

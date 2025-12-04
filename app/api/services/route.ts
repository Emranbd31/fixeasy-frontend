import { NextResponse } from "next/server";
import { fetchAdminBackend } from "@/lib/api-client";

export async function GET() {
  try {
    const result = await fetchAdminBackend("/services");
    if (!result.ok) {
      return NextResponse.json({ services: [] }, { status: 200 });
    }
    const services = (result.data as any)?.services ?? [];
    return NextResponse.json({ services });
  } catch (e: any) {
    return NextResponse.json({ services: [] }, { status: 200 });
  }
}

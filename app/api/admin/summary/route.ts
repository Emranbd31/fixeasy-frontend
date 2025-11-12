import { NextResponse, NextRequest } from "next/server";
import { getAdminSummary } from "@/lib/apiClient";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  // Accept token from either cookie name used in different deploys,
  // or from an Authorization: Bearer <token> header.
  const cookieToken = cookies().get("admin_token")?.value || cookies().get("fixeasy_admin_token")?.value;
  let authToken: string | undefined = cookieToken;

  if (!authToken) {
    const header = request.headers.get("authorization") || request.headers.get("Authorization");
    if (header) {
      const m = header.match(/Bearer\s+(.+)/i);
      if (m) authToken = m[1];
    }
  }

  try {
    const data = await getAdminSummary(authToken);
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}

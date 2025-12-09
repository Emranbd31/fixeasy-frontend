import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const pathType = body?.pathType;
  if (pathType !== "quote" && pathType !== "book") {
    return NextResponse.json({ error: "Invalid pathType" }, { status: 400 });
  }
  // In a real implementation, store this in analytics. Here we just acknowledge.
  return NextResponse.json({ recorded: true, pathType });
}

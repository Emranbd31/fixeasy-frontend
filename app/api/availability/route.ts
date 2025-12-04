import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const service = searchParams.get("service") || "General";
  const location = searchParams.get("location") || "Dublin";
  const startDate = new Date();
  const days = Number(searchParams.get("days") || 7);

  const slots: string[] = [];
  for (let i = 0; i < days; i++) {
    const base = new Date(startDate);
    base.setDate(base.getDate() + i);
    [9, 11, 13, 15, 17].forEach((hour) => {
      const slot = new Date(base);
      slot.setHours(hour, 0, 0, 0);
      slots.push(slot.toISOString());
    });
  }

  return NextResponse.json({
    service,
    location,
    slots,
  });
}

import { NextRequest, NextResponse } from "next/server";
import { availableSlots } from "@/lib/agenda";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const fecha = req.nextUrl.searchParams.get("fecha");
  if (!fecha || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return NextResponse.json({ error: "fecha inválida" }, { status: 400 });
  }
  try {
    const slots = await availableSlots(fecha);
    return NextResponse.json({ slots: slots.map((s) => ({ iso: s.iso, label: s.label })) });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message ?? "error" }, { status: 500 });
  }
}

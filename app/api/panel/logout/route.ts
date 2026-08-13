import { NextResponse } from "next/server";
import { PANEL_COOKIE } from "@/lib/panel-auth";

export const dynamic = "force-dynamic";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(PANEL_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}

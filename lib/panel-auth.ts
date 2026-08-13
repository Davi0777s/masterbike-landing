import crypto from "crypto";
import { cookies } from "next/headers";

export const PANEL_COOKIE = "mb_panel";

/** Token de sesión derivado de la contraseña (no guarda la contraseña en la cookie). */
function sessionToken(): string {
  const pw = process.env.PANEL_PASSWORD || "";
  return crypto.createHmac("sha256", pw || "sin-pw").update("mb-panel-v1").digest("hex");
}

export function makeSession(): string {
  return sessionToken();
}

export function checkPassword(input: string): boolean {
  const pw = process.env.PANEL_PASSWORD || "";
  return pw.length > 0 && input === pw;
}

export async function isAuthed(): Promise<boolean> {
  const c = (await cookies()).get(PANEL_COOKIE)?.value;
  return !!c && !!process.env.PANEL_PASSWORD && c === sessionToken();
}

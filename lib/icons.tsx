import type { ReactNode } from "react";

const P = { fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

const ICONS: Record<string, ReactNode> = {
  check: <path d="M20 6 9 17l-5-5" {...P} />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" {...P} />,
  chat: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" {...P} />,
  pin: <g {...P}><path d="M12 21s-7-5.6-7-11a7 7 0 0 1 14 0c0 5.4-7 11-7 11z" /><circle cx="12" cy="10" r="2.6" /></g>,
  // máquinas
  eliptica: <g {...P}><ellipse cx="12" cy="12" rx="9" ry="5" /><path d="M5 15l4-8m10 8-4-8" /><circle cx="9" cy="7" r="1.4" /><circle cx="15" cy="17" r="1.4" /></g>,
  caminadora: <g {...P}><path d="M3 18h12l3-9M3 18l1-3h10" /><path d="M18 9l3-4" /><circle cx="6" cy="20" r="1.4" /><circle cx="15" cy="20" r="1.4" /></g>,
  bici: <g {...P}><circle cx="6" cy="17" r="3.2" /><circle cx="18" cy="17" r="3.2" /><path d="M6 17l4-8h5l-3 8M9 9h4" /></g>,
  remo: <path d="M4 14l6-2 8 4M4 14l2 4m12-2 2 2M9 12l2-6 4 1" {...P} />,
  otra: <g {...P}><path d="M12 3v4m0 10v4M3 12h4m10 0h4" /><circle cx="12" cy="12" r="3.2" /></g>,
  // diferenciadores (stroke-width 2)
  user: <g fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></g>,
  home: <g fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /><path d="M9 21v-6h6v6" /></g>,
  wallet: <g fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M3 10h18" /><circle cx="17" cy="14" r="1.3" /></g>,
  tag: <g fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M20.5 13.5 13 21l-9-9V4h8z" /><circle cx="8.5" cy="8.5" r="1.4" /></g>,
  doc: <g fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></g>,
  shield: <g fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 5 6v6c0 4 3 6.5 7 9 4-2.5 7-5 7-9V6z" /><path d="m9 12 2 2 4-4" /></g>,
  photo: <g {...P}><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="10" r="2" /><path d="m21 17-5-5-6 6" /></g>,
  wrench: <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />,
  medal: <g fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="9" r="6" /><path d="M8.5 14 7 22l5-3 5 3-1.5-8" /><path d="m12 6 1 2 2 .3-1.5 1.4.4 2L12 11l-1.8 1 .4-2L9 8.3 11 8z" /></g>,
};

export function Icon({ name, className = "ico" }: { name: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      {ICONS[name] ?? ICONS.otra}
    </svg>
  );
}

export const whatsappSvg = (
  <svg viewBox="0 0 32 32" aria-hidden="true">
    <path d="M16 3C9 3 3.5 8.5 3.5 15.5c0 2.4.7 4.6 1.8 6.6L3 29l7.1-2.3c1.9 1 4.1 1.6 6.4 1.6h.01c6.9 0 12.5-5.5 12.5-12.5S23 3 16 3zm0 22.8h-.01c-2 0-3.9-.5-5.5-1.5l-.4-.2-4.2 1.3 1.3-4.1-.3-.4a10.2 10.2 0 0 1-1.6-5.5C5 9.7 9.9 4.9 16 4.9c2.9 0 5.6 1.1 7.6 3.1a10.6 10.6 0 0 1 3.2 7.5c0 5.8-4.9 10.6-10.8 10.6zm6-7.9c-.3-.2-1.9-1-2.2-1.1-.3-.1-.5-.2-.8.2-.2.3-.9 1.1-1.1 1.3-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.3-.2-.3 0-.5.1-.7.1-.1.3-.4.5-.6.1-.2.2-.3.3-.5.1-.2 0-.4 0-.6-.1-.2-.8-1.9-1-2.6-.3-.7-.5-.6-.7-.6h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.3 5.2 4.6.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.9-.8 2.1-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.2-.6-.4z" />
  </svg>
);

export function waHref(phone: string, text: string) {
  return `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
}

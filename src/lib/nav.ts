export type NavItem = {
  href: string;
  label: string;
  icon: string;
  status: "live" | "soon";
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: "home", status: "live" },
  { href: "/induction", label: "Induction", icon: "graduation-cap", status: "soon" },
  { href: "/proceduri", label: "Proceduri & Siguranță", icon: "shield", status: "live" },
  { href: "/organigrama", label: "Organigramă", icon: "sitemap", status: "soon" },
  { href: "/sim", label: "SIM — Program duminical", icon: "calendar-check", status: "soon" },
  { href: "/resurse", label: "Resurse", icon: "folder", status: "soon" },
  { href: "/teachers-hub", label: "Teachers Hub", icon: "book-open", status: "soon" },
  { href: "/carti", label: "Recomandări cărți", icon: "book", status: "soon" },
  { href: "/evenimente", label: "Evenimente", icon: "party", status: "soon" },
  { href: "/pray-wall", label: "Pray Wall", icon: "heart", status: "soon" },
  { href: "/feedback", label: "Feedback", icon: "message", status: "soon" },
  { href: "/implica-te", label: "Implică-te", icon: "sparkles", status: "soon" },
];

export const ADMIN_NAV_ITEMS: NavItem[] = [
  { href: "/echipa", label: "Echipă & Invitații", icon: "users", status: "live" },
];

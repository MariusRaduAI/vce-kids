export type NavItem = {
  href: string;
  label: string;
  icon: string;
  status: "live" | "soon";
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: "home", status: "live" },
  { href: "/induction", label: "Induction", icon: "graduation-cap", status: "live" },
  { href: "/proceduri", label: "Proceduri & Siguranță", icon: "shield", status: "live" },
  { href: "/organigrama", label: "Organigramă", icon: "sitemap", status: "live" },
  { href: "/sim", label: "SIM — Program duminical", icon: "calendar-check", status: "live" },
  { href: "/resurse", label: "Resurse", icon: "folder", status: "live" },
  { href: "/teachers-hub", label: "Teachers Hub", icon: "book-open", status: "live" },
  { href: "/evenimente", label: "Evenimente", icon: "party", status: "live" },
  { href: "/pray-wall", label: "Pray Wall", icon: "heart", status: "live" },
  { href: "/feedback", label: "Feedback", icon: "message", status: "live" },
  { href: "/implica-te", label: "Implică-te", icon: "sparkles", status: "live" },
];

export const ADMIN_NAV_ITEMS: NavItem[] = [
  { href: "/coordonare", label: "Coordonare", icon: "compass", status: "live" },
  { href: "/echipa", label: "Echipă & Invitații", icon: "users", status: "live" },
];

export const PLATFORM_NAV_ITEMS: NavItem[] = [
  { href: "/vce", label: "VCE — toată rețeaua", icon: "globe", status: "live" },
];

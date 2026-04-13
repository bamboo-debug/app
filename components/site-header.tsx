import Link from "next/link";
import { Leaf } from "lucide-react";

const primaryLinks = [
  { href: "/modules", label: "Módulos" },
  { href: "/blog", label: "Blog" },
  { href: "/leaderboard", label: "Ranking" },
];

const secondaryLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/auth", label: "Ingresar" },
];

export function SiteHeader() {
  return (
    <header className="header">
      <div className="container header-inner">
        <Link href="/" className="brand-link">
          <Leaf size={22} />
          <span>
            Bamboo
            <small>Texo · Club de innovación</small>
          </span>
        </Link>

        <nav className="nav-shell">
          <div className="nav muted">
            {primaryLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="nav-actions">
            {secondaryLinks.map((link) => (
              <Link key={link.href} href={link.href} className="btn btn-secondary btn-compact">
                {link.label}
              </Link>
            ))}
            <Link href="/join" className="btn btn-primary btn-compact">
              Sumarme
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

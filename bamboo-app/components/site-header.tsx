import Link from 'next/link';
import { Leaf } from 'lucide-react';
export function SiteHeader() {
  return (
    <header className="header">
      <div className="container header-inner">
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800 }}><Leaf size={22} />Bamboo</Link>
        <nav className="nav muted">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/modules">Módulos</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/leaderboard">Ranking</Link>
          <Link href="/join">Sumarme</Link>
          <Link href="/auth">Ingresar</Link>
        </nav>
      </div>
    </header>
  );
}

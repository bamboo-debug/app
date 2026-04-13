import './globals.css';
import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
export const metadata: Metadata = { title: 'Bamboo · Club de Innovación Texo', description: 'App de aprendizaje modular y gamificación para el club de innovación Bamboo.' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="es"><body><SiteHeader />{children}<SiteFooter /></body></html>;
}

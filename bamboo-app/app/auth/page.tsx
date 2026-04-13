import { AuthForm } from '@/components/auth-form';
import { isSupabaseConfigured } from '@/lib/env';
export default function AuthPage() {
  const configured = isSupabaseConfigured();
  return (
    <main className="section"><div className="container two-col"><div><span className="pill">Acceso Bamboo</span><h1>Ingreso y creación de usuarios</h1><p className="muted">Cuando conectes Supabase, esta pantalla permitirá registrar personas del holding, iniciar sesión y proteger el dashboard.</p><div className="card panel"><strong>Estado actual:</strong><p className="muted" style={{ marginBottom: 0 }}>{configured ? 'Supabase configurado. El login real está activo.' : 'Modo demo. Agrega variables de entorno para activar la autenticación real.'}</p></div></div><AuthForm /></div></main>
  );
}

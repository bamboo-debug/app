'use client';
import { useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';
export function AuthForm() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = getSupabaseBrowserClient();
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) { setMessage('Configura Supabase en .env.local para activar el login real.'); return; }
    setLoading(true); setMessage('');
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } });
        if (error) throw error;
        setMessage('Cuenta creada. Revisa tu email si la confirmación está activada.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setMessage('Ingreso exitoso. Ya puedes ir al dashboard.');
        window.location.href = '/dashboard';
      }
    } catch (error) { setMessage(error instanceof Error ? error.message : 'No se pudo completar la acción.'); }
    finally { setLoading(false); }
  }
  return (
    <form onSubmit={handleSubmit} className="card panel form-stack">
      <div style={{ display: 'flex', gap: 12 }}>
        <button type="button" className={`btn ${mode === 'signin' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setMode('signin')}>Ingresar</button>
        <button type="button" className={`btn ${mode === 'signup' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setMode('signup')}>Crear cuenta</button>
      </div>
      {mode === 'signup' ? <input className="input" placeholder="Nombre completo" value={fullName} onChange={(e) => setFullName(e.target.value)} /> : null}
      <input className="input" placeholder="Correo corporativo" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input className="input" placeholder="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Procesando...' : mode === 'signin' ? 'Entrar a Bamboo' : 'Crear mi cuenta'}</button>
      {message ? <div className="muted">{message}</div> : null}
    </form>
  );
}

export function StatCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <article className="card panel">
      <div className="muted">{label}</div>
      <div style={{ fontSize: '2rem', fontWeight: 800, margin: '10px 0' }}>{value}</div>
      <div className="muted">{hint}</div>
    </article>
  );
}

import { leaderboard } from '@/lib/mock-data';
export default function LeaderboardPage() {
  return <main className="section"><div className="container"><span className="pill">Ranking Bamboo</span><h1>Quiénes están empujando más fuerte</h1><div className="card panel"><ul className="list-clean">{leaderboard.map((entry, index) => <li key={entry.id} className="item-row"><div><strong>{index + 1}. {entry.name}</strong><div className="muted">{entry.area} · {entry.level_name}</div></div><span className="pill">{entry.points} XP</span></li>)}</ul></div></div></main>;
}

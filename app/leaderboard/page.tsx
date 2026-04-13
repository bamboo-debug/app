"use client";

import { useMemo, useState } from "react";
import { demoProfile, leaderboard } from "@/lib/mock-data";
import { getDemoProgress, getLevel } from "@/lib/gamification";

export default function LeaderboardPage() {
  const [progress] = useState(() => getDemoProgress());

  const entries = useMemo(() => {
    const dynamicDemo = {
      id: demoProfile.id,
      name: demoProfile.full_name,
      area: demoProfile.area,
      points: progress.points,
      level_name: getLevel(progress.points).name,
    };

    const others = leaderboard.filter((entry) => entry.id !== demoProfile.id);
    return [dynamicDemo, ...others].sort((a, b) => b.points - a.points);
  }, [progress.points]);

  return (
    <main className="section">
      <div className="container">
        <span className="pill">Ranking Bamboo</span>
        <h1>Quiénes están empujando más fuerte</h1>

        <div className="card panel">
          <ul className="list-clean">
            {entries.map((entry, index) => (
              <li key={entry.id} className="item-row">
                <div>
                  <strong>
                    {index + 1}. {entry.name}
                  </strong>
                  <div className="muted">
                    {entry.area} · {entry.level_name}
                  </div>
                </div>

                <span className="pill">{entry.points} XP</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}

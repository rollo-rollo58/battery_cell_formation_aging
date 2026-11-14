'use client';
import { useMemo, useState } from 'react';

export default function FormationProfile() {
  const [rate, setRate] = useState(0.2);
  const [cycle, setCycle] = useState(1);
  const series = useMemo(() => Array.from({ length: 90 }, (_, i) => {
    const phase = i / 89;
    const value = 2.75 + 1.4 * (1 - Math.exp(-phase * (3 + rate)));
    return { x: 18 + i * 5.3, y: 175 - (value - 2.5) * 78 - (cycle - 1) * 1.5 };
  }), [rate, cycle]);
  const points = series.map((point) => `${point.x},${point.y}`).join(' ');
  return (
    <section className="lab-panel lg:col-span-4">
      <div className="lab-title"><h2>CC/CV formation trace</h2>
        <span className="badge">Cycle {cycle}</span></div>
      <svg viewBox="0 0 520 200" className="w-full" aria-label="Formation voltage chart">
        {[50, 100, 150].map((y) => (
          <line key={y} x1="18" y1={y} x2="502" y2={y}
            stroke="#334155" strokeDasharray="3 5" />
        ))}
        <polyline points={points} stroke="#bef264" strokeWidth="3" fill="none" />
        <line x1="363" y1="20" x2="363" y2="180"
          stroke="#f59e0b" strokeDasharray="4 5" />
      </svg>
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <label>Rate <input type="range" min="0.1" max="1.0" step="0.1"
          value={rate} onChange={(e) => setRate(Number(e.target.value))} />
        </label><strong>{rate.toFixed(1)} C</strong>
        <button className="pill-off" onClick={() => setCycle(cycle % 5 + 1)}>
          Next cycle</button>
      </div>
    </section>
  );
}

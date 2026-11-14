'use client';
import { useMemo, useState } from 'react';

export default function CycleCapacityForecast() {
  const [fade, setFade] = useState(0.00062);
  const [cycles, setCycles] = useState(900);
  const points = useMemo(() => Array.from({ length: 80 }, (_, i) => {
    const x = i * cycles / 79;
    const capacity = 5.15 - fade * x - 0.016 * Math.sqrt(x / 100);
    return `${15 + i * 4.7},${160 - (capacity - 4.3) * 140}`;
  }).join(' '), [fade, cycles]);
  const retention = 100 * (5.15 - fade * cycles) / 5.15;
  return (
    <section className="lab-panel lg:col-span-4">
      <div className="lab-title"><h2>Cycle-life projection</h2>
        <span className="badge">Forecast model</span></div>
      <svg viewBox="0 0 400 180" className="w-full" aria-label="Capacity fade forecast">
        <rect x="12" y="28" width="375" height="135" fill="#0b1221" />
        <path d="M12 124 H388" stroke="#f59e0b" strokeDasharray="4 3" />
        <polyline points={points} stroke="#fb7185" strokeWidth="3" fill="none" />
      </svg>
      <div className="grid grid-cols-2 gap-3 text-xs">
        <label>Forecast cycles: {cycles}<input type="range" min="100" max="1500"
          step="100" value={cycles}
          onChange={(e) => setCycles(Number(e.target.value))} /></label>
        <label>Fade coefficient <input type="range" min="0.0002" max="0.0012"
          step="0.0001" value={fade}
          onChange={(e) => setFade(Number(e.target.value))} /></label>
      </div>
      <p className="mt-3 text-xs text-slate-300">Projected retention:
        <strong className="ml-2 text-lime-300">{retention.toFixed(1)}%</strong></p>
    </section>
  );
}

'use client';
import { useState } from 'react';

export default function CoulombicEfficiencyDistribution() {
  const [cutoff, setCutoff] = useState(99.4);
  const efficiency = Array.from({ length: 64 }, (_, i) =>
    98.1 + Math.abs(Math.sin(i * 1.357)) * 1.8);
  const passing = efficiency.filter((value) => value >= cutoff).length;
  return (
    <section className="lab-panel lg:col-span-3">
      <div className="lab-title"><h2>Coulombic efficiency</h2>
        <span className="badge">Batch CE</span></div>
      <div className="flex h-32 items-end gap-0.5">
        {efficiency.map((value, i) => <div key={i}
          title={`${value.toFixed(2)}%`}
          style={{ height: `${(value - 97) * 45}%` }}
          className={`min-w-0 flex-1 rounded-t ${value >= cutoff ?
            'bg-lime-300' : 'bg-rose-500'}`} />)}
      </div>
      <label className="mt-3 block text-xs">Acceptance cutoff: {cutoff.toFixed(1)}%
        <input type="range" min="98" max="99.9" step="0.1" value={cutoff}
          onChange={(e) => setCutoff(Number(e.target.value))} />
      </label>
      <p className="text-xs text-slate-400">{passing} of 64 cells above cutoff</p>
    </section>
  );
}

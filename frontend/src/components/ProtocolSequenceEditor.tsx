'use client';
import { useState } from 'react';

type Stage = { id: number; label: string; current: number; minutes: number };
const initial: Stage[] = [
  { id: 1, label: 'Wetting rest', current: 0, minutes: 45 },
  { id: 2, label: 'Formation CC', current: 0.25, minutes: 180 },
  { id: 3, label: 'CV taper', current: 0.12, minutes: 70 },
  { id: 4, label: 'Open-circuit dwell', current: 0, minutes: 120 },
];

export default function ProtocolSequenceEditor() {
  const [steps, setSteps] = useState(initial);
  const duration = steps.reduce((sum, row) => sum + row.minutes, 0);
  function change(id: number, key: 'current' | 'minutes', value: number) {
    setSteps((rows) => rows.map((row) => row.id === id ? {
      ...row, [key]: Math.max(0, value),
    } : row));
  }
  return (
    <section className="lab-panel lg:col-span-6">
      <div className="lab-title"><h2>Formation recipe editor</h2>
        <span className="badge">Local simulation</span></div>
      <div className="space-y-2">
        {steps.map((step) => <div key={step.id}
          className="grid grid-cols-[1fr_76px_76px] items-center gap-2 rounded-lg
            border border-slate-700 bg-slate-900 p-2 text-xs">
          <span className="font-semibold">{step.id}. {step.label}</span>
          <label>A<input className="field" type="number" step="0.05" min="0"
            value={step.current} onChange={(e) => change(step.id, 'current',
              Number(e.target.value))} /></label>
          <label>min<input className="field" type="number" min="0" step="5"
            value={step.minutes} onChange={(e) => change(step.id, 'minutes',
              Number(e.target.value))} /></label>
        </div>)}
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
        <span>Program duration: {duration} min</span>
        <button className="pill-off" onClick={() => setSteps(initial)}>Reset</button>
      </div>
    </section>
  );
}

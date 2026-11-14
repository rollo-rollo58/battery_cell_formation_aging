'use client';
import { useMemo, useState } from 'react';

export default function CellRackMap() {
  const [selected, setSelected] = useState(18);
  const [mode, setMode] = useState<'voltage' | 'temperature'>('voltage');
  const readings = useMemo(() => Array.from({ length: 96 }, (_, i) => ({
    voltage: 3.55 + Math.sin(i * 1.7) * 0.12 + (i % 9) * 0.014,
    temperature: 26 + Math.cos(i * 0.59) * 2.9 + (i % 7) * 0.2,
  })), []);
  const active = readings[selected];
  return (
    <section className="lab-panel lg:col-span-8" aria-label="Cell rack inspection">
      <div className="lab-title"><h2>96-channel formation rack</h2>
        <div className="flex gap-2">
          {(['voltage', 'temperature'] as const).map((item) => (
            <button key={item} onClick={() => setMode(item)}
              className={mode === item ? 'pill-on' : 'pill-off'}>{item}</button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-12 gap-1.5 rounded-xl bg-slate-950 p-3">
        {readings.map((cell, i) => {
          const value = mode === 'voltage' ? cell.voltage : cell.temperature;
          const shade = mode === 'voltage' ? value > 3.65 : value > 29;
          return (
            <button key={i} title={`Channel ${i + 1}: ${value.toFixed(2)}`}
              onClick={() => setSelected(i)}
              aria-pressed={selected === i}
              className={`aspect-square rounded-sm border text-[8px] md:text-xs
                ${selected === i ? 'border-white ring-2 ring-lime-300' : 'border-slate-800'}
                ${shade ? 'bg-amber-400/65 text-slate-950' : 'bg-emerald-400/70 text-slate-950'}`}>
              {i + 1}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex justify-between text-xs text-slate-400">
        <span>Channel {selected + 1} · Lot LFP-2026-041</span>
        <span>{active.voltage.toFixed(3)} V · {active.temperature.toFixed(1)} °C</span>
      </div>
    </section>
  );
}

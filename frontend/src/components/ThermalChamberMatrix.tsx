'use client';
import { useState } from 'react';

export default function ThermalChamberMatrix() {
  const [offset, setOffset] = useState(0);
  const [selected, setSelected] = useState(3);
  const sensors = Array.from({ length: 24 }, (_, i) =>
    25 + Math.sin(i * 0.71) * 3.2 + offset + i * 0.045);
  return (
    <section className="lab-panel lg:col-span-3">
      <div className="lab-title"><h2>Thermal chamber</h2><span className="badge">24 probes</span></div>
      <div className="grid grid-cols-6 gap-2 rounded-xl bg-slate-950 p-3">
        {sensors.map((temp, i) => <button key={i}
          className={`aspect-square rounded border text-[10px]
            ${selected === i ? 'border-white' : 'border-transparent'}
            ${temp > 28 ? 'bg-orange-400 text-slate-950' : 'bg-sky-400 text-slate-950'}`}
          title={`Probe ${i + 1}`} onClick={() => setSelected(i)}>
          {temp.toFixed(0)}
        </button>)}
      </div>
      <p className="mt-3 text-xs text-slate-300">Probe {selected + 1}:
        <strong className="ml-2">{sensors[selected].toFixed(2)} °C</strong></p>
      <div className="mt-3 flex gap-2">
        <button className="pill-off" onClick={() => setOffset(offset - 0.5)}>
          Cooler</button>
        <button className="pill-off" onClick={() => setOffset(offset + 0.5)}>
          Warmer</button>
      </div>
    </section>
  );
}

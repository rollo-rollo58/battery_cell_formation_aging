'use client';
import { useMemo, useState } from 'react';

export default function ImpedanceNyquist() {
  const [age, setAge] = useState(120);
  const [showFit, setShowFit] = useState(true);
  const points = useMemo(() => Array.from({ length: 42 }, (_, i) => {
    const theta = Math.PI * i / 41;
    const radius = 65 + age * 0.12;
    return { x: 45 + radius * (1 - Math.cos(theta)),
      y: 176 - 0.7 * radius * Math.sin(theta) };
  }), [age]);
  return (
    <section className="lab-panel lg:col-span-4">
      <div className="lab-title"><h2>EIS / Nyquist explorer</h2>
        <span className="badge">Impedance</span></div>
      <svg viewBox="0 0 280 200" className="w-full" aria-label="Impedance semicircle">
        <path d="M34 15 V178 H264" fill="none" stroke="#64748b" />
        {points.map((p, i) => <circle key={i} cx={p.x} cy={p.y}
          r={i % 5 === 0 ? 3 : 1.5} fill="#38bdf8" />)}
        {showFit && <polyline fill="none" stroke="#bef264" strokeWidth="1.5"
          points={points.map((p) => `${p.x},${p.y}`).join(' ')} />}
        <text x="130" y="196" fontSize="10" fill="#cbd5e1">Z real (mΩ)</text>
      </svg>
      <label className="text-xs">Aging cycles: {age}
        <input className="ml-3" type="range" min="0" max="500"
          value={age} onChange={(e) => setAge(Number(e.target.value))} />
      </label>
      <button className="pill-off ml-3" onClick={() => setShowFit(!showFit)}>
        {showFit ? 'Hide fit' : 'Show fit'}</button>
    </section>
  );
}

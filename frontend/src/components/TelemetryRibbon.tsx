'use client';
import { useDomainTelemetry } from '../hooks/useDomainTelemetry';

export default function TelemetryRibbon() {
  const { samples, paused, setPaused } = useDomainTelemetry('cell_voltage_v');
  const points = samples.map((value, i) =>
    `${12 + i * 12},${90 - value * 12}`).join(' ');
  return (
    <section className="lab-panel lg:col-span-5">
      <div className="lab-title"><h2>Live voltage envelope</h2>
        <button className="pill-off" onClick={() => setPaused(!paused)}>
          {paused ? 'Resume' : 'Pause'}</button></div>
      <svg viewBox="0 0 400 120" className="w-full" aria-label="Voltage time series">
        <rect x="10" y="18" width="380" height="75" fill="#101f31" />
        <path d="M10 72 H390" stroke="#fbbf24" strokeDasharray="5 5" />
        <polyline points={points} stroke="#bef264" strokeWidth="3" fill="none" />
      </svg>
      <div className="flex justify-between text-xs text-slate-400">
        <span>{samples.length} buffered samples</span>
        <span>Latest: {(samples.at(-1) ?? 0).toFixed(3)} V</span>
      </div>
    </section>
  );
}

'use client';
import { useState } from 'react';

type Output = { grade: string; reason: string; dcir_milliohm: number };
const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

export default function DiagnosticWorkbench() {
  const [capacity, setCapacity] = useState(4.92);
  const [loadedVoltage, setLoadedVoltage] = useState(4.05);
  const [result, setResult] = useState<Output | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function assess() {
    setBusy(true);
    setError('');
    try {
      const response = await fetch(`${base}/api/cells/grade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          initial_capacity_ah: 5.1, current_capacity_ah: capacity,
          pulse_ocv_v: 4.1, pulse_loaded_v: loadedVoltage,
          pulse_current_a: 2, charge_integral_ah: 5.0,
          discharge_integral_ah: 4.98, thermal_excursion_minutes: 0,
        }),
      });
      if (!response.ok) throw new Error(`Diagnostic status ${response.status}`);
      setResult(await response.json() as Output);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to evaluate');
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="lab-panel lg:col-span-4">
      <div className="lab-title"><h2>Cell grading workbench</h2>
        <span className="badge">API evaluation</span></div>
      <label className="block text-xs">Measured capacity (Ah)
        <input className="field" type="number" step="0.01" min="0" max="10"
          value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} />
      </label>
      <label className="mt-3 block text-xs">Pulse-loaded voltage (V)
        <input className="field" type="number" step="0.01" min="0" max="6"
          value={loadedVoltage}
          onChange={(e) => setLoadedVoltage(Number(e.target.value))} />
      </label>
      <button className="mt-3 w-full rounded-lg bg-lime-300 px-4 py-2
        font-semibold text-slate-950 disabled:opacity-50" onClick={assess}
        disabled={busy}>{busy ? 'Analyzing' : 'Compute research grade'}</button>
      {result && <div role="status" className="mt-3 text-sm">
        <strong>Grade {result.grade.toUpperCase()}</strong>
        <p className="text-xs text-slate-400">{result.reason}</p>
        <p className="text-xs">DCIR: {result.dcir_milliohm.toFixed(2)} mΩ</p>
      </div>}
      {error && <p className="mt-3 text-xs text-rose-400">{error}</p>}
    </section>
  );
}

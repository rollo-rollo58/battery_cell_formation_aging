'use client';
import { useState } from 'react';

export default function InterlockSimulator() {
  const [doorClosed, setDoorClosed] = useState(true);
  const [fanWorking, setFanWorking] = useState(true);
  const [temperature, setTemperature] = useState(31);
  const ready = doorClosed && fanWorking && temperature < 45;
  return (
    <section className="lab-panel lg:col-span-4">
      <div className="lab-title"><h2>Safety interlock sandbox</h2>
        <span className={ready ? 'badge' : 'badge border-rose-500 text-rose-300'}>
          {ready ? 'All conditions met' : 'Simulated trip'}</span></div>
      <div className="space-y-3 text-sm">
        <label className="flex items-center justify-between">Chamber door sealed
          <input type="checkbox" checked={doorClosed}
            onChange={(e) => setDoorClosed(e.target.checked)} /></label>
        <label className="flex items-center justify-between">Extraction fan healthy
          <input type="checkbox" checked={fanWorking}
            onChange={(e) => setFanWorking(e.target.checked)} /></label>
        <label className="block text-xs">Detected thermal load: {temperature} °C
          <input type="range" min="20" max="60" value={temperature}
            onChange={(e) => setTemperature(Number(e.target.value))} />
        </label>
      </div>
      <div className={`mt-4 rounded-lg border p-3 text-xs ${ready ?
        'border-emerald-400/40 bg-emerald-900/20 text-emerald-300' :
        'border-rose-400/40 bg-rose-900/20 text-rose-300'}`}>
        {ready ? 'Simulation permits step advance.' :
          'Simulation blocks step advance pending review.'}
      </div>
      <p className="mt-3 text-xs text-slate-500">
        Not connected to actuators, relays, PLCs or actual safety systems.
      </p>
    </section>
  );
}

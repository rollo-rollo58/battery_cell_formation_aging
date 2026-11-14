'use client';
import { useState } from 'react';

type Channel = { lane: number; active: boolean; cycle: number };
const first: Channel[] = Array.from({ length: 12 }, (_, i) => ({
  lane: i + 1, active: i < 8, cycle: (i % 5) + 1,
}));

export default function ChargerSlotScheduler() {
  const [channels, setChannels] = useState(first);
  const active = channels.filter((channel) => channel.active).length;
  return (
    <section className="lab-panel lg:col-span-5">
      <div className="lab-title"><h2>Cycler channel scheduler</h2>
        <span className="badge">{active} / 12 assigned</span></div>
      <div className="grid grid-cols-3 gap-2">
        {channels.map((channel) => <button key={channel.lane}
          onClick={() => setChannels((rows) => rows.map((item) =>
            item.lane === channel.lane ? { ...item, active: !item.active } : item))}
          className={`rounded-lg border p-2 text-left text-xs
            ${channel.active ? 'border-lime-400/50 bg-lime-400/10' :
              'border-slate-800 bg-slate-950'}`}>
          <span className="block font-bold">CH-{String(channel.lane).padStart(2, '0')}</span>
          <span className="text-slate-400">{channel.active ?
            `Formation cycle ${channel.cycle}` : 'Unassigned'}</span>
        </button>)}
      </div>
      <p className="mt-3 text-xs text-slate-500">
        Simulated assignments only; no connection to physical charging equipment.
      </p>
    </section>
  );
}

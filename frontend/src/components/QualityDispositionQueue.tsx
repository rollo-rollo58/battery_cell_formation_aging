'use client';
import { useState } from 'react';

const initial = Array.from({ length: 10 }, (_, index) => ({
  id: `LFP-26-${String(index + 101).padStart(3, '0')}`,
  risk: (index * 13 + 7) % 100,
  disposition: index % 4 === 0 ? 'hold' : 'review',
}));

export default function QualityDispositionQueue() {
  const [rows, setRows] = useState(initial);
  const [onlyHolds, setOnlyHolds] = useState(false);
  const visible = rows.filter((row) => !onlyHolds || row.disposition === 'hold');
  return (
    <section className="lab-panel lg:col-span-4">
      <div className="lab-title"><h2>Quality disposition</h2>
        <button className="pill-off" onClick={() => setOnlyHolds(!onlyHolds)}>
          {onlyHolds ? 'All lots' : 'Holds only'}</button></div>
      <div className="max-h-60 overflow-auto">
        <table className="w-full text-left text-xs">
          <thead><tr className="text-slate-400">
            <th className="pb-2">Lot</th><th>Risk</th><th>Status</th><th>Action</th>
          </tr></thead>
          <tbody>{visible.map((row) => <tr key={row.id}
            className="border-t border-slate-800">
            <td className="py-2">{row.id}</td><td>{row.risk}</td>
            <td className="capitalize">{row.disposition}</td>
            <td><button className="pill-off" onClick={() => setRows((items) =>
              items.map((item) => item.id === row.id ? {
                ...item, disposition: item.disposition === 'hold' ? 'review' : 'hold',
              } : item))}>Toggle</button></td>
          </tr>)}</tbody>
        </table>
      </div>
    </section>
  );
}

import {
  Activity, BatteryCharging, FlaskConical, PanelTop, ShieldCheck,
} from 'lucide-react';
import CellRackMap from '../components/CellRackMap';
import FormationProfile from '../components/FormationProfile';
import ImpedanceNyquist from '../components/ImpedanceNyquist';
import CycleCapacityForecast from '../components/CycleCapacityForecast';
import ProtocolSequenceEditor from '../components/ProtocolSequenceEditor';
import ThermalChamberMatrix from '../components/ThermalChamberMatrix';
import CoulombicEfficiencyDistribution from '../components/CoulombicEfficiencyDistribution';
import QualityDispositionQueue from '../components/QualityDispositionQueue';
import ChargerSlotScheduler from '../components/ChargerSlotScheduler';
import DiagnosticWorkbench from '../components/DiagnosticWorkbench';
import TelemetryRibbon from '../components/TelemetryRibbon';
import InterlockSimulator from '../components/InterlockSimulator';

export default function Page() {
  return (
    <main className="min-h-screen bg-[#09111c] text-slate-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-16 flex-col items-center gap-7 border-r
          border-slate-800 bg-[#080e16] py-7 text-slate-400 lg:flex">
          <BatteryCharging size={25} className="text-lime-300" />
          <PanelTop size={20} /><Activity size={20} />
          <FlaskConical size={20} /><ShieldCheck size={20} />
        </aside>
        <div className="min-w-0 flex-1">
          <header className="flex flex-wrap items-end justify-between gap-4 border-b
            border-slate-800 bg-[#0c1523] px-6 py-7">
            <div><p className="text-xs font-bold uppercase tracking-[0.25em]
              text-lime-300">Electrochemical systems · Research operations</p>
              <h1 className="mt-3 text-2xl font-bold md:text-4xl">
                Cell formation command lab</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-400">
                Formation recipes, aging curves, impedance and grading evidence.
              </p>
            </div>
            <div className="rounded-lg border border-lime-300/40 bg-lime-300/10
              px-3 py-2 text-xs font-semibold text-lime-300">
              OFFLINE RESEARCH · SYNTHETIC DATA
            </div>
          </header>
          <div className="grid gap-4 p-4 md:p-6 lg:grid-cols-12">
            <div className="lg:col-span-12 flex flex-wrap gap-4 rounded-lg border
              border-slate-800 bg-slate-900/60 px-5 py-3 text-xs">
              <span><strong className="text-lime-300">96</strong> channels</span>
              <span><strong className="text-lime-300">8</strong> active recipes</span>
              <span><strong className="text-amber-300">4</strong> review holds</span>
              <span className="ml-auto text-slate-500">Demonstration measurements</span>
            </div>
            <CellRackMap /><FormationProfile /><ImpedanceNyquist />
            <CycleCapacityForecast /><ThermalChamberMatrix />
            <ProtocolSequenceEditor /><CoulombicEfficiencyDistribution />
            <ChargerSlotScheduler /><DiagnosticWorkbench />
            <QualityDispositionQueue /><TelemetryRibbon /><InterlockSimulator />
          </div>
          <footer className="px-6 pb-8 text-xs text-slate-500">
            Values are synthetic. Do not use outputs for equipment control or cell release.
          </footer>
        </div>
      </div>
    </main>
  );
}

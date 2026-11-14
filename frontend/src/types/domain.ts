export type Metric = (typeof metrics)[number];
export type Asset = (typeof assets)[number];
export type Scenario = (typeof scenarios)[number];
export const metrics = [
  "cell_voltage_v",
  "charge_capacity_ah",
  "dcir_milliohm",
  "coulombic_efficiency_pct",
  "surface_temperature_c",
  "self_discharge_mv_day",
] as const;
export const assets = [
  "cell",
  "cycler",
  "formation_rack",
  "thermal_chamber",
  "probe_station",
  "production_lot",
] as const;
export const scenarios = [
  "incoming",
  "wetting",
  "formation",
  "degas",
  "aging",
  "grading",
] as const;
export interface Observation {
  metric: Metric;
  asset: Asset;
  scenario: Scenario;
  value: number;
  timestamp: string;
}
export interface Rule {
  code: string;
  metric: string;
  asset: string;
  scenario: string;
  severity: string;
  lower: number;
  upper: number;
  weight: number;
  confidence: number;
  action: string;
}
export interface Assessment {
  score: number;
  rule: string;
  severity: string;
  action: string;
}

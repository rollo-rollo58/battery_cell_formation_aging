BEGIN;
INSERT INTO assets(asset_kind, name, properties)
VALUES ('cell', 'battery_cell_formation_aging-demo-01',
        '{"simulation": true, "tier": 1}'::jsonb)
ON CONFLICT (asset_kind, name) DO NOTHING;
INSERT INTO assets(asset_kind, name, properties)
VALUES ('cycler', 'battery_cell_formation_aging-demo-02',
        '{"simulation": true, "tier": 2}'::jsonb)
ON CONFLICT (asset_kind, name) DO NOTHING;
INSERT INTO assets(asset_kind, name, properties)
VALUES ('formation_rack', 'battery_cell_formation_aging-demo-03',
        '{"simulation": true, "tier": 3}'::jsonb)
ON CONFLICT (asset_kind, name) DO NOTHING;
INSERT INTO assets(asset_kind, name, properties)
VALUES ('thermal_chamber', 'battery_cell_formation_aging-demo-04',
        '{"simulation": true, "tier": 4}'::jsonb)
ON CONFLICT (asset_kind, name) DO NOTHING;
INSERT INTO assets(asset_kind, name, properties)
VALUES ('probe_station', 'battery_cell_formation_aging-demo-05',
        '{"simulation": true, "tier": 5}'::jsonb)
ON CONFLICT (asset_kind, name) DO NOTHING;
INSERT INTO assets(asset_kind, name, properties)
VALUES ('production_lot', 'battery_cell_formation_aging-demo-06',
        '{"simulation": true, "tier": 6}'::jsonb)
ON CONFLICT (asset_kind, name) DO NOTHING;
INSERT INTO observations(asset_id, metric, value, source)
SELECT id, 'cell_voltage_v', 1.23, 'synthetic_seed'
FROM assets ORDER BY created_at LIMIT 1;
INSERT INTO observations(asset_id, metric, value, source)
SELECT id, 'charge_capacity_ah', 2.46, 'synthetic_seed'
FROM assets ORDER BY created_at LIMIT 1;
INSERT INTO observations(asset_id, metric, value, source)
SELECT id, 'dcir_milliohm', 3.69, 'synthetic_seed'
FROM assets ORDER BY created_at LIMIT 1;
INSERT INTO observations(asset_id, metric, value, source)
SELECT id, 'coulombic_efficiency_pct', 4.92, 'synthetic_seed'
FROM assets ORDER BY created_at LIMIT 1;
INSERT INTO observations(asset_id, metric, value, source)
SELECT id, 'surface_temperature_c', 6.15, 'synthetic_seed'
FROM assets ORDER BY created_at LIMIT 1;
INSERT INTO observations(asset_id, metric, value, source)
SELECT id, 'self_discharge_mv_day', 7.38, 'synthetic_seed'
FROM assets ORDER BY created_at LIMIT 1;
COMMIT;

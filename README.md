# Battery Cell Formation and Aging Laboratory

**Domain:** Battery Cell Formation and Aging Laboratory  
**API runtime:** fastapi  
**Frontend:** Next.js App Router / TypeScript / Tailwind CSS  
**Persistence:** PostgreSQL 16 with four ordered SQL migrations.

## Purpose

This repository implements a domain-specific telemetry assessment demonstration with:

- Typed assessments scored against versioned scenario and asset policy catalogues.
- Asynchronous observations and reproducible evaluation IDs.
- A twelve-panel visual exploration interface with domain-specific dimensions.
- SQL relational storage, rollup views, audit triggers, and sample records.
- Containerized PostgreSQL and Redis for local development.

## Safety and quality boundary

Research demonstration only; synthetic rules are not certified standards. Do not use for
clinical, financial, transportation, or safety-critical decisions. The generated catalogue contains **8,840**
synthetic policy profiles, selected programmatically for development demonstrations.
Metrics and numeric bounds must be validated by a qualified domain specialist
before they can be interpreted as operational thresholds. Authentication,
observability and production deployment must undergo additional reviews.

## Scoring model

For observation x and configured interval [a, b], anomaly distance is
`max(a - x, 0, x - b) / max(b - a, 0.001)`.
The weighted score is `min(1, distance * weight * confidence)`.
The service returns the nearest relevant policy with an actionable label.

Tracked metrics:

- `cell_voltage_v`
- `charge_capacity_ah`
- `dcir_milliohm`
- `coulombic_efficiency_pct`
- `surface_temperature_c`
- `self_discharge_mv_day`

Assets:

- `cell`
- `cycler`
- `formation_rack`
- `thermal_chamber`
- `probe_station`
- `production_lot`

Situations:

- `incoming`
- `wetting`
- `formation`
- `degas`
- `aging`
- `grading`

## Local development

1. Copy `.env.example` into `.env` locally and replace all example secrets.
2. Run `docker compose up -d`.
3. Apply migrations 001 through 004 using `psql` against the local database.
4. Start the backend according to the commands below.
5. Run `cd frontend && npm install && npm run dev`.

### Backend

`cd backend && pip install -e . && uvicorn app.main:app --reload`

## HTTP contracts

- `GET /health` returns liveness information.
- `GET /api/metadata` returns metric, asset and scenario vocabularies.
- `POST /api/evaluate` accepts JSON `metric`, `asset`, `scenario`, `value`.
- `GET /api/rules?metric=...` exposes filtered catalogue entries when supported.
- `GET /api/stream` or a WebSocket endpoint is implemented where supported.

The frontend uses `NEXT_PUBLIC_API_URL`, defaulting to `http://localhost:8000`.
The UI can preview deterministic sample series before an API is connected.

## Structure

`backend/` contains the language-specific server and 13 policy catalogues.
`frontend/` contains twelve custom interactive domain panels.
`database/migrations/` contains tables, audit triggers, seeds, analytics.
`infra/` contains Kubernetes and monitoring configuration.

## Operational hardening checklist

- Confirm domain policies and expected units with independent domain reviewers.
- Configure TLS, signed tokens, RBAC, migrations, backups and audit retention.
- Validate data ingestion schemas, idempotency and integration contracts.
- Verify backend and frontend builds within pinned deployment images.
- Execute load, penetration, recovery, accessibility and domain acceptance tests.

## Licensing

No license is granted by default. Add an approved organizational license
before public or third-party distribution.

## Domain-specific applied mathematics

- `capacity_retention`: measured capacity as a percent of baseline capacity.
- `coulombic_efficiency`: delivered discharge Ah divided by charged Ah.
- `estimate_dcir`: absolute voltage drop divided by pulse current in mOhm.
- `thermal_excursion_minutes`: dwell-time integration outside the research envelope.
- `linear_capacity_fade`: ordinary least-squares estimate of Ah loss per cycle.
- `classify_cell`: explicit A / B / hold / review research grading decisions.

The front end is a laboratory instrument-console layout with twelve distinct
workflows: 96-channel map, CC/CV trace, Nyquist explorer, cycle-life projection,
recipe editor, thermal probes, coulombic efficiency distribution, quality queue,
charger scheduler, API grading workbench, telemetry ribbon and safety sandbox.

## Extra API operations

`POST /api/capacity-fade`: `{ "cycles": [0, 100],
"capacities_ah": [5.1, 4.98] }` returns regression coefficients.

`POST /api/cells/grade`: accepts baseline/current capacity, OCV and pulse
voltage, pulse current, charge/discharge integrals and excursion duration.
Returns research disposition and computed capacity retention, DCIR and CE.

All telemetry is synthetic and safe for exploratory demonstrations only.
The software is *not* a certified formation controller, BMS, PLC, safety
interlock or electrochemical acceptance specification. Operators must use
independent controls and an approved manufacturing quality system.

## Verification status

Builder validation covers ZIP integrity, allowed extensions, source line limits,
Python AST parsing, and source file counts. Dedicated unit tests cover key math.
A full production deployment, runtime security assessment, safety validation,
Next.js dependency build and hardware integration are not certified.

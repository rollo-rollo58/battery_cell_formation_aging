"""Battery formation research API: metrics, diagnostics and WebSocket feeds."""
from contextlib import asynccontextmanager
from fastapi import Depends, FastAPI, HTTPException, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from app.models import (
    Assessment, CapacitySeries, CellGradeRequest, Observation,
)
from app.engine import (
    catalog, classify_cell, coulombic_efficiency, capacity_retention,
    estimate_dcir, evaluate, linear_capacity_fade,
)
from app.repository import initialize_database, save_observation
from app.telemetry import stream


@asynccontextmanager
async def lifespan(app: FastAPI):
    await initialize_database()
    yield


app = FastAPI(title='Battery Cell Formation and Aging Laboratory', lifespan=lifespan)
app.add_middleware(
    CORSMiddleware, allow_origins=['http://localhost:3000'],
    allow_methods=['GET', 'POST'], allow_headers=['Content-Type', 'Authorization'],
)


@app.get('/health')
async def health() -> dict:
    return {'status': 'ok', 'mode': 'offline_research_simulation'}


@app.get('/api/metadata')
async def metadata() -> dict:
    return {'metrics': [
        'cell_voltage_v',
        'charge_capacity_ah',
        'dcir_milliohm',
        'coulombic_efficiency_pct',
        'surface_temperature_c',
        'self_discharge_mv_day'
    ],
            'assets': [
        'cell',
        'cycler',
        'formation_rack',
        'thermal_chamber',
        'probe_station',
        'production_lot'
    ],
            'scenarios': [
        'incoming',
        'wetting',
        'formation',
        'degas',
        'aging',
        'grading'
    ]}


@app.get('/api/rules')
async def rules(metric: str = '', limit: int = 40) -> list[dict]:
    if limit < 1 or limit > 200:
        raise HTTPException(422, 'limit must be from 1 to 200')
    selected = (r for r in catalog() if not metric or r['metric'] == metric)
    return [item for _, item in zip(range(limit), selected)]


@app.post('/api/evaluate', response_model=Assessment)
async def assessment(item: Observation) -> dict:
    try:
        response = evaluate(item.metric, item.asset, item.scenario, item.value)
        await save_observation(item.metric, item.asset, item.scenario, item.value)
        return response
    except ValueError as exc:
        raise HTTPException(422, str(exc)) from exc


@app.post('/api/capacity-fade')
async def capacity_fade(series: CapacitySeries) -> dict:
    try:
        return linear_capacity_fade(series.cycles, series.capacities_ah)
    except ValueError as exc:
        raise HTTPException(422, str(exc)) from exc


@app.post('/api/cells/grade')
async def grade_cell(item: CellGradeRequest) -> dict:
    try:
        retention = capacity_retention(
            item.initial_capacity_ah, item.current_capacity_ah,
        )
        resistance = estimate_dcir(
            item.pulse_ocv_v, item.pulse_loaded_v, item.pulse_current_a,
        )
        efficiency = coulombic_efficiency(
            item.charge_integral_ah, item.discharge_integral_ah,
        )
        result = classify_cell(
            retention, resistance, efficiency, item.thermal_excursion_minutes,
        )
        return {**result, 'capacity_retention_pct': retention,
                'dcir_milliohm': resistance, 'efficiency_pct': efficiency}
    except ValueError as exc:
        raise HTTPException(422, str(exc)) from exc


@app.websocket('/ws/telemetry')
async def websocket_telemetry(websocket: WebSocket) -> None:
    await stream(websocket, 'cell_voltage_v')

"""Deterministic diagnostic models for research bench-test datasets.

The policy catalogue is synthetic. It must not directly control cyclers or
substitute for an approved battery safety specification.
"""
from __future__ import annotations

from functools import lru_cache
import math
from statistics import mean
from typing import Any, Sequence

from app.rules_01 import RULES as C01
from app.rules_02 import RULES as C02
from app.rules_03 import RULES as C03
from app.rules_04 import RULES as C04
from app.rules_05 import RULES as C05
from app.rules_06 import RULES as C06
from app.rules_07 import RULES as C07
from app.rules_08 import RULES as C08
from app.rules_09 import RULES as C09
from app.rules_10 import RULES as C10
from app.rules_11 import RULES as C11
from app.rules_12 import RULES as C12
from app.rules_13 import RULES as C13

METRICS = frozenset((
    'cell_voltage_v',
    'charge_capacity_ah',
    'dcir_milliohm',
    'coulombic_efficiency_pct',
    'surface_temperature_c',
    'self_discharge_mv_day',
))


@lru_cache(maxsize=1)
def catalog() -> tuple[dict[str, Any], ...]:
    return tuple(item for section in (
        C01, C02, C03, C04,
        C05, C06, C07, C08,
        C09, C10, C11, C12,
        C13
    ) for item in section)


@lru_cache(maxsize=1)
def index_by_subject() -> dict[tuple[str, str, str], tuple[dict, ...]]:
    mapping: dict[tuple[str, str, str], list[dict]] = {}
    for row in catalog():
        key = (row['metric'], row['asset'], row['scenario'])
        mapping.setdefault(key, []).append(row)
    return {key: tuple(value) for key, value in mapping.items()}


def anomaly_distance(value: float, lower: float, upper: float) -> float:
    if not math.isfinite(value):
        raise ValueError('Measurement must be finite')
    if not lower < upper:
        raise ValueError('Threshold interval is invalid')
    gap = max(lower - value, 0.0, value - upper)
    return gap / (upper - lower)


def evaluate(metric: str, asset: str, scenario: str, value: float) -> dict:
    if metric not in METRICS:
        raise ValueError('Unknown cell-formation metric')
    if not isinstance(value, (int, float)) or not math.isfinite(value):
        raise ValueError('Measurement must be a finite number')
    candidates = index_by_subject().get((metric, asset, scenario), ())
    if not candidates:
        raise ValueError('No policy matches the measurement subject')
    selected = min(candidates, key=lambda row: (
        anomaly_distance(value, row['lower'], row['upper']),
        row['upper'] - row['lower'], row['code'],
    ))
    distance = anomaly_distance(value, selected['lower'], selected['upper'])
    risk = min(1.0, distance * selected['weight'] * selected['confidence'])
    severity = 'normal' if risk == 0 else (
        'critical' if risk > .65 else 'elevated' if risk > .25 else 'watch'
    )
    return {
        'score': round(risk, 6),
        'rule': selected['code'],
        'severity': severity,
        'action': selected['action'],
    }


def capacity_retention(initial_ah: float, current_ah: float) -> float:
    if not all(math.isfinite(x) for x in (initial_ah, current_ah)):
        raise ValueError('Capacities must be finite')
    if initial_ah <= 0 or current_ah < 0:
        raise ValueError('Capacities must be physically nonnegative')
    return round(100.0 * current_ah / initial_ah, 5)


def coulombic_efficiency(charge_ah: float, discharge_ah: float) -> float:
    if not all(math.isfinite(x) for x in (charge_ah, discharge_ah)):
        raise ValueError('Charge integrals must be finite')
    if charge_ah <= 0 or discharge_ah < 0:
        raise ValueError('Invalid coulombic integrals')
    return round(100.0 * discharge_ah / charge_ah, 5)


def estimate_dcir(
    open_circuit_voltage_v: float,
    pulse_voltage_v: float,
    pulse_current_a: float,
) -> float:
    if not all(math.isfinite(x) for x in (
        open_circuit_voltage_v, pulse_voltage_v, pulse_current_a,
    )):
        raise ValueError('Pulse values must be finite')
    if pulse_current_a == 0:
        raise ValueError('Nonzero current required for DCIR')
    resistance = 1000.0 * abs(
        (open_circuit_voltage_v - pulse_voltage_v) / pulse_current_a
    )
    return round(resistance, 5)


def thermal_excursion_minutes(
    samples: Sequence[float], interval_seconds: float,
    lower_c: float = 16.0, upper_c: float = 50.0,
) -> float:
    if interval_seconds <= 0 or not math.isfinite(interval_seconds):
        raise ValueError('Invalid sample interval')
    if lower_c >= upper_c or not all(math.isfinite(x) for x in samples):
        raise ValueError('Invalid temperature series or envelope')
    outside = sum(not lower_c <= x <= upper_c for x in samples)
    return round(outside * interval_seconds / 60.0, 5)


def linear_capacity_fade(cycle_numbers: Sequence[int], values_ah: Sequence[float]):
    if len(cycle_numbers) != len(values_ah) or len(cycle_numbers) < 2:
        raise ValueError('At least two aligned observations are required')
    if len(set(cycle_numbers)) != len(cycle_numbers):
        raise ValueError('Cycle numbers must be unique')
    if not all(math.isfinite(value) and value >= 0 for value in values_ah):
        raise ValueError('Capacity observations must be valid')
    xbar, ybar = mean(cycle_numbers), mean(values_ah)
    denom = sum((x - xbar) ** 2 for x in cycle_numbers)
    if denom <= 0:
        raise ValueError('Unidentifiable fade model')
    slope = sum(
        (x - xbar) * (y - ybar)
        for x, y in zip(cycle_numbers, values_ah)
    ) / denom
    intercept = ybar - slope * xbar
    residual = sum(
        (y - (intercept + slope * x)) ** 2
        for x, y in zip(cycle_numbers, values_ah)
    )
    return {
        'capacity_ah_at_cycle_zero': round(intercept, 6),
        'fade_ah_per_cycle': round(slope, 8),
        'root_mean_square_error_ah': round(math.sqrt(residual / len(values_ah)), 6),
    }


def classify_cell(
    retention_pct: float, dcir_milliohm: float,
    efficiency_pct: float, excursion_minutes: float,
) -> dict:
    values = (retention_pct, dcir_milliohm, efficiency_pct, excursion_minutes)
    if not all(math.isfinite(value) and value >= 0 for value in values):
        raise ValueError('Grade inputs must be finite and nonnegative')
    if excursion_minutes > 0 or dcir_milliohm > 42:
        grade = 'hold'
        reason = 'Thermal excursion or elevated direct-current resistance'
    elif retention_pct >= 95 and efficiency_pct >= 99.5 and dcir_milliohm <= 28:
        grade = 'A'
        reason = 'Capacity retention, efficiency and DCIR within A envelope'
    elif retention_pct >= 90 and efficiency_pct >= 98.5 and dcir_milliohm <= 35:
        grade = 'B'
        reason = 'Meets B research-band acceptance conditions'
    else:
        grade = 'review'
        reason = 'Manual quality engineering review required'
    return {'grade': grade, 'reason': reason, 'research_only': True}

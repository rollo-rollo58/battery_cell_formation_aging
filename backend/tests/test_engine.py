import math
import pytest
from app.engine import (
    anomaly_distance, capacity_retention, catalog, classify_cell,
    coulombic_efficiency, estimate_dcir, evaluate, index_by_subject,
    linear_capacity_fade, thermal_excursion_minutes,
)


def test_catalog_is_unique_and_indexed():
    items = catalog()
    assert len(items) == 8840
    assert len({row['code'] for row in items}) == len(items)
    assert all(index_by_subject().values())


def test_measurement_scoring_stays_bounded():
    row = catalog()[0]
    value = (row['lower'] + row['upper']) / 2
    result = evaluate(row['metric'], row['asset'], row['scenario'], value)
    assert 0 <= result['score'] <= 1


def test_invalid_metric_cannot_fall_back_to_another_policy():
    with pytest.raises(ValueError):
        evaluate('not_a_battery_metric', 'cell', 'formation', 3.5)


def test_anomaly_distance_matches_normalized_gap():
    assert anomaly_distance(11.0, 2.0, 10.0) == pytest.approx(0.125)
    assert anomaly_distance(6.0, 2.0, 10.0) == 0


def test_capacity_retention_and_efficiency():
    assert capacity_retention(5, 4.75) == 95
    assert coulombic_efficiency(5, 4.95) == 99


def test_dcir_uses_ohms_law():
    assert estimate_dcir(4.1, 4.05, 2) == 25
    with pytest.raises(ValueError):
        estimate_dcir(4.1, 4.05, 0)


def test_thermal_excursion_integrates_sample_dwell():
    assert thermal_excursion_minutes([20, 53, 52, 25], 30) == 1.0


def test_capacity_fade_fits_monotonic_series():
    model = linear_capacity_fade([0, 100, 200], [5.0, 4.9, 4.8])
    assert model['fade_ah_per_cycle'] == pytest.approx(-0.001)
    assert model['root_mean_square_error_ah'] == 0


def test_grade_rules_have_explicit_hold():
    assert classify_cell(98, 25, 99.9, 0)['grade'] == 'A'
    assert classify_cell(99, 55, 99.9, 0)['grade'] == 'hold'
    assert classify_cell(99, 25, 99.9, 5)['grade'] == 'hold'


def test_non_finite_values_are_rejected():
    with pytest.raises(ValueError):
        capacity_retention(5, math.nan)

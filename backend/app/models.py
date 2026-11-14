from datetime import datetime
from pydantic import BaseModel, Field
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import Float, String, DateTime, func


class Base(DeclarativeBase):
    pass


class ObservationORM(Base):
    __tablename__ = "observations_ingest"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    metric: Mapped[str] = mapped_column(String(120), index=True)
    asset: Mapped[str] = mapped_column(String(120), index=True)
    scenario: Mapped[str] = mapped_column(String(120), index=True)
    value: Mapped[float] = mapped_column(Float)
    observed_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(),
    )


class Observation(BaseModel):
    metric: str = Field(min_length=1, max_length=120)
    asset: str = Field(min_length=1, max_length=120)
    scenario: str = Field(min_length=1, max_length=120)
    value: float = Field(ge=-1e12, le=1e12, allow_inf_nan=False)


class Assessment(BaseModel):
    score: float
    rule: str
    severity: str
    action: str


class CapacitySeries(BaseModel):
    cycles: list[int] = Field(min_length=2, max_length=5000)
    capacities_ah: list[float] = Field(min_length=2, max_length=5000)


class CellGradeRequest(BaseModel):
    initial_capacity_ah: float = Field(gt=0)
    current_capacity_ah: float = Field(ge=0)
    pulse_ocv_v: float
    pulse_loaded_v: float
    pulse_current_a: float
    charge_integral_ah: float = Field(gt=0)
    discharge_integral_ah: float = Field(ge=0)
    thermal_excursion_minutes: float = Field(ge=0)

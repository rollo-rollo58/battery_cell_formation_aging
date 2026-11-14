import os
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlalchemy import select
from app.models import Base, ObservationORM

raw = os.getenv("DATABASE_URL", "")
url = raw.replace("postgresql://", "postgresql+asyncpg://", 1)
engine = create_async_engine(url, pool_pre_ping=True) if url else None
sessions = async_sessionmaker(engine, expire_on_commit=False) if engine else None

async def initialize_database() -> None:
    if engine:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

async def save_observation(metric: str, asset: str, scenario: str, value: float) -> None:
    if not sessions:
        return
    async with sessions() as session:
        session.add(ObservationORM(
            metric=metric, asset=asset, scenario=scenario, value=value,
        ))
        await session.commit()

async def recent(metric: str, limit: int = 30) -> list[float]:
    if not sessions:
        return []
    async with sessions() as session:
        query = select(ObservationORM.value).where(ObservationORM.metric == metric)
        query = query.order_by(ObservationORM.id.desc()).limit(min(1000, limit))
        return list((await session.scalars(query)).all())

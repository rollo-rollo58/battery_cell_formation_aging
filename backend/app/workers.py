import os
from celery import Celery
from app.engine import evaluate

queue = Celery("platform", broker=os.getenv("REDIS_URL", "redis://localhost:6379/0"))

@queue.task(name="platform.assess_observation", max_retries=3)
def assess_observation(metric: str, asset: str, scenario: str, value: float) -> dict:
    return evaluate(metric, asset, scenario, value)

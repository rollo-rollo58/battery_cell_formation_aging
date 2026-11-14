import asyncio
import math
from fastapi import WebSocket, WebSocketDisconnect


async def stream(websocket: WebSocket, metric: str) -> None:
    await websocket.accept()
    tick = 0
    try:
        while True:
            tick += 1
            sample = round(3.65 + math.sin(tick / 7) * 0.3, 4)
            await websocket.send_json({'metric': metric, 'value': sample})
            await asyncio.sleep(1.5)
    except (WebSocketDisconnect, RuntimeError):
        return

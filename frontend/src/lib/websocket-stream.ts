export type StreamHandler = (value: number) => void;
export function openTelemetryStream(
  metric: string, onValue: StreamHandler,
): () => void {
  const service = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';
  const endpoint = `${service.replace(/^http/, 'ws')}/ws/telemetry`;
  let socket: WebSocket | null = null;
  let timer: ReturnType<typeof setInterval> | null = null;
  try {
    socket = new WebSocket(endpoint);
    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(String(event.data)) as {
          metric?: string; value?: number;
        };
        if (payload.metric === metric && typeof payload.value === 'number') {
          onValue(payload.value);
        }
      } catch {
        return;
      }
    };
  } catch {
    socket = null;
  }
  let tick = 0;
  timer = setInterval(() => {
    tick += 1;
    if (socket?.readyState !== WebSocket.OPEN) {
      onValue(3.65 + Math.sin(tick / 7) * 0.3);
    }
  }, 1600);
  return () => {
    if (timer) clearInterval(timer);
    socket?.close();
  };
}

# railway-iot-dashboard

Next.js 14 real-time monitoring dashboard for **railway-iot-platform**.

---

## Responsibilities

- Login page with JWT authentication
- Live railway map with device positions (Leaflet.js)
- Real-time sensor charts via authenticated WebSocket
- Alert management panel (acknowledge alerts)
- Connected/disconnected status indicator

---

## Stack

| Component | Library |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Map | Leaflet.js + react-leaflet |
| Charts | Recharts |
| Data fetching | SWR |
| Real-time | Native WebSocket |
| Auth | JWT (stored in `localStorage`) |

---

## Pages & Routes

| Route | Description |
|---|---|
| `/login` | Username + password login form |
| `/dashboard` | Main monitoring dashboard (requires auth) |

Unauthenticated access to `/dashboard` redirects to `/login`.

---

## Authentication Flow

1. User submits credentials on `/login`
2. Dashboard calls `POST /api/v1/auth/token/` → receives `access` + `refresh` JWT tokens
3. Tokens stored in `localStorage` (`access_token`, `refresh_token`)
4. All REST requests include `Authorization: Bearer <access_token>` header
5. WebSocket connections include `?token=<access_token>` in URL
6. On logout, tokens cleared from `localStorage`

---

## Real-time Data

### Telemetry WebSocket
Connects to `ws://<WS_URL>/ws/telemetry/?token=<jwt>`.

- Reconnects automatically on disconnect (3 s backoff)
- Accumulates readings in a `Map<"device:metric", SensorReading[]>` (last 100 points per series)
- Derives `deviceIds` and `metrics` lists from received data

### Alerts WebSocket
Connects to `ws://<WS_URL>/ws/alerts/?token=<jwt>`.

- New alerts are prepended to the alert list (max 100 in memory)
- Initial alert list fetched via REST on mount, refreshed every 30 s

---

## Environment Variables

These are **build-time** variables (baked into the Next.js bundle by `npm run build`):

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8003` | REST API base URL |
| `NEXT_PUBLIC_WS_URL` | `ws://localhost:8003` | WebSocket base URL |

> Changing these values requires rebuilding the Docker image:
> ```bash
> docker compose build --no-cache dashboard
> ```

---

## Key Components

| File | Description |
|---|---|
| `src/app/login/page.tsx` | Login form — calls `login()` from `lib/auth.ts` |
| `src/app/dashboard/page.tsx` | Main dashboard — map + chart + alerts |
| `src/hooks/useTelemetrySocket.ts` | WebSocket hook for sensor readings |
| `src/hooks/useAlerts.ts` | SWR + WebSocket hook for alerts |
| `src/components/RailwayMap.tsx` | Leaflet map (SSR disabled) |
| `src/components/SensorChart.tsx` | Recharts time-series chart |
| `src/components/AlertPanel.tsx` | Alert list with acknowledge button |
| `src/components/NavBar.tsx` | Top bar with connection status + alert badge |
| `src/lib/auth.ts` | JWT token management (login, logout, refresh) |
| `src/lib/constants.ts` | `API_URL`, `WS_URL`, `METRIC_CONFIG`, `MAX_CHART_POINTS` |
| `src/lib/types.ts` | TypeScript types: `SensorReading`, `Alert`, `ReadingsMap` |

---

## Local Dev (without Docker)

```bash
npm install

# Set env vars (or create .env.local)
export NEXT_PUBLIC_API_URL=http://localhost:8003
export NEXT_PUBLIC_WS_URL=ws://localhost:8003

npm run dev
# → http://localhost:3000
```

---

## Docker Build

```bash
# Build (bakes NEXT_PUBLIC_* vars from docker-compose build args)
docker compose build dashboard

# Run standalone
docker compose up -d dashboard
```

The Dockerfile uses `output: 'standalone'` for a minimal production image.

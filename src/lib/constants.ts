export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

export const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:8000'

export const ZONE_COORDINATES: Record<string, [number, number]> = {
  'zona-norte':  [40.4530, -3.6883],
  'zona-centro': [40.4068, -3.6920],
  'zona-sur':    [40.3059, -3.7314],
  'zona-este':   [40.4817, -3.3633],
  'zona-oeste':  [40.4228, -3.7177],
}

export const DEFAULT_MAP_CENTER: [number, number] = [40.4168, -3.7038]
export const DEFAULT_MAP_ZOOM = 11

export const METRIC_CONFIG: Record<
  string,
  { label: string; unit: string; color: string; warningThreshold: number; criticalThreshold: number }
> = {
  temperature:     { label: 'Temperature',    unit: '°C',   color: '#ef4444', warningThreshold: 70,    criticalThreshold: 82 },
  vibration:       { label: 'Vibration',      unit: 'mm/s', color: '#f97316', warningThreshold: 7,     criticalThreshold: 9 },
  rpm:             { label: 'RPM',            unit: 'rpm',  color: '#3b82f6', warningThreshold: 1600,  criticalThreshold: 1750 },
  'brake-pressure':{ label: 'Brake Pressure', unit: 'bar',  color: '#8b5cf6', warningThreshold: 7,     criticalThreshold: 7.8 },
  'load-weight':   { label: 'Load Weight',    unit: 'kg',   color: '#22c55e', warningThreshold: 72000, criticalThreshold: 78000 },
}

export const SEVERITY_COLORS: Record<string, string> = {
  low:      'bg-blue-100 text-blue-800',
  medium:   'bg-yellow-100 text-yellow-800',
  high:     'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800',
}

export const MAX_CHART_POINTS = 60

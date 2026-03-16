import { API_URL } from './constants'
import type { Alert, Device, SensorReading, Zone } from './types'

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`)
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`)
  return res.json()
}

export const api = {
  readings: {
    list: (params: Record<string, string | number> = {}) => {
      const qs = new URLSearchParams(
        Object.entries(params).map(([k, v]) => [k, String(v)])
      ).toString()
      return apiFetch<SensorReading[]>(`/api/v1/readings/${qs ? `?${qs}` : ''}`)
    },
    latest: (zone?: string) =>
      apiFetch<SensorReading[]>(`/api/v1/readings/latest/${zone ? `?zone=${zone}` : ''}`),
  },

  alerts: {
    list: (acknowledged = false) =>
      apiFetch<Alert[]>(`/api/v1/alerts/?acknowledged=${acknowledged}&limit=50`),
    acknowledge: (id: number) =>
      fetch(`${API_URL}/api/v1/alerts/${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ acknowledged: true }),
      }),
  },

  devices: {
    list: (zone?: string) =>
      apiFetch<Device[]>(`/api/v1/devices/${zone ? `?zone=${zone}` : ''}`),
  },

  zones: {
    list: () => apiFetch<Zone[]>('/api/v1/zones/'),
  },
}

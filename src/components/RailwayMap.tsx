'use client'

import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from 'react-leaflet'
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM, ZONE_COORDINATES } from '@/lib/constants'
import type { ReadingsMap } from '@/lib/types'

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

interface Props {
  readings: ReadingsMap
  selectedDevice: string
  onSelectDevice: (deviceId: string) => void
}

function devicePosition(zone: string, deviceId: string): [number, number] {
  const center = ZONE_COORDINATES[zone] ?? DEFAULT_MAP_CENTER
  const num = parseInt(deviceId.replace(/\D/g, '').slice(-3) || '0', 10)
  return [
    center[0] + Math.sin(num * 1.7) * 0.015,
    center[1] + Math.cos(num * 2.3) * 0.018,
  ]
}

function deviceColor(deviceId: string, readings: ReadingsMap): string {
  let maxValue = 0
  let hasData = false

  for (const [key, points] of readings.entries()) {
    if (!key.startsWith(`${deviceId}:`)) continue
    if (points.length === 0) continue
    hasData = true
    const latest = points[points.length - 1]
    if (latest.anomaly) return '#ef4444'
    maxValue = Math.max(maxValue, latest.value)
  }

  if (!hasData) return '#9ca3af'
  return '#22c55e'
}

export default function RailwayMap({ readings, selectedDevice, onSelectDevice }: Props) {

  const devices = Array.from(
    new Map(
      Array.from(readings.entries()).map(([key, points]) => {
        const deviceId = key.split(':')[0]
        const zone = points[points.length - 1]?.zone ?? 'zone-a'
        return [deviceId, zone]
      })
    ).entries()
  )

  return (
    <MapContainer
      center={DEFAULT_MAP_CENTER}
      zoom={DEFAULT_MAP_ZOOM}
      className="h-full w-full rounded-lg"
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {devices.map(([deviceId, zone]) => {
        const position = devicePosition(zone, deviceId)
        const color = deviceColor(deviceId, readings)
        const isSelected = deviceId === selectedDevice

        return (
          <CircleMarker
            key={deviceId}
            center={position}
            radius={isSelected ? 10 : 7}
            pathOptions={{
              fillColor: color,
              fillOpacity: 0.9,
              color: isSelected ? '#1e3a5f' : '#fff',
              weight: isSelected ? 2.5 : 1.5,
            }}
            eventHandlers={{ click: () => onSelectDevice(deviceId) }}
          >
            <Tooltip>{deviceId}</Tooltip>
            <Popup>
              <div className="text-sm">
                <p className="font-bold">{deviceId}</p>
                <p className="text-gray-500">Zone: {zone}</p>
              </div>
            </Popup>
          </CircleMarker>
        )
      })}
    </MapContainer>
  )
}

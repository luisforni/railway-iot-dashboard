'use client'

import { useEffect, useRef, useState } from 'react'
import { MAX_CHART_POINTS, WS_URL } from '@/lib/constants'
import { getAccessToken } from '@/lib/auth'
import type { ReadingsMap, SensorReading } from '@/lib/types'

export function useTelemetrySocket() {
  const [readings, setReadings] = useState<ReadingsMap>(new Map())
  const [connected, setConnected] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const retryRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    let cancelled = false

    const connect = () => {
      if (cancelled) return

      const token = getAccessToken()
      const ws = new WebSocket(`${WS_URL}/ws/telemetry/${token ? `?token=${token}` : ''}`)
      wsRef.current = ws

      ws.onopen = () => setConnected(true)

      ws.onclose = () => {
        setConnected(false)
        if (!cancelled) {
          retryRef.current = setTimeout(connect, 3000)
        }
      }

      ws.onerror = () => ws.close()

      ws.onmessage = (event) => {
        try {
          const raw = JSON.parse(event.data as string)
          const reading: SensorReading = { ...raw, time: raw.time ?? raw.timestamp }
          setReadings((prev) => {
            const key = `${reading.device_id}:${reading.metric}`
            const existing = prev.get(key) ?? []
            const updated = [...existing, reading].slice(-MAX_CHART_POINTS)
            return new Map(prev).set(key, updated)
          })
        } catch {

        }
      }
    }

    connect()

    return () => {
      cancelled = true
      if (retryRef.current) clearTimeout(retryRef.current)
      wsRef.current?.close()
    }
  }, [])

  const deviceIds = Array.from(
    new Set(Array.from(readings.keys()).map((k) => k.split(':')[0]))
  ).sort()

  const metrics = Array.from(
    new Set(Array.from(readings.keys()).map((k) => k.split(':')[1]))
  ).sort()

  return { readings, connected, deviceIds, metrics }
}

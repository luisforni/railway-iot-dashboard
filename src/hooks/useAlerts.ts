'use client'

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { API_URL, WS_URL } from '@/lib/constants'
import { getAccessToken, authHeaders } from '@/lib/auth'
import type { Alert } from '@/lib/types'

const fetcher = (url: string) =>
  fetch(url, { headers: authHeaders() }).then((r) => r.json())

export function useAlerts() {
  const { data: initial = [] } = useSWR<Alert[]>(
    `${API_URL}/api/v1/alerts/?acknowledged=false&limit=50`,
    fetcher,
    { refreshInterval: 30_000 }
  )

  const [alerts, setAlerts] = useState<Alert[]>([])

  useEffect(() => {
    if (initial.length > 0) setAlerts(initial)
  }, [initial])

  useEffect(() => {
    const token = getAccessToken()
    const ws = new WebSocket(`${WS_URL}/ws/alerts/${token ? `?token=${token}` : ''}`)

    ws.onmessage = (event) => {
      try {
        const alert: Alert = JSON.parse(event.data as string)
        setAlerts((prev) => [alert, ...prev].slice(0, 100))
      } catch {

      }
    }

    return () => ws.close()
  }, [])

  const acknowledge = async (id: number) => {
    await fetch(`${API_URL}/api/v1/alerts/${id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ acknowledged: true }),
    })
    setAlerts((prev) => prev.filter((a) => a.id !== id))
  }

  const unacknowledgedCount = alerts.filter((a) => !a.acknowledged).length

  return { alerts, acknowledge, unacknowledgedCount }
}

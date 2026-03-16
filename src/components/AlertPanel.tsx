'use client'

import { SEVERITY_COLORS } from '@/lib/constants'
import type { Alert } from '@/lib/types'

interface Props {
  alerts: Alert[]
  onAcknowledge: (id: number) => void
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const s = Math.floor(diff / 1000)
  if (s < 60) return `${s}s ago`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  return `${Math.floor(m / 60)}h ago`
}

export default function AlertPanel({ alerts, onAcknowledge }: Props) {
  const active = alerts.filter((a) => !a.acknowledged)

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-semibold text-gray-800">Active Alerts</h2>
        <span className="text-xs text-gray-400">{active.length} unacknowledged</span>
      </div>

      {active.length === 0 ? (
        <div className="px-5 py-6 text-center text-sm text-gray-400">
          No active alerts — all systems nominal ✓
        </div>
      ) : (
        <ul className="divide-y divide-gray-50 max-h-52 overflow-y-auto">
          {active.map((alert) => (
            <li key={alert.id} className="px-5 py-3 flex items-start gap-3 hover:bg-gray-50">
              <span
                className={`mt-0.5 text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${
                  SEVERITY_COLORS[alert.severity] ?? 'bg-gray-100 text-gray-700'
                }`}
              >
                {alert.severity.toUpperCase()}
              </span>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {alert.device_id}
                  <span className="text-gray-400 font-normal"> · {alert.metric}</span>
                </p>
                <p className="text-xs text-gray-500 truncate">{alert.message}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-gray-400">{timeAgo(alert.created_at)}</span>
                <button
                  onClick={() => onAcknowledge(alert.id)}
                  className="text-xs text-green-600 hover:text-green-800 font-medium"
                >
                  ACK
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

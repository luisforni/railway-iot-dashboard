'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { METRIC_CONFIG } from '@/lib/constants'
import type { SensorReading } from '@/lib/types'

interface Props {
  readings: SensorReading[]
  metric: string
}

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
  } catch {
    return iso
  }
}

export default function SensorChart({ readings, metric }: Props) {
  const config = METRIC_CONFIG[metric]
  const data = readings.map((r) => ({
    time: formatTime(r.time),
    value: r.value,
  }))

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        Waiting for data...
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

        <XAxis
          dataKey="time"
          tick={{ fontSize: 11, fill: '#6b7280' }}
          interval="preserveStartEnd"
          tickLine={false}
        />

        <YAxis
          tick={{ fontSize: 11, fill: '#6b7280' }}
          tickLine={false}
          axisLine={false}
          unit={config ? ` ${config.unit}` : ''}
          width={70}
        />

        <Tooltip
          contentStyle={{ fontSize: 12, borderRadius: 6 }}
          formatter={(value: number) =>
            [`${value.toFixed(2)} ${config?.unit ?? ''}`, config?.label ?? metric]
          }
        />

        {config && (
          <ReferenceLine
            y={config.warningThreshold}
            stroke="#f97316"
            strokeDasharray="4 4"
            label={{ value: 'Warning', fontSize: 10, fill: '#f97316' }}
          />
        )}
        {config && (
          <ReferenceLine
            y={config.criticalThreshold}
            stroke="#ef4444"
            strokeDasharray="4 4"
            label={{ value: 'Critical', fontSize: 10, fill: '#ef4444' }}
          />
        )}

        <Line
          type="monotone"
          dataKey="value"
          stroke={config?.color ?? '#3b82f6'}
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

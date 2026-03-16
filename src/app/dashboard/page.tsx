'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import NavBar from '@/components/NavBar'
import SensorChart from '@/components/SensorChart'
import AlertPanel from '@/components/AlertPanel'
import { useAlerts } from '@/hooks/useAlerts'
import { useTelemetrySocket } from '@/hooks/useTelemetrySocket'
import { METRIC_CONFIG } from '@/lib/constants'

const RailwayMap = dynamic(() => import('@/components/RailwayMap'), { ssr: false })

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated()) router.replace('/login')
  }, [router])

  const { readings, connected, deviceIds, metrics } = useTelemetrySocket()
  const { alerts, acknowledge, unacknowledgedCount } = useAlerts()

  const [selectedDevice, setSelectedDevice] = useState<string>('')
  const [selectedMetric, setSelectedMetric] = useState<string>('temperature')

  const activeDevice = (deviceIds.includes(selectedDevice) ? selectedDevice : deviceIds[0]) ?? ''
  const activeMetric = (metrics.includes(selectedMetric) ? selectedMetric : metrics[0]) ?? 'temperature'

  const chartData = readings.get(`${activeDevice}:${activeMetric}`) ?? []

  const metricOptions = Object.keys(METRIC_CONFIG)

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar connected={connected} alertCount={unacknowledgedCount} />

      <main className="flex-1 p-4 flex flex-col gap-4">
        {}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4" style={{ height: 420 }}>

          {}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between shrink-0">
              <h2 className="font-semibold text-gray-800">Railway Map</h2>
              <span className="text-xs text-gray-400">
                {deviceIds.length} device{deviceIds.length !== 1 ? 's' : ''} online
              </span>
            </div>
            <div className="flex-1">
              <RailwayMap
                readings={readings}
                selectedDevice={activeDevice}
                onSelectDevice={(id) => setSelectedDevice(id)}
              />
            </div>
          </div>

          {}
          <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
            <div className="px-4 py-3 border-b border-gray-100 flex flex-wrap items-center gap-3 shrink-0">
              <h2 className="font-semibold text-gray-800">Sensor Readings</h2>

              {}
              <select
                value={activeDevice}
                onChange={(e) => setSelectedDevice(e.target.value)}
                className="ml-auto text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                {deviceIds.length === 0 ? (
                  <option>Waiting for devices...</option>
                ) : (
                  deviceIds.map((id) => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                  ))
                )}
              </select>

              {}
              <select
                value={activeMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                {metricOptions.map((m) => (
                  <option key={m} value={m}>
                    {METRIC_CONFIG[m]?.label ?? m}
                  </option>
                ))}
              </select>
            </div>

            {}
            <div className="flex-1 p-3">
              <SensorChart readings={chartData} metric={activeMetric} />
            </div>

            {}
            {chartData.length > 0 && (
              <div className="px-4 pb-3 flex gap-6 text-xs text-gray-500">
                {(['min', 'avg', 'max'] as const).map((stat) => {
                  const vals = chartData.map((r) => r.value)
                  const value =
                    stat === 'min'
                      ? Math.min(...vals)
                      : stat === 'max'
                      ? Math.max(...vals)
                      : vals.reduce((a, b) => a + b, 0) / vals.length
                  return (
                    <span key={stat}>
                      <span className="uppercase text-gray-400">{stat}</span>{' '}
                      <span className="font-medium text-gray-700">
                        {value.toFixed(2)} {METRIC_CONFIG[activeMetric]?.unit}
                      </span>
                    </span>
                  )
                })}
                <span className="ml-auto">{chartData.length} points</span>
              </div>
            )}
          </div>
        </div>

        {}
        <AlertPanel alerts={alerts} onAcknowledge={acknowledge} />
      </main>
    </div>
  )
}

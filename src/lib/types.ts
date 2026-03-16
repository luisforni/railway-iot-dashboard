export interface SensorReading {
  time: string
  device_id: string
  zone: string
  metric: string
  value: number
  unit: string
  anomaly: boolean
}

export interface Alert {
  id: number
  device_id: string
  zone: string
  metric: string
  value: number
  threshold: number
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  acknowledged: boolean
  created_at: string
}

export interface Device {
  id: number
  device_id: string
  zone_name: string
  device_type: string
  active: boolean
  created_at: string
}

export interface Zone {
  id: number
  name: string
  description: string
  created_at: string
}

export type ReadingsMap = Map<string, SensorReading[]>

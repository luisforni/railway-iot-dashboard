interface NavBarProps {
  connected: boolean
  alertCount: number
}

export default function NavBar({ connected, alertCount }: NavBarProps) {
  return (
    <header className="bg-green-700 text-white px-6 py-3 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🚂</span>
        <div>
          <h1 className="text-lg font-bold leading-tight">Railway IoT Platform</h1>
          <p className="text-green-200 text-xs">Predictive Infrastructure Monitoring</p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              connected ? 'bg-green-300 animate-pulse' : 'bg-red-400'
            }`}
          />
          <span className="text-green-100">
            {connected ? 'Live' : 'Reconnecting...'}
          </span>
        </div>

        {alertCount > 0 && (
          <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            {alertCount} {alertCount === 1 ? 'alert' : 'alerts'}
          </span>
        )}
      </div>
    </header>
  )
}

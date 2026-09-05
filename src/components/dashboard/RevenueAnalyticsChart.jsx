import { useMemo, useState } from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { TrendingUp, FileText, Plus, Layers } from 'lucide-react'
import CountUp from '../common/CountUp'
import { THEMES } from '../../store/useThemeStore'

function CustomChartTooltip({ active, payload, label, isDark }) {
  if (!active || !payload || !payload.length) return null

  return (
    <div
      className={`rounded-xl border p-3 text-xs shadow-xl backdrop-blur-md transition-all font-sans min-w-[170px] ${
        isDark
          ? 'border-slate-700 bg-slate-900/95 text-slate-100 shadow-cyan-950/40'
          : 'border-gray-200 bg-white/95 text-gray-900 shadow-gray-200/80'
      }`}
    >
      <div className="flex items-center justify-between border-b pb-1.5 mb-2 border-gray-100 dark:border-slate-800">
        <span className="font-bold text-gray-700 dark:text-gray-200">{label}</span>
        <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
          Analytics
        </span>
      </div>
      <div className="space-y-1.5">
        {payload.map((entry, idx) => (
          <div key={idx} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: entry.color }}
              />
              <span className="capitalize text-gray-600 dark:text-gray-300">
                {entry.name}:
              </span>
            </div>
            <span className="font-bold font-mono text-gray-900 dark:text-white">
              ₹{Number(entry.value || 0).toLocaleString('en-IN')}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function RevenueAnalyticsChart({
  data = [],
  loading = false,
  theme = 'cyan',
  totalInvoiced = 0,
  totalPaid = 0,
  onNewLead,
}) {
  const [activeSeries, setActiveSeries] = useState('all') // 'all' | 'invoiced' | 'paid'

  // Determine active theme colors dynamically
  const activeTheme = useMemo(() => {
    return THEMES.find((t) => t.id === theme) || THEMES[0]
  }, [theme])

  const isDark = theme === 'midnight'
  const primaryColor = activeTheme.primary || '#0891b2'
  const accentColor = activeTheme.accent || '#0d9488'
  const paidColor = '#10b981'

  // Has data to display
  const hasData = useMemo(() => {
    if (!data || data.length === 0) return false
    return data.some((item) => (item.invoiced || 0) > 0 || (item.paid || 0) > 0)
  }, [data])

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs transition-colors dark:border-gray-800 dark:bg-gray-900/50">
      {/* Chart Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Revenue & Pipeline Velocity
            </h2>
            <span className="badge-theme inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
              <TrendingUp size={11} /> Live Trend
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Chronological growth of quoted pipeline values vs. settled payments.
          </p>
        </div>

        {/* View Series Controls */}
        <div className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 p-1 text-xs font-semibold dark:border-gray-800 dark:bg-gray-800/60">
          <button
            onClick={() => setActiveSeries('all')}
            className={`rounded-lg px-2.5 py-1 transition-colors cursor-pointer ${
              activeSeries === 'all'
                ? 'bg-white text-gray-900 font-bold shadow-2xs dark:bg-gray-700 dark:text-white'
                : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }`}
          >
            Combined
          </button>
          <button
            onClick={() => setActiveSeries('invoiced')}
            className={`rounded-lg px-2.5 py-1 transition-colors cursor-pointer ${
              activeSeries === 'invoiced'
                ? 'bg-white text-gray-900 font-bold shadow-2xs dark:bg-gray-700 dark:text-white'
                : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }`}
          >
            Quoted
          </button>
          <button
            onClick={() => setActiveSeries('paid')}
            className={`rounded-lg px-2.5 py-1 transition-colors cursor-pointer ${
              activeSeries === 'paid'
                ? 'bg-white text-gray-900 font-bold shadow-2xs dark:bg-gray-700 dark:text-white'
                : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }`}
          >
            Settled
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && data.length === 0 ? (
        <div className="h-[280px] w-full animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800/50 flex flex-col items-center justify-center p-6 space-y-3">
          <div className="h-6 w-36 bg-gray-200 dark:bg-gray-700 rounded-md" />
          <div className="h-40 w-full bg-gray-200/60 dark:bg-gray-700/40 rounded-lg" />
          <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded-md" />
        </div>
      ) : !hasData ? (
        /* Empty State */
        <div className="h-[280px] w-full rounded-xl border border-dashed border-gray-200 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-900/20 flex flex-col items-center justify-center p-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-theme-subtle text-theme mb-3 border border-theme">
            <FileText size={22} />
          </div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
            No Transaction Trend Data Yet
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mt-1 mb-4">
            Generate quotations and record client inquiries to begin visualizing your real-time revenue pipeline curves!
          </p>
          {onNewLead && (
            <button
              onClick={onNewLead}
              className="btn-theme-gradient inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold shadow-xs cursor-pointer"
            >
              <Plus size={14} /> Add First Inquiry
            </button>
          )}
        </div>
      ) : (
        /* Recharts Responsive AreaChart */
        <div className="w-full h-[280px]">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            >
              <defs>
                {/* Primary Brand Theme Gradient */}
                <linearGradient id="primaryAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={primaryColor} stopOpacity={0.45} />
                  <stop offset="60%" stopColor={accentColor} stopOpacity={0.15} />
                  <stop offset="100%" stopColor={accentColor} stopOpacity={0.0} />
                </linearGradient>

                {/* Paid Settlements Emerald Gradient */}
                <linearGradient id="paidAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={paidColor} stopOpacity={0.4} />
                  <stop offset="80%" stopColor={paidColor} stopOpacity={0.05} />
                  <stop offset="100%" stopColor={paidColor} stopOpacity={0.0} />
                </linearGradient>
              </defs>

              {/* Minimal Clean Gridlines */}
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? '#334155' : '#f1f5f9'}
                vertical={false}
              />

              <XAxis
                dataKey="date"
                stroke={isDark ? '#64748b' : '#94a3b8'}
                fontSize={11}
                tickLine={false}
                axisLine={false}
                dy={6}
              />

              <YAxis
                stroke={isDark ? '#64748b' : '#94a3b8'}
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) =>
                  val >= 100000 ? `₹${(val / 100000).toFixed(1)}L` : val >= 1000 ? `₹${(val / 1000).toFixed(0)}k` : `₹${val}`
                }
              />

              <Tooltip
                content={<CustomChartTooltip isDark={isDark} />}
              />

              {/* Invoiced Area */}
              {(activeSeries === 'all' || activeSeries === 'invoiced') && (
                <Area
                  type="monotone"
                  dataKey="invoiced"
                  name="Quoted Pipeline"
                  stroke={primaryColor}
                  strokeWidth={2.5}
                  fill="url(#primaryAreaGrad)"
                  isAnimationActive={true}
                  animationDuration={800}
                  animationEasing="ease-out"
                  activeDot={{
                    r: 5,
                    fill: primaryColor,
                    stroke: isDark ? '#0f172a' : '#ffffff',
                    strokeWidth: 2,
                  }}
                />
              )}

              {/* Paid Settlements Area */}
              {(activeSeries === 'all' || activeSeries === 'paid') && (
                <Area
                  type="monotone"
                  dataKey="paid"
                  name="Settled & Realized"
                  stroke={paidColor}
                  strokeWidth={2}
                  fill="url(#paidAreaGrad)"
                  isAnimationActive={true}
                  animationDuration={800}
                  animationEasing="ease-out"
                  activeDot={{
                    r: 4,
                    fill: paidColor,
                    stroke: isDark ? '#0f172a' : '#ffffff',
                    strokeWidth: 2,
                  }}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Chart Footer Highlights */}
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: primaryColor }}
            />
            <span className="text-gray-500 dark:text-gray-400">Total Quoted:</span>
            <span className="font-bold text-gray-900 dark:text-white font-mono">
              <CountUp
                start={0}
                end={totalInvoiced}
                duration={1.0}
                formattingFn={(val) => `₹${Number(val).toLocaleString('en-IN')}`}
              />
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: paidColor }}
            />
            <span className="text-gray-500 dark:text-gray-400">Realized:</span>
            <span className="font-bold text-emerald-600 font-mono">
              <CountUp
                start={0}
                end={totalPaid}
                duration={1.0}
                formattingFn={(val) => `₹${Number(val).toLocaleString('en-IN')}`}
              />
            </span>
          </div>
        </div>

        <span className="text-[11px] text-gray-400 flex items-center gap-1">
          <Layers size={12} /> Live Recharts Monotone Curve
        </span>
      </div>
    </div>
  )
}

export default RevenueAnalyticsChart

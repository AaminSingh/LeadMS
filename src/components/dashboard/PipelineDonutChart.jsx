import { useMemo, useState } from 'react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from 'recharts'
import { PieChart as PieIcon, BarChart3 as BarIcon } from 'lucide-react'
import CountUp from '../common/CountUp'

// Standardized colors aligned with Badge.jsx
const STATUS_CHART_CONFIG = {
  new: {
    label: 'New Inquiry',
    color: '#06b6d4', // cyan-500
    badge: 'bg-cyan-50 text-cyan-800 border-cyan-200 dark:bg-cyan-950/50 dark:text-cyan-300 dark:border-cyan-800',
    barClass: 'bg-cyan-500',
  },
  contacted: {
    label: 'Contacted',
    color: '#f59e0b', // amber-500
    badge: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800',
    barClass: 'bg-amber-500',
  },
  quoted: {
    label: 'Quoted',
    color: '#a855f7', // purple-500
    badge: 'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800',
    barClass: 'bg-purple-500',
  },
  accepted: {
    label: 'Accepted',
    color: '#10b981', // emerald-500
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',
    barClass: 'bg-emerald-500',
  },
  rejected: {
    label: 'Rejected',
    color: '#f43f5e', // rose-500
    badge: 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800',
    barClass: 'bg-rose-500',
  },
}

function CustomPieTooltip({ active, payload, isDark }) {
  if (!active || !payload || !payload.length) return null
  const data = payload[0]

  return (
    <div
      className={`rounded-xl border p-2.5 text-xs shadow-lg backdrop-blur-md font-sans ${
        isDark
          ? 'border-slate-700 bg-slate-900/95 text-white'
          : 'border-gray-200 bg-white/95 text-gray-900 shadow-gray-200/80'
      }`}
    >
      <div className="flex items-center gap-2">
        <span
          className="h-2.5 w-2.5 rounded-full shrink-0"
          style={{ backgroundColor: data.payload.color || data.color }}
        />
        <span className="font-bold">{data.name}</span>
      </div>
      <div className="mt-1 text-gray-500 dark:text-gray-400 flex items-center justify-between gap-4">
        <span>Leads:</span>
        <span className="font-bold text-gray-900 dark:text-white font-mono">
          {data.value} {data.payload.pct !== undefined ? `(${data.payload.pct}%)` : ''}
        </span>
      </div>
    </div>
  )
}

function CustomBarTooltip({ active, payload, isDark }) {
  if (!active || !payload || !payload.length) return null
  const item = payload[0]

  return (
    <div
      className={`rounded-xl border p-2.5 text-xs shadow-lg backdrop-blur-md font-sans ${
        isDark
          ? 'border-slate-700 bg-slate-900/95 text-white'
          : 'border-gray-200 bg-white/95 text-gray-900 shadow-gray-200/80'
      }`}
    >
      <div className="flex items-center gap-2">
        <span
          className="h-2.5 w-2.5 rounded-full shrink-0"
          style={{ backgroundColor: item.color }}
        />
        <span className="font-bold">{item.name}</span>
      </div>
      <div className="mt-1 text-gray-500 dark:text-gray-400 flex items-center justify-between gap-4">
        <span>Count:</span>
        <span className="font-bold text-gray-900 dark:text-white font-mono">
          {item.value} inquiries
        </span>
      </div>
    </div>
  )
}

function PipelineDonutChart({ leads = [], isDark = false }) {
  const [chartMode, setChartMode] = useState('donut') // 'donut' | 'bar'
  const totalLeads = leads.length

  const chartData = useMemo(() => {
    const keys = ['new', 'contacted', 'quoted', 'accepted']
    const hasRejected = leads.some((l) => l.status === 'rejected')
    if (hasRejected) keys.push('rejected')

    return keys.map((statusKey) => {
      const config = STATUS_CHART_CONFIG[statusKey]
      const count = leads.filter(
        (l) => String(l.status || '').toLowerCase() === statusKey
      ).length
      const pct = totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0

      return {
        key: statusKey,
        name: config.label,
        value: count,
        color: config.color,
        pct,
        badge: config.badge,
        barClass: config.barClass,
      }
    })
  }, [leads, totalLeads])

  const activeDonutData = useMemo(() => {
    const filtered = chartData.filter((item) => item.value > 0)
    if (filtered.length === 0) {
      return [{ name: 'No Data', value: 1, color: isDark ? '#334155' : '#e2e8f0', pct: 0 }]
    }
    return filtered
  }, [chartData, isDark])

  // Single row data object for BarChart so each stage bar can animate with staggered animationBegin
  const barRowData = useMemo(() => {
    const row = { id: 'pipeline' }
    chartData.forEach((item) => {
      row[item.key] = item.value
    })
    return row
  }, [chartData])

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900/50">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Sales Pipeline Breakdown
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Lifecycle distribution of inquiries from capture to settlement.
          </p>
        </div>

        {/* View Mode Toggle: Donut vs Staggered Bars */}
        <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-gray-50 p-1 dark:border-gray-800 dark:bg-gray-800/60">
          <button
            onClick={() => setChartMode('donut')}
            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer ${
              chartMode === 'donut'
                ? 'bg-white text-gray-900 font-bold shadow-2xs dark:bg-gray-700 dark:text-white'
                : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }`}
            title="Donut Wheel View"
          >
            <PieIcon size={13} />
            <span>Donut</span>
          </button>
          <button
            onClick={() => setChartMode('bar')}
            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer ${
              chartMode === 'bar'
                ? 'bg-white text-gray-900 font-bold shadow-2xs dark:bg-gray-700 dark:text-white'
                : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }`}
            title="Staggered Bar Flow View"
          >
            <BarIcon size={13} />
            <span>Staggered Bars</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Chart Visual (5 cols) */}
        <div className="md:col-span-5 relative flex items-center justify-center h-[200px]">
          {chartMode === 'donut' ? (
            <>
              {/* Donut Chart with ease-out sweep-in */}
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={activeDonutData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={activeDonutData.length > 1 ? 4 : 0}
                    isAnimationActive={true}
                    animationDuration={800}
                    animationEasing="ease-out"
                    stroke="none"
                  >
                    {activeDonutData.map((entry, index) => (
                      <Cell key={`donut-cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip isDark={isDark} />} />
                </PieChart>
              </ResponsiveContainer>

              {/* Central Metric overlay with CountUp */}
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                  <CountUp end={totalLeads} duration={0.8} />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Total Inquiries
                </span>
              </div>
            </>
          ) : (
            /* Staggered BarChart: Each bar grows in sequence (+130ms stagger per bar) */
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={[barRowData]}
                margin={{ top: 20, right: 15, left: -25, bottom: 0 }}
              >
                <XAxis type="category" hide />
                <YAxis
                  stroke={isDark ? '#64748b' : '#94a3b8'}
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomBarTooltip isDark={isDark} />} />

                {/* Staggered entrance bars matching Jitter.video motion */}
                <Bar
                  dataKey="new"
                  name="New Inquiry"
                  fill={STATUS_CHART_CONFIG.new.color}
                  animationBegin={0}
                  animationDuration={700}
                  animationEasing="ease-out"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="contacted"
                  name="Contacted"
                  fill={STATUS_CHART_CONFIG.contacted.color}
                  animationBegin={130}
                  animationDuration={700}
                  animationEasing="ease-out"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="quoted"
                  name="Quoted"
                  fill={STATUS_CHART_CONFIG.quoted.color}
                  animationBegin={260}
                  animationDuration={700}
                  animationEasing="ease-out"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="accepted"
                  name="Accepted"
                  fill={STATUS_CHART_CONFIG.accepted.color}
                  animationBegin={390}
                  animationDuration={700}
                  animationEasing="ease-out"
                  radius={[6, 6, 0, 0]}
                />
                {barRowData.rejected > 0 && (
                  <Bar
                    dataKey="rejected"
                    name="Rejected"
                    fill={STATUS_CHART_CONFIG.rejected.color}
                    animationBegin={520}
                    animationDuration={700}
                    animationEasing="ease-out"
                    radius={[6, 6, 0, 0]}
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Status Breakdown Legend & Cards with Animated CountUp (7 cols) */}
        <div className="md:col-span-7 grid grid-cols-2 gap-2.5">
          {chartData.map((item) => (
            <div
              key={item.key}
              className={`rounded-xl border p-3 transition-shadow hover:shadow-xs ${item.badge}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs font-bold">{item.name}</span>
                </div>
                <span className="text-xs font-mono font-bold">{item.pct}%</span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <div className="text-xl font-black tracking-tight font-mono">
                  <CountUp end={item.value} duration={0.8} />
                </div>
                <span className="text-[10px] opacity-75 font-semibold">
                  {item.value === 1 ? 'lead' : 'leads'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PipelineDonutChart

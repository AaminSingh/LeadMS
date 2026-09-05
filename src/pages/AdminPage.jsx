import { useEffect, useState, useCallback, useMemo } from 'react'
import {
  Users,
  DollarSign,
  TrendingUp,
  Package,
  FileText,
  ShieldCheck,
  RefreshCw,
  BarChart3,
  PieChart as PieIcon,
} from 'lucide-react'
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
import adminService from '../services/adminService'
import useThemeStore from '../store/useThemeStore'
import StatSparkline from '../components/dashboard/StatSparkline'
import CountUp from '../components/common/CountUp'

const STATUS_COLORS = {
  new: '#06b6d4',
  contacted: '#f59e0b',
  quoted: '#a855f7',
  accepted: '#10b981',
  rejected: '#f43f5e',
}

const ROLE_COLORS = {
  vendor: '#0891b2',
  trader: '#f59e0b',
  'team-member': '#8b5cf6',
  admin: '#10b981',
}

function AdminPage() {
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await adminService.getAnalytics()
      setMetrics(res.data)
    } catch (err) {
      console.error('Failed to fetch admin metrics:', err)
      setError(err.response?.data?.message || 'Failed to load analytics data.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMetrics()
  }, [fetchMetrics])

  // Calculate total users from role breakdown
  const userCounts = useMemo(() => metrics?.users || {}, [metrics])
  const totalUserCount = useMemo(
    () => Object.values(userCounts).reduce((acc, count) => acc + count, 0),
    [userCounts]
  )

  const totalLeads = metrics?.leads?.total ?? 0
  const leadsByStatus = useMemo(() => metrics?.leads?.byStatus || {}, [metrics])

  const totalProducts = metrics?.products?.total ?? 0
  const activeProducts = metrics?.products?.active ?? 0

  const totalRevenue = metrics?.revenue?.totalQuoted ?? 0
  const expectedMargin = metrics?.revenue?.totalExpectedMargin ?? 0

  const theme = useThemeStore((state) => state.theme)
  const isDark = theme === 'midnight'

  // Donut data for Lead Status Breakdown
  const statusDonutData = useMemo(() => {
    return Object.entries(leadsByStatus)
      .map(([status, count]) => ({
        name: status.toUpperCase(),
        value: count,
        color: STATUS_COLORS[status.toLowerCase()] || '#6b7280',
      }))
      .filter((d) => d.value > 0)
  }, [leadsByStatus])

  // Bar data for Users by Role
  const userRoleData = useMemo(() => {
    return Object.entries(userCounts).map(([role, count]) => ({
      role: role.charAt(0).toUpperCase() + role.slice(1),
      count,
      fill: ROLE_COLORS[role] || '#6b7280',
    }))
  }, [userCounts])

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Analytics</h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
              <ShieldCheck size={14} /> Admin Access
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            System-wide overview of users, leads, products, and quotation revenues.
          </p>
        </div>

        <button
          onClick={fetchMetrics}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 cursor-pointer dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh Data
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-300 border border-red-200 dark:border-red-900">
          {error}
        </div>
      )}

      {loading && !metrics ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-400">
          <BarChart3 className="mx-auto h-8 w-8 animate-pulse text-gray-400 mb-2" />
          Loading analytics metrics...
        </div>
      ) : (
        <>
          {/* Top Metric Cards with Sparklines */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Users */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col justify-between dark:border-gray-800 dark:bg-gray-900/50">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</span>
                  <div className="rounded-lg bg-cyan-50 p-2.5 text-cyan-600 dark:bg-cyan-950/50 dark:text-cyan-300">
                    <Users size={20} />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white font-mono">
                    <CountUp start={0} end={totalUserCount} duration={0.9} />
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                  {Object.entries(userCounts).map(([role, count]) => (
                    <span
                      key={role}
                      className="rounded bg-gray-100 px-2 py-0.5 capitalize dark:bg-gray-800 dark:text-gray-300"
                    >
                      {role}: <strong className="text-gray-700 dark:text-gray-200">{count}</strong>
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-gray-50 dark:border-gray-800">
                <StatSparkline data={[{ val: 1 }, { val: totalUserCount }]} color="#0891b2" />
              </div>
            </div>

            {/* Total Leads */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col justify-between dark:border-gray-800 dark:bg-gray-900/50">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Pipeline Leads</span>
                  <div className="rounded-lg bg-amber-50 p-2.5 text-amber-600 dark:bg-amber-950/50 dark:text-amber-300">
                    <FileText size={20} />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white font-mono">
                    <CountUp start={0} end={totalLeads} duration={0.9} />
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                  {Object.entries(leadsByStatus).map(([status, count]) => (
                    <span
                      key={status}
                      className="rounded bg-gray-100 px-2 py-0.5 capitalize dark:bg-gray-800 dark:text-gray-300"
                    >
                      {status}: <strong className="text-gray-700 dark:text-gray-200">{count}</strong>
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-gray-50 dark:border-gray-800">
                <StatSparkline data={[{ val: 1 }, { val: totalLeads }]} color="#f59e0b" />
              </div>
            </div>

            {/* Quoted Revenue */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col justify-between dark:border-gray-800 dark:bg-gray-900/50">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Quoted Pipeline Value</span>
                  <div className="rounded-lg bg-emerald-50 p-2.5 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300">
                    <DollarSign size={20} />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white font-mono">
                    <CountUp
                      start={0}
                      end={totalRevenue}
                      duration={1.0}
                      decimals={totalRevenue % 1 !== 0 ? 2 : 0}
                      formattingFn={(val) => `₹${Number(val).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`}
                    />
                  </span>
                </div>
                <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                  From quoted and accepted client inquiries
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-gray-50 dark:border-gray-800">
                <StatSparkline data={[{ val: 0 }, { val: totalRevenue }]} color="#10b981" />
              </div>
            </div>

            {/* Expected Margin */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col justify-between dark:border-gray-800 dark:bg-gray-900/50">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Expected Margin</span>
                  <div className="rounded-lg bg-purple-50 p-2.5 text-purple-600 dark:bg-purple-950/50 dark:text-purple-300">
                    <TrendingUp size={20} />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white font-mono">
                    <CountUp
                      start={0}
                      end={expectedMargin}
                      duration={1.0}
                      decimals={expectedMargin % 1 !== 0 ? 2 : 0}
                      formattingFn={(val) => `₹${Number(val).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`}
                    />
                  </span>
                </div>
                <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                  Cumulative vendor margins across generated quotes
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-gray-50 dark:border-gray-800">
                <StatSparkline data={[{ val: 0 }, { val: expectedMargin }]} color="#8b5cf6" />
              </div>
            </div>
          </div>

          {/* Breakdown Sections with Visual Charts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Lead Status Breakdown Card with Donut Chart */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  Leads by Status
                </h3>
                <PieIcon size={16} className="text-gray-400" />
              </div>

              {Object.keys(leadsByStatus).length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">No leads recorded yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  {/* Recharts Pie Donut */}
                  <div className="sm:col-span-5 relative flex items-center justify-center h-[170px]">
                    <ResponsiveContainer width="100%" height={170}>
                      <PieChart>
                        <Pie
                          data={statusDonutData.length > 0 ? statusDonutData : [{ name: 'None', value: 1, color: '#94a3b8' }]}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={70}
                          paddingAngle={statusDonutData.length > 1 ? 3 : 0}
                          isAnimationActive={true}
                          animationDuration={800}
                          animationEasing="ease-out"
                          stroke="none"
                        >
                          {statusDonutData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-lg font-black text-gray-900 dark:text-white">
                        <CountUp end={totalLeads} duration={0.9} />
                      </span>
                      <span className="text-[9px] uppercase font-bold text-gray-400">Leads</span>
                    </div>
                  </div>

                  {/* Status List */}
                  <div className="sm:col-span-7 space-y-2.5">
                    {Object.entries(leadsByStatus).map(([status, count]) => {
                      const pct = totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0
                      const color = STATUS_COLORS[status.toLowerCase()] || '#6b7280'
                      return (
                        <div key={status}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="capitalize font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                              {status}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400 font-mono">
                              {count} ({pct}%)
                            </span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${pct}%`, backgroundColor: color }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Product & User Roles Overview with BarChart */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900/50 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                    Products & User Distribution
                  </h3>
                  <Package className="text-gray-400" size={20} />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="rounded-lg bg-gray-50 p-3 border border-gray-100 dark:bg-gray-800/40 dark:border-gray-800">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Products</span>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      <CountUp end={totalProducts} duration={0.9} />
                    </div>
                    <span className="text-[10px] text-gray-400">Created by Traders</span>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 border border-gray-100 dark:bg-gray-800/40 dark:border-gray-800">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Active Products</span>
                    <div className="text-2xl font-bold text-emerald-600 mt-1">
                      <CountUp end={activeProducts} duration={0.9} />
                    </div>
                    <span className="text-[10px] text-gray-400">Available for Vendors</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 dark:border-gray-800 pt-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Users by Role
                </h4>
                <div className="h-[120px] w-full">
                  <ResponsiveContainer width="100%" height={120}>
                    <BarChart data={userRoleData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                      <XAxis dataKey="role" stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]} isAnimationActive={true} animationDuration={800} animationEasing="ease-out">
                        {userRoleData.map((entry, index) => (
                          <Cell key={`bar-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default AdminPage

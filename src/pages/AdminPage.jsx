import { useEffect, useState, useCallback } from 'react'
import {
  Users,
  DollarSign,
  TrendingUp,
  Package,
  FileText,
  ShieldCheck,
  RefreshCw,
  BarChart3,
} from 'lucide-react'
import adminService from '../services/adminService'

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
  const userCounts = metrics?.users || {}
  const totalUserCount = Object.values(userCounts).reduce((acc, count) => acc + count, 0)

  const totalLeads = metrics?.leads?.total ?? 0
  const leadsByStatus = metrics?.leads?.byStatus || {}

  const totalProducts = metrics?.products?.total ?? 0
  const activeProducts = metrics?.products?.active ?? 0

  const totalRevenue = metrics?.revenue?.totalQuoted ?? 0
  const expectedMargin = metrics?.revenue?.totalExpectedMargin ?? 0

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">Admin Analytics</h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-700">
              <ShieldCheck size={14} /> Admin Access
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            System-wide overview of users, leads, products, and quotation revenues.
          </p>
        </div>

        <button
          onClick={fetchMetrics}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh Data
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading && !metrics ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
          <BarChart3 className="mx-auto h-8 w-8 animate-pulse text-gray-400 mb-2" />
          Loading analytics metrics...
        </div>
      ) : (
        <>
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Users */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Total Users</span>
                <div className="rounded-lg bg-cyan-50 p-2.5 text-cyan-600">
                  <Users size={20} />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold text-gray-900">{totalUserCount}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5 text-xs text-gray-500">
                {Object.entries(userCounts).map(([role, count]) => (
                  <span
                    key={role}
                    className="rounded bg-gray-100 px-2 py-0.5 capitalize"
                  >
                    {role}: <strong className="text-gray-700">{count}</strong>
                  </span>
                ))}
              </div>
            </div>

            {/* Total Leads */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Total Pipeline Leads</span>
                <div className="rounded-lg bg-amber-50 p-2.5 text-amber-600">
                  <FileText size={20} />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold text-gray-900">{totalLeads}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5 text-xs text-gray-500">
                {Object.entries(leadsByStatus).map(([status, count]) => (
                  <span
                    key={status}
                    className="rounded bg-gray-100 px-2 py-0.5 capitalize"
                  >
                    {status}: <strong className="text-gray-700">{count}</strong>
                  </span>
                ))}
              </div>
            </div>

            {/* Quoted Revenue */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Quoted Pipeline Value</span>
                <div className="rounded-lg bg-emerald-50 p-2.5 text-emerald-600">
                  <DollarSign size={20} />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold text-gray-900">
                  ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <p className="mt-3 text-xs text-gray-500">
                From quoted and accepted client inquiries
              </p>
            </div>

            {/* Expected Margin */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Expected Margin</span>
                <div className="rounded-lg bg-purple-50 p-2.5 text-purple-600">
                  <TrendingUp size={20} />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold text-gray-900">
                  ${expectedMargin.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <p className="mt-3 text-xs text-gray-500">
                Cumulative vendor margins across generated quotes
              </p>
            </div>
          </div>

          {/* Breakdown Sections */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Lead Status Breakdown Card */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                Leads by Status
              </h3>
              {Object.keys(leadsByStatus).length === 0 ? (
                <p className="text-sm text-gray-500">No leads recorded yet.</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(leadsByStatus).map(([status, count]) => {
                    const pct = totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0
                    return (
                      <div key={status}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize font-medium text-gray-700">{status}</span>
                          <span className="text-gray-500">{count} ({pct}%)</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              status === 'quoted' || status === 'accepted'
                                ? 'bg-emerald-500'
                                : status === 'contacted'
                                ? 'bg-amber-500'
                                : status === 'rejected'
                                ? 'bg-red-500'
                                : 'bg-blue-500'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Product & Catalog Overview */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-900">
                  Products & Catalog Stats
                </h3>
                <Package className="text-gray-400" size={20} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-gray-50 p-4 border border-gray-100">
                  <span className="text-xs font-medium text-gray-500">Total Products</span>
                  <div className="text-2xl font-bold text-gray-900 mt-1">{totalProducts}</div>
                  <span className="text-xs text-gray-400">Created by Traders</span>
                </div>
                <div className="rounded-lg bg-gray-50 p-4 border border-gray-100">
                  <span className="text-xs font-medium text-gray-500">Active Products</span>
                  <div className="text-2xl font-bold text-emerald-600 mt-1">{activeProducts}</div>
                  <span className="text-xs text-gray-400">Available for Vendors</span>
                </div>
              </div>

              <div className="mt-6 border-t border-gray-100 pt-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  System User Breakdown
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2 rounded bg-blue-50 text-blue-800">
                    <span className="block font-bold text-base">{userCounts.vendor || 0}</span>
                    <span>Vendors</span>
                  </div>
                  <div className="p-2 rounded bg-amber-50 text-amber-800">
                    <span className="block font-bold text-base">{userCounts.trader || 0}</span>
                    <span>Traders</span>
                  </div>
                  <div className="p-2 rounded bg-purple-50 text-purple-800">
                    <span className="block font-bold text-base">{userCounts['team-member'] || 0}</span>
                    <span>Team Members</span>
                  </div>
                  <div className="p-2 rounded bg-gray-100 text-gray-800">
                    <span className="block font-bold text-base">{userCounts.admin || 0}</span>
                    <span>Admins</span>
                  </div>
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

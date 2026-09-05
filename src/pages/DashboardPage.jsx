import { useEffect, useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FileText,
  Clock,
  TrendingUp,
  Plus,
  RefreshCw,
  Search,
  Eye,
  Sliders,
  Boxes,
  ArrowUpRight,
  Calendar,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  X,
} from 'lucide-react'
import toast from 'react-hot-toast'
import useAuthStore from '../store/useAuthStore'
import useThemeStore, { THEMES } from '../store/useThemeStore'
import leadService from '../services/leadService'
import StatSparkline from '../components/dashboard/StatSparkline'
import RevenueAnalyticsChart from '../components/dashboard/RevenueAnalyticsChart'
import PipelineDonutChart from '../components/dashboard/PipelineDonutChart'
import CountUp from '../components/common/CountUp'

function DashboardPage() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const currentTheme = useThemeStore((state) => state.theme)

  const activeTheme = useMemo(() => {
    return THEMES.find((t) => t.id === currentTheme) || THEMES[0]
  }, [currentTheme])

  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedInvoice, setSelectedInvoice] = useState(null)

  const fetchDashboardData = useCallback(async (showSkeleton = false) => {
    try {
      if (showSkeleton) {
        setLoading(true)
      } else {
        setIsSyncing(true)
      }
      const res = await leadService.getLeads()
      const data = res.data?.leads || res.data || []
      setLeads(data)
    } catch (err) {
      console.error('Dashboard data load error:', err)
      if (showSkeleton) {
        toast.error('Failed to refresh dashboard metrics.')
      }
    } finally {
      setLoading(false)
      setIsSyncing(false)
    }
  }, [])

  // Initial load + 30s live background polling
  useEffect(() => {
    fetchDashboardData(true)

    const pollTimer = setInterval(() => {
      fetchDashboardData(false)
    }, 30000)

    return () => clearInterval(pollTimer)
  }, [fetchDashboardData])

  // Derive real chronological trend data and sparklines from actual leads
  const { trendData, sparklines } = useMemo(() => {
    if (!leads || leads.length === 0) {
      return {
        trendData: [],
        sparklines: {
          total: [{ val: 0 }, { val: 0 }],
          outstanding: [{ val: 0 }, { val: 0 }],
          paid: [{ val: 0 }, { val: 0 }],
          conversion: [{ val: 0 }, { val: 0 }],
        },
      }
    }

    // Sort leads chronologically
    const sortedLeads = [...leads].sort(
      (a, b) => new Date(a.createdAt || a.updatedAt || 0) - new Date(b.createdAt || b.updatedAt || 0)
    )

    // Build timeline points for RevenueAnalyticsChart
    const dateMap = new Map()
    let cumulativeInvoiced = 0
    let cumulativePaid = 0
    let cumulativePending = 0

    sortedLeads.forEach((l) => {
      const d = new Date(l.createdAt || l.updatedAt || Date.now())
      const dateKey = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
      const amount = Number(l.quote?.finalTotal || 0)
      const isPaid = l.status === 'accepted'
      const isQuoted = l.status === 'quoted' || (amount > 0 && !isPaid)

      cumulativeInvoiced += amount
      if (isPaid) {
        cumulativePaid += amount
      } else if (isQuoted) {
        cumulativePending += amount
      }

      dateMap.set(dateKey, {
        date: dateKey,
        invoiced: cumulativeInvoiced,
        paid: cumulativePaid,
        pending: cumulativePending,
      })
    })

    const trendData = Array.from(dateMap.values())

    // Build sparkline trends
    let runInv = 0
    let runPaid = 0
    let runPend = 0
    let wonCount = 0

    const totalSpark = []
    const outSpark = []
    const paidSpark = []
    const convSpark = []

    sortedLeads.forEach((l, idx) => {
      const amt = Number(l.quote?.finalTotal || 0)
      runInv += amt
      if (l.status === 'accepted') {
        runPaid += amt
        wonCount++
      } else if (l.status === 'quoted') {
        runPend += amt
      }

      totalSpark.push({ val: runInv })
      outSpark.push({ val: runPend })
      paidSpark.push({ val: runPaid })
      convSpark.push({ val: Math.round((wonCount / (idx + 1)) * 100) })
    })

    return {
      trendData,
      sparklines: {
        total: totalSpark.length > 0 ? totalSpark : [{ val: 0 }, { val: 0 }],
        outstanding: outSpark.length > 0 ? outSpark : [{ val: 0 }, { val: 0 }],
        paid: paidSpark.length > 0 ? paidSpark : [{ val: 0 }, { val: 0 }],
        conversion: convSpark.length > 0 ? convSpark : [{ val: 0 }, { val: 0 }],
      },
    }
  }, [leads])

  // Derive transactions and invoices strictly from real leads in the database
  const invoices = useMemo(() => {
    return leads
      .filter((l) => (l.quote && (l.quote.finalTotal || 0) > 0) || l.status === 'quoted' || l.status === 'accepted')
      .map((l, index) => {
        const id = l._id || l.id
        const codeNumber = id ? id.toString().slice(-4).toUpperCase() : (1001 + index).toString()
        const finalTotal = Number(l.quote?.finalTotal || 0)
        const isPaid = l.status === 'accepted'
        const isQuoted = l.status === 'quoted'

        return {
          id: `INV-${codeNumber}`,
          leadId: id,
          clientName: l.clientName || l.customerName || 'Inquiry Client',
          clientEmail: l.email || l.customerEmail || 'client@example.com',
          date: new Date(l.updatedAt || l.createdAt || '2026-09-01').toLocaleDateString('en-IN', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          amount: finalTotal,
          status: isPaid ? 'paid' : isQuoted ? 'pending' : 'overdue',
          paymentMethod: isPaid ? 'Bank Transfer (NEFT/RTGS)' : 'Commercial Invoice',
          requirement: l.requirement || 'Commercial Equipment & Installation',
          quoteDetails: l.quote || {
            baseTotal: finalTotal,
            marginApplied: 0,
            installationPrice: 0,
            miscCharges: 0,
            finalTotal,
          },
        }
      })
  }, [leads])

  // Financial KPI calculations directly from live data
  const stats = useMemo(() => {
    const totalInvoicesCount = invoices.length
    const totalInvoicedAmount = invoices.reduce((sum, item) => sum + (item.amount || 0), 0)

    const outstandingItems = invoices.filter((i) => i.status === 'pending' || i.status === 'overdue')
    const outstandingAmount = outstandingItems.reduce((sum, item) => sum + (item.amount || 0), 0)

    const paidItems = invoices.filter((i) => i.status === 'paid')
    const paidAmount = paidItems.reduce((sum, item) => sum + (item.amount || 0), 0)

    const totalLeadsCount = leads.length
    const quotedOrAcceptedCount = leads.filter(
      (l) => l.status === 'quoted' || l.status === 'accepted'
    ).length
    const conversionRate = totalLeadsCount > 0
      ? Math.round((quotedOrAcceptedCount / totalLeadsCount) * 100)
      : 0

    return {
      totalInvoicesCount,
      totalInvoicedAmount,
      outstandingCount: outstandingItems.length,
      outstandingAmount,
      paidCount: paidItems.length,
      paidAmount,
      conversionRate,
    }
  }, [invoices, leads])

  // Filtered invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((item) => {
      const matchesTab = activeTab === 'all' || item.status === activeTab
      const matchesQuery =
        !searchQuery ||
        item.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesTab && matchesQuery
    })
  }, [invoices, activeTab, searchQuery])

  // Greeting helper
  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }, [])

  return (
    <div className="space-y-8 pb-12">
      {/* ─── Top Banner: Greeting & Quick Actions ─── */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xs relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -right-4 -bottom-16 h-40 w-40 rounded-full bg-teal-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="badge-theme rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider">
                {user?.role || 'VENDOR'} WORKSPACE
              </span>
              <span className="text-xs text-gray-400">&bull;</span>
              <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                <Calendar size={13} />
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {greeting}, {user?.name || user?.email?.split('@')[0] || 'Team'}
            </h1>
            <p className="text-sm text-gray-500 max-w-xl">
              Track revenue from quotes, view real-time outstanding balances, and monitor your lead conversion pipeline.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-2.5 py-2 text-[11px] font-semibold text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
              <span className={`h-2 w-2 rounded-full ${isSyncing ? 'bg-amber-400 animate-ping' : 'bg-emerald-500 animate-pulse'}`} />
              <span>{isSyncing ? 'Syncing...' : 'Live (30s)'}</span>
            </div>

            <button
              onClick={() => fetchDashboardData(false)}
              disabled={loading || isSyncing}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              title="Refresh Dashboard Data"
            >
              <RefreshCw size={15} className={isSyncing ? 'animate-spin' : ''} />
              Sync
            </button>

            <button
              onClick={() => navigate('/app/leads')}
              className="btn-theme-gradient inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold shadow-xs cursor-pointer"
            >
              <Plus size={16} />
              New Lead
            </button>

            <button
              onClick={() => navigate('/app/settings')}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors cursor-pointer dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              title="Configure Color Theme & UI Density"
            >
              <Sliders size={15} />
              Theme & Sizing
            </button>
          </div>
        </div>
      </div>

      {/* ─── Financial KPI Metric Cards with Sparklines ─── */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total Invoiced Value */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs transition-shadow hover:shadow-md flex flex-col justify-between dark:border-gray-800 dark:bg-gray-900/50">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Total Invoices
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-theme-subtle border border-theme text-theme">
                <FileText size={18} />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-gray-900 dark:text-white tracking-tight font-mono">
                <CountUp
                  start={0}
                  end={stats.totalInvoicedAmount}
                  duration={1.0}
                  decimals={stats.totalInvoicedAmount % 1 !== 0 ? 1 : 0}
                  formattingFn={(val) => `₹${Number(val).toLocaleString('en-IN')}`}
                />
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs">
                <span className="inline-flex items-center font-bold text-emerald-600">
                  <ArrowUpRight size={13} /> {stats.totalInvoicesCount} quotes
                </span>
                <span className="text-gray-400">&bull; Pipeline</span>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-gray-50 dark:border-gray-800/60">
            <StatSparkline data={sparklines.total} color={activeTheme.primary} />
          </div>
        </div>

        {/* Card 2: Outstanding Balance */}
        <div className="rounded-2xl border border-amber-200/80 bg-amber-50/20 p-5 shadow-xs transition-shadow hover:shadow-md flex flex-col justify-between dark:border-amber-900/40 dark:bg-amber-950/10">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Outstanding Amount
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
                <Clock size={18} />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-gray-900 dark:text-white tracking-tight font-mono">
                <CountUp
                  start={0}
                  end={stats.outstandingAmount}
                  duration={1.0}
                  decimals={stats.outstandingAmount % 1 !== 0 ? 1 : 0}
                  formattingFn={(val) => `₹${Number(val).toLocaleString('en-IN')}`}
                />
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs">
                <span className="inline-flex items-center font-bold text-amber-600">
                  {stats.outstandingCount} pending
                </span>
                <span className="text-gray-400">&bull; Awaiting settlement</span>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-amber-100/60 dark:border-amber-900/30">
            <StatSparkline data={sparklines.outstanding} color="#f59e0b" />
          </div>
        </div>

        {/* Card 3: Paid Revenue */}
        <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/20 p-5 shadow-xs transition-shadow hover:shadow-md flex flex-col justify-between dark:border-emerald-900/40 dark:bg-emerald-950/10">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Paid & Realized
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                <CheckCircle2 size={18} />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-gray-900 dark:text-white tracking-tight font-mono">
                <CountUp
                  start={0}
                  end={stats.paidAmount}
                  duration={1.0}
                  decimals={stats.paidAmount % 1 !== 0 ? 1 : 0}
                  formattingFn={(val) => `₹${Number(val).toLocaleString('en-IN')}`}
                />
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs">
                <span className="inline-flex items-center font-bold text-emerald-600">
                  {stats.paidCount} settled
                </span>
                <span className="text-gray-400">&bull; Closed won</span>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-emerald-100/60 dark:border-emerald-900/30">
            <StatSparkline data={sparklines.paid} color="#10b981" />
          </div>
        </div>

        {/* Card 4: Conversion Rate */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs transition-shadow hover:shadow-md flex flex-col justify-between dark:border-gray-800 dark:bg-gray-900/50">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Win Rate
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/50 dark:border-purple-800 dark:text-purple-300">
                <TrendingUp size={18} />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-gray-900 dark:text-white tracking-tight font-mono">
                <CountUp
                  start={0}
                  end={stats.conversionRate}
                  duration={0.9}
                  suffix="%"
                />
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs">
                <span className="inline-flex items-center font-bold text-purple-600">
                  {leads.length > 0 ? `${stats.paidCount}/${leads.length} won` : '0 won'}
                </span>
                <span className="text-gray-400">&bull; Conversion</span>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-gray-50 dark:border-gray-800/60">
            <StatSparkline data={sparklines.conversion} color="#8b5cf6" />
          </div>
        </div>
      </div>

      {/* ─── Main Revenue & Pipeline Analytics Chart (Live Animated AreaChart) ─── */}
      <RevenueAnalyticsChart
        data={trendData}
        loading={loading}
        theme={currentTheme}
        totalInvoiced={stats.totalInvoicedAmount}
        totalPaid={stats.paidAmount}
        onNewLead={() => navigate('/app/leads')}
      />

      {/* ─── Recent Invoices & Transactions Table ─── */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-xs overflow-hidden">
        {/* Table Header Controls */}
        <div className="p-6 border-b border-gray-200 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Recent Transactions & Invoices
            </h2>
            <p className="text-xs text-gray-500">
              Detailed breakdown of issued quotes, payment settlements, and customer balances.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search invoice or client..."
                className="w-full rounded-xl border border-gray-300 bg-white pl-9 pr-4 py-2 text-xs text-gray-900 outline-none focus:border-theme focus:ring-2 focus:ring-cyan-500/20"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 p-1 text-xs font-semibold">
              {[
                { key: 'all', label: 'All' },
                { key: 'paid', label: 'Paid' },
                { key: 'pending', label: 'Pending' },
                { key: 'overdue', label: 'Overdue' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`rounded-lg px-3 py-1.5 transition-colors cursor-pointer ${
                    activeTab === tab.key
                      ? 'bg-white text-gray-900 font-bold shadow-2xs'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50/80 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-6 py-3.5">Invoice ID</th>
                <th className="px-6 py-3.5">Client</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Amount</th>
                <th className="px-6 py-3.5">Payment Method</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-xs text-gray-500">
                    No transactions match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="transition-colors hover:bg-gray-50/70">
                    <td className="px-6 py-4 font-mono font-bold text-xs text-gray-900">
                      {inv.id}
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{inv.clientName}</div>
                      <div className="text-xs text-gray-400">{inv.clientEmail}</div>
                    </td>

                    <td className="px-6 py-4 text-xs text-gray-600">{inv.date}</td>

                    <td className="px-6 py-4 font-bold text-gray-900">
                      ₹{inv.amount.toLocaleString('en-IN')}
                    </td>

                    <td className="px-6 py-4 text-xs text-gray-600">
                      <span className="inline-flex items-center gap-1.5">
                        <CreditCard size={13} className="text-gray-400" />
                        {inv.paymentMethod}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {inv.status === 'paid' ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                          <CheckCircle2 size={12} /> Paid
                        </span>
                      ) : inv.status === 'pending' ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 border border-amber-200">
                          <Clock size={12} /> Quoted / Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-bold text-red-700 border border-red-200">
                          <AlertTriangle size={12} /> Overdue
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors cursor-pointer"
                        title="View Detailed Invoice Breakdown"
                      >
                        <Eye size={13} /> Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Sales Pipeline Breakdown Donut Chart & Quick Shortcuts ─── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Pipeline Donut Chart (2 cols) */}
        <div className="lg:col-span-2">
          <PipelineDonutChart leads={leads} isDark={currentTheme === 'midnight'} />
        </div>

        {/* Quick workspace shortcuts (1 col) */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-1">Quick Shortcuts</h3>
            <p className="text-xs text-gray-500 mb-4">
              Direct access to essential platform modules.
            </p>

            <div className="space-y-2.5">
              <button
                onClick={() => navigate('/app/leads')}
                className="w-full flex items-center justify-between rounded-xl border border-gray-200 p-3 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <FileText size={15} className="text-theme" />
                  Lead Pipeline & Quotes
                </span>
                <ArrowUpRight size={14} className="text-gray-400" />
              </button>

              <button
                onClick={() => navigate('/app/products')}
                className="w-full flex items-center justify-between rounded-xl border border-gray-200 p-3 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Boxes size={15} className="text-theme" />
                  Products & Margin Config
                </span>
                <ArrowUpRight size={14} className="text-gray-400" />
              </button>

              <button
                onClick={() => navigate('/app/settings')}
                className="w-full flex items-center justify-between rounded-xl border border-gray-200 p-3 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Sliders size={15} className="text-theme" />
                  Themes & Interface Sizing
                </span>
                <ArrowUpRight size={14} className="text-gray-400" />
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
            <span>LeadMS Enterprise v2.4</span>
            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Systems Online
            </span>
          </div>
        </div>
      </div>

      {/* ─── Invoice Details Modal ─── */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Invoice {selectedInvoice.id}
                </h3>
                <p className="text-xs text-gray-500">Issued to {selectedInvoice.clientName}</p>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-3.5 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-500">Issued Date:</span>
                  <span className="font-semibold text-gray-900">{selectedInvoice.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Status:</span>
                  <span className="font-bold uppercase tracking-wider text-theme">
                    {selectedInvoice.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Channel / Terms:</span>
                  <span className="font-semibold text-gray-900">
                    {selectedInvoice.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Requirement:</span>
                  <span className="font-semibold text-gray-900 text-right max-w-xs">
                    {selectedInvoice.requirement}
                  </span>
                </div>
              </div>

              {/* Cost Calculation Breakdown */}
              <div className="rounded-xl border border-gray-100 p-3.5 space-y-2">
                <div className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-1">
                  Pricing Breakdown
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Base Wholesale Goods:</span>
                  <span>₹{selectedInvoice.quoteDetails?.baseTotal?.toLocaleString('en-IN') || 0}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Vendor Margin Applied:</span>
                  <span>+₹{selectedInvoice.quoteDetails?.marginApplied?.toLocaleString('en-IN') || 0}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Installation & Setup:</span>
                  <span>+₹{selectedInvoice.quoteDetails?.installationPrice?.toLocaleString('en-IN') || 0}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Misc Regulatory Charges:</span>
                  <span>+₹{selectedInvoice.quoteDetails?.miscCharges?.toLocaleString('en-IN') || 0}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between font-black text-sm text-gray-900">
                  <span>Grand Total:</span>
                  <span className="text-theme">
                    ₹{selectedInvoice.amount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="btn-theme-gradient rounded-xl px-4 py-2 text-xs font-bold shadow-xs cursor-pointer"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardPage

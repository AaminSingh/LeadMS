import { Link } from 'react-router-dom'
import {
  ShieldCheck,
  Lock,
  Calculator,
  Users,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Package,
  FileSpreadsheet,
  Layers,
} from 'lucide-react'
import useAuthStore from '../store/useAuthStore'

function LandingPage() {
  const { isAuthenticated } = useAuthStore()

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 flex flex-col justify-between">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-black text-lg shadow-sm">
              L
            </div>
            <span className="text-xl font-black tracking-tight text-gray-900">
              Lead<span className="text-blue-600">MS</span>
            </span>
          </div>

          <nav className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/app/dashboard"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700"
              >
                Go to App <ArrowRight size={16} />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700"
                >
                  Create Account
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3.5 py-1 text-xs font-semibold text-blue-700">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-ping" />
              Role-Based Multi-Tier CRM Platform
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
              B2B Role-Based CRM &{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Sales Pipeline
              </span>{' '}
              Management
            </h1>

            <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-xl">
              Connect wholesale suppliers, vendors, and sales teams in one unified platform.
              Lock trader goods into custom sales catalogs, compute dynamic quotation margins,
              and manage client inquiries from arrival to deal close.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              {isAuthenticated ? (
                <Link
                  to="/app/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-base font-bold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg"
                >
                  Open Dashboard <ArrowRight size={18} />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-base font-bold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg"
                  >
                    Get Started Free <ArrowRight size={18} />
                  </Link>
                  <Link
                    to="/login"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-7 py-3.5 text-base font-bold text-gray-800 shadow-sm transition-all hover:bg-gray-50"
                  >
                    Sign In to Account
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="border-y border-gray-200 bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600">
              Powerful Capabilities
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Engineered for seamless B2B transactions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-gray-200 bg-slate-50/50 p-8 shadow-sm transition-all hover:shadow-md hover:border-blue-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white mb-6">
                <Lock size={22} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Atomic Product Locking
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Vendors lock wholesale products from the public Trader pool into their personal
                catalog. Locked items are ready for client quoting without duplicate listings.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-gray-200 bg-slate-50/50 p-8 shadow-sm transition-all hover:shadow-md hover:border-purple-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600 text-white mb-6">
                <Calculator size={22} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Dynamic Quoting Engine
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Live pricing math applies vendor margin %, installation rates, and miscellaneous
                expenses to base costs, generating instant, precise customer estimates.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-gray-200 bg-slate-50/50 p-8 shadow-sm transition-all hover:shadow-md hover:border-emerald-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white mb-6">
                <FileSpreadsheet size={22} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Visual Lead Pipeline
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Track status across inquiry stages (New, Contacted, Quoted, Accepted, Rejected)
                with clean status badges and single-click quote builder integration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role Architecture Section */}
      <section className="py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-purple-600">
              Multi-Tenant Hierarchy
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Built for Every Stakeholder
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Trader Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-700 mb-4">
                <Package size={20} />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-1">Trader</h4>
              <p className="text-xs text-gray-500 font-medium mb-4">Wholesale Supplier</p>
              <ul className="space-y-2 text-xs text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                  Publish wholesale products
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                  Set base wholesale pricing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                  Edit & manage inventory
                </li>
              </ul>
            </div>

            {/* Vendor Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm ring-1 ring-blue-500/20">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700 mb-4">
                <Layers size={20} />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-1">Vendor</h4>
              <p className="text-xs text-gray-500 font-medium mb-4">Distributor / Installer</p>
              <ul className="space-y-2 text-xs text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                  Configure quoting margins
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                  Lock trader goods to catalog
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                  Generate client proposals
                </li>
              </ul>
            </div>

            {/* Team Member Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-700 mb-4">
                <Users size={20} />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-1">Team Member</h4>
              <p className="text-xs text-gray-500 font-medium mb-4">Sales Representative</p>
              <ul className="space-y-2 text-xs text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                  Access locked catalog
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                  Manage assigned leads
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                  Collaborate on customer deals
                </li>
              </ul>
            </div>

            {/* Admin Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-700 mb-4">
                <ShieldCheck size={20} />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-1">System Admin</h4>
              <p className="text-xs text-gray-500 font-medium mb-4">Platform Governance</p>
              <ul className="space-y-2 text-xs text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                  Full pipeline metrics
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                  Revenue & margin analytics
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                  User governance & audit
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16 text-white text-center">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Ready to streamline your B2B sales pipeline?
          </h2>
          <p className="mt-4 text-blue-100 text-base sm:text-lg">
            Create an account in seconds and unlock automated product pricing, catalog locking, and lead quotes.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/register"
              className="rounded-xl bg-white px-8 py-3 text-sm font-bold text-blue-600 shadow-md transition-all hover:bg-blue-50"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4 px-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900">LeadMS</span>
            <span>&copy; {new Date().getFullYear()} LeadMS CRM. All rights reserved.</span>
          </div>
          <div className="flex gap-6 text-xs text-gray-400">
            <span>React 19 + Tailwind v4</span>
            <span>Express v5 + MongoDB</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage

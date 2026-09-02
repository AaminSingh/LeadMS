import { useState } from 'react'
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
  Sparkles,
  ChevronRight,
  Star,
  Check,
  Building2,
  PhoneCall,
  Play,
  Zap,
  Globe,
  Award,
} from 'lucide-react'
import useAuthStore from '../store/useAuthStore'
import heroDashboardImg from '../assets/crm_dashboard_hero.jpg'
import b2bCollabImg from '../assets/crm_b2b_collaboration.jpg'

function LandingPage() {
  const { isAuthenticated } = useAuthStore()
  const [activeRoleTab, setActiveRoleTab] = useState('vendor')

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* ────────────────── TOP ANNOUNCEMENT BAR ────────────────── */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 px-4 py-2 text-center text-xs font-medium text-white sm:text-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2">
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-blue-100">
            v2.4 Release
          </span>
          <span>New: Automated Quoting Math Engine with One-Click Product Locking.</span>
          <Link
            to={isAuthenticated ? '/app/products' : '/register'}
            className="inline-flex items-center gap-1 font-semibold underline underline-offset-2 hover:text-blue-100 transition-colors"
          >
            Explore now <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* ────────────────── STICKY ENTERPRISE NAVBAR ────────────────── */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md transition-all">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 lg:px-8">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white font-black text-xl shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              L
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Lead<span className="text-blue-600">MS</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 -mt-0.5">
                Enterprise CRM
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">
              Platform Features
            </a>
            <a href="#collaboration" className="hover:text-blue-600 transition-colors">
              B2B Network
            </a>
            <a href="#roles" className="hover:text-blue-600 transition-colors">
              Role Architecture
            </a>
            <a href="#metrics" className="hover:text-blue-600 transition-colors">
              Performance
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/app/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md cursor-pointer"
              >
                Go to Workspace <ArrowRight size={16} />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg cursor-pointer"
                >
                  Start Free Trial <ChevronRight size={16} />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        {/* ────────────────── 2-COLUMN HERO SECTION (BITRIX / SALESFORCE INSPIRED) ────────────────── */}
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-blue-50/40 to-white pt-16 pb-24 lg:pt-20 lg:pb-32">
          {/* Ambient Glow Orbs */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-blue-400/20 via-indigo-300/20 to-purple-400/20 blur-3xl pointer-events-none rounded-full" />

          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left Column: Value Prop & CTAs */}
              <div className="lg:col-span-6 space-y-6 text-left">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-1.5 text-xs font-bold text-blue-700 shadow-xs backdrop-blur-sm">
                  <Sparkles size={14} className="text-blue-600" />
                  <span>Next-Generation B2B Sales Ecosystem</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
                  Connect Traders, Lock Catalogs, &{' '}
                  <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Close B2B Deals Faster
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                  LeadMS unifies wholesale suppliers and distribution networks into one real-time cloud workspace.
                  Lock trader inventory into private sales catalogs, automate dynamic margin calculations, and
                  accelerate client quotes with role-based permissions.
                </p>

                {/* Primary Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                  <Link
                    to={isAuthenticated ? '/app/dashboard' : '/register'}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700 hover:shadow-xl hover:-translate-y-0.5"
                  >
                    Start Free Trial <ArrowRight size={18} />
                  </Link>
                  <Link
                    to={isAuthenticated ? '/app/leads' : '/login'}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 shadow-xs transition-all hover:bg-slate-50 hover:text-slate-900 hover:border-slate-400"
                  >
                    <Play size={16} className="text-blue-600 fill-blue-600" />
                    Explore Live Pipeline
                  </Link>
                </div>

                {/* Social Proof Badges */}
                <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center gap-6 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <div className="flex -space-x-2">
                      <div className="h-8 w-8 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center font-bold text-[10px] text-white">
                        SK
                      </div>
                      <div className="h-8 w-8 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center font-bold text-[10px] text-white">
                        MR
                      </div>
                      <div className="h-8 w-8 rounded-full bg-purple-500 border-2 border-white flex items-center justify-center font-bold text-[10px] text-white">
                        DL
                      </div>
                    </div>
                    <div className="pl-1">
                      <div className="flex items-center text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={13} className="fill-amber-400" />
                        ))}
                      </div>
                      <span className="font-semibold text-slate-700">4.9/5 from 300+ B2B vendors</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 font-medium">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    <span>No credit card required</span>
                  </div>
                </div>
              </div>

              {/* Right Column: High-End 3D CRM Dashboard Preview */}
              <div className="lg:col-span-6 relative">
                <div className="relative mx-auto max-w-lg lg:max-w-none">
                  {/* Decorative Gradient Backdrop */}
                  <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-blue-600/30 to-indigo-600/30 blur-2xl opacity-60" />

                  {/* Main Product Screenshot Window */}
                  <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl transition-all duration-300 hover:shadow-blue-500/10">
                    <div className="flex h-9 items-center gap-2 border-b border-slate-200 bg-slate-100/90 px-4">
                      <div className="flex gap-1.5">
                        <div className="h-3 w-3 rounded-full bg-red-400" />
                        <div className="h-3 w-3 rounded-full bg-amber-400" />
                        <div className="h-3 w-3 rounded-full bg-emerald-400" />
                      </div>
                      <span className="mx-auto text-[11px] font-medium text-slate-400">
                        app.leadms.com/dashboard
                      </span>
                    </div>
                    <img
                      src={heroDashboardImg}
                      alt="LeadMS Modern B2B CRM Dashboard Interface"
                      className="w-full object-cover shadow-inner hover:scale-[1.01] transition-transform duration-500"
                    />
                  </div>

                  {/* Floating Micro-Card 1: Quoting Breakdown */}
                  <div className="absolute -bottom-6 -left-6 hidden sm:flex items-center gap-3 rounded-2xl border border-slate-200/90 bg-white/95 p-4 shadow-xl backdrop-blur-md">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <TrendingUp size={22} />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Live Quote Calculated
                      </div>
                      <div className="text-base font-black text-slate-900">
                        $45,000 <span className="text-xs font-semibold text-emerald-600">(+18.5% Margin)</span>
                      </div>
                    </div>
                  </div>

                  {/* Floating Micro-Card 2: Locked Catalog Badge */}
                  <div className="absolute -top-4 -right-4 hidden sm:flex items-center gap-2.5 rounded-2xl border border-slate-200/90 bg-white/95 px-4 py-3 shadow-xl backdrop-blur-md">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <Lock size={16} />
                    </div>
                    <div className="text-xs font-bold text-slate-800">
                      Product Locked to Catalog
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ────────────────── TRUST BAR / ENTERPRISE PARTNERS ────────────────── */}
        <section className="border-y border-slate-200 bg-white py-10">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
              Empowering High-Volume Traders & Installers Nationwide
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-center opacity-65 grayscale hover:grayscale-0 transition-all duration-300">
              <div className="flex items-center justify-center gap-2 text-slate-800 font-extrabold text-base tracking-tight">
                <Globe size={22} className="text-blue-600" /> NEXA SOLAR
              </div>
              <div className="flex items-center justify-center gap-2 text-slate-800 font-extrabold text-base tracking-tight">
                <Building2 size={22} className="text-indigo-600" /> APEX WHOLESALE
              </div>
              <div className="flex items-center justify-center gap-2 text-slate-800 font-extrabold text-base tracking-tight">
                <Zap size={22} className="text-amber-500" /> VOLTFLOW B2B
              </div>
              <div className="flex items-center justify-center gap-2 text-slate-800 font-extrabold text-base tracking-tight">
                <Layers size={22} className="text-purple-600" /> TRADEGRID
              </div>
              <div className="flex items-center justify-center gap-2 text-slate-800 font-extrabold text-base tracking-tight">
                <Award size={22} className="text-emerald-600" /> TERRAPOWER
              </div>
            </div>
          </div>
        </section>

        {/* ────────────────── COLLABORATION SHOWCASE (SALESFORCE / BITRIX STYLE) ────────────────── */}
        <section id="collaboration" className="py-24 bg-slate-50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Image Side */}
              <div className="lg:col-span-6 order-2 lg:order-1">
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
                  <img
                    src={b2bCollabImg}
                    alt="B2B Supplier and Vendor Collaboration in LeadMS"
                    className="w-full h-auto object-cover"
                  />
                  <div className="p-6 bg-white border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase">Seamless Handshake</div>
                      <div className="text-sm font-extrabold text-slate-900">Wholesale Trader ⟷ Local Vendor Alignment</div>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                      Zero Friction
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Content Side */}
              <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3.5 py-1 text-xs font-bold text-indigo-700">
                  <Zap size={14} /> Bridge The Distribution Gap
                </div>

                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  Stop Juggling Messy Spreadsheets & Fragmented Price Lists
                </h2>

                <p className="text-base text-slate-600 leading-relaxed">
                  Traditional B2B distribution suffers from slow pricing updates, leaked margins, and delayed customer
                  proposals. LeadMS creates a secure digital bridge where wholesale suppliers publish live product
                  inventories and distributors instantly configure custom margins to quote their clients.
                </p>

                <div className="space-y-4 pt-2">
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700 font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">Atomic Product Locking</h4>
                      <p className="text-sm text-slate-600">
                        Vendors claim exclusive supplier items into their active sales catalog with one click.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">Configurable Pricing Profiles</h4>
                      <p className="text-sm text-slate-600">
                        Pre-set your vendor margin %, flat installation rates, and miscellaneous charges.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-700 font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">Real-Time Quoting Engine</h4>
                      <p className="text-sm text-slate-600">
                        Generate comprehensive itemized estimates instantly and update client pipeline status.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ────────────────── PLATFORM CORE CAPABILITIES ────────────────── */}
        <section id="features" className="py-24 bg-white border-t border-slate-200">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-700 mb-3">
                Comprehensive B2B Architecture
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Engineered for High-Stakes Commercial Workflows
              </h2>
              <p className="mt-3 text-base text-slate-600">
                Every component is built for speed, data security, and seamless collaboration between teams.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="rounded-3xl border border-slate-200 bg-slate-50/50 p-8 shadow-xs hover:shadow-xl hover:border-blue-300 hover:bg-white transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white mb-6 shadow-md shadow-blue-500/20">
                    <Lock size={26} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2.5">
                    Catalog Locking Engine
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Powered by atomic MongoDB operations. Once a vendor locks a product from the Trader pool,
                    it becomes instantly accessible in the Quoting modal while isolating sensitive supplier pricing.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center gap-2 text-xs font-bold text-blue-600">
                  <Check size={14} className="text-emerald-500" /> Atomic $addToSet & $pull logic
                </div>
              </div>

              {/* Feature 2 */}
              <div className="rounded-3xl border border-slate-200 bg-slate-50/50 p-8 shadow-xs hover:shadow-xl hover:border-indigo-300 hover:bg-white transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white mb-6 shadow-md shadow-indigo-500/20">
                    <Calculator size={26} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2.5">
                    Live Math Calculations
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    No spreadsheet formulas or manual errors. The system automatically computes base subtotals,
                    vendor margins, and fee markups in real-time as quantities or SKUs change.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center gap-2 text-xs font-bold text-indigo-600">
                  <Check size={14} className="text-emerald-500" /> Real-time interactive recalculations
                </div>
              </div>

              {/* Feature 3 */}
              <div className="rounded-3xl border border-slate-200 bg-slate-50/50 p-8 shadow-xs hover:shadow-xl hover:border-purple-300 hover:bg-white transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-600 text-white mb-6 shadow-md shadow-purple-500/20">
                    <FileSpreadsheet size={26} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2.5">
                    Multi-Stage Pipeline
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Track client requests from initial discovery (New) to Contacted, Quoted, and Won. Complete with
                    team assignment delegation and status badge visual clarity.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center gap-2 text-xs font-bold text-purple-600">
                  <Check size={14} className="text-emerald-500" /> Automated status progression
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ────────────────── INTERACTIVE ROLE ARCHITECTURE (TABS) ────────────────── */}
        <section id="roles" className="py-24 bg-slate-50 border-t border-slate-200">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">
                Multi-Tenant Governance
              </h2>
              <p className="text-3xl sm:text-4xl font-black text-slate-900">
                Tailored for Every Stakeholder
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Select a role below to see tailored tools and capabilities.
              </p>
            </div>

            {/* Role Switcher Tabs */}
            <div className="flex justify-center mb-10">
              <div className="inline-flex rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
                {[
                  { id: 'vendor', label: 'Vendors & Installers' },
                  { id: 'trader', label: 'Wholesale Traders' },
                  { id: 'team', label: 'Sales Team Members' },
                  { id: 'admin', label: 'Platform Admins' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveRoleTab(tab.id)}
                    className={`rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      activeRoleTab === tab.id
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Role Content Card */}
            <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-xl">
              {activeRoleTab === 'vendor' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <span className="inline-flex items-center rounded-lg bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 mb-3">
                      Role: Vendor / Commercial Contractor
                    </span>
                    <h3 className="text-2xl font-black text-slate-900 mb-3">
                      Control Your Margins & Build Rapid Proposals
                    </h3>
                    <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                      Lock supplier goods directly to your sales catalog, set your profit margin percentages, and generate
                      professional, itemized quotes for your residential and commercial clients in seconds.
                    </p>
                    <ul className="space-y-3 text-sm text-slate-700">
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                        <span>Lock & unlock wholesale supplier items</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                        <span>Set dynamic margin % & installation fees</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                        <span>Manage incoming inquiries & assign to team reps</span>
                      </li>
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <span className="text-xs font-bold text-slate-500">Pricing Profile Simulation</span>
                      <span className="text-xs font-bold text-emerald-600">Active</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Base Equipment Cost:</span>
                      <span className="font-bold text-slate-900">$10,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Applied Margin (+20%):</span>
                      <span className="font-bold text-emerald-600">+$2,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Installation & Misc:</span>
                      <span className="font-bold text-slate-900">+$1,500</span>
                    </div>
                    <div className="pt-3 border-t border-slate-200 flex justify-between text-base font-black">
                      <span>Total Client Quote:</span>
                      <span className="text-blue-600">$13,500</span>
                    </div>
                  </div>
                </div>
              )}

              {activeRoleTab === 'trader' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <span className="inline-flex items-center rounded-lg bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 mb-3">
                      Role: Wholesale Trader / Manufacturer
                    </span>
                    <h3 className="text-2xl font-black text-slate-900 mb-3">
                      Expand Wholesale Distribution Across Verified Vendors
                    </h3>
                    <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                      Publish wholesale products, manage stock specifications, and expand commercial demand across all
                      registered vendors without handling retail customer inquiries directly.
                    </p>
                    <ul className="space-y-3 text-sm text-slate-700">
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                        <span>Publish wholesale inventory with base pricing</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                        <span>Instant visibility to all platform vendors</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                        <span>Clean product editing & SKU management</span>
                      </li>
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <span className="text-xs font-bold text-slate-500">Live Trader SKU Listing</span>
                      <span className="text-xs font-bold text-blue-600">Available</span>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <div className="font-bold text-sm text-slate-900">3kW Grid-Tie Solar Inverter</div>
                      <div className="text-xs text-slate-500">Wholesale Base: $45,000 / unit</div>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <div className="font-bold text-sm text-slate-900">400W Monocrystalline Panel</div>
                      <div className="text-xs text-slate-500">Wholesale Base: $240 / unit</div>
                    </div>
                  </div>
                </div>
              )}

              {activeRoleTab === 'team' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <span className="inline-flex items-center rounded-lg bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700 mb-3">
                      Role: Sales Representative / Team Member
                    </span>
                    <h3 className="text-2xl font-black text-slate-900 mb-3">
                      Focus on Relationships While Prices Calculate Automatically
                    </h3>
                    <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                      Team members invited by vendors can manage their assigned pipeline, add client inquiries, and generate
                      quotes utilizing the vendor's locked catalog and verified pricing rules.
                    </p>
                    <ul className="space-y-3 text-sm text-slate-700">
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                        <span>Manage assigned client leads</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                        <span>Instant access to vendor locked products</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                        <span>1-click quote generation without math errors</span>
                      </li>
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-3">
                    <div className="text-xs font-bold text-slate-500 mb-1">Assigned Pipeline Opportunities</div>
                    <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-sm text-slate-900">Riya Yadav</div>
                        <div className="text-xs text-slate-500">Commercial Rooftop 10kW</div>
                      </div>
                      <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-bold text-purple-700">
                        Quoted
                      </span>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-sm text-slate-900">Apex Retailers</div>
                        <div className="text-xs text-slate-500">Warehouse Retrofit</div>
                      </div>
                      <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-700">
                        New
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeRoleTab === 'admin' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <span className="inline-flex items-center rounded-lg bg-slate-100 px-3 py-1 text-xs font-bold text-slate-800 mb-3">
                      Role: Platform Administrator
                    </span>
                    <h3 className="text-2xl font-black text-slate-900 mb-3">
                      Total System Visibility & Financial Governance
                    </h3>
                    <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                      Admins enjoy complete audit access to monitor platform user growth, track overall pipeline revenue,
                      and inspect quoting profit margins across all registered companies.
                    </p>
                    <ul className="space-y-3 text-sm text-slate-700">
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                        <span>System-wide user & role breakdown</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                        <span>Total Quoted Pipeline Value analytics</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                        <span>Expected margin totals & inventory audits</span>
                      </li>
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-3">
                    <div className="text-xs font-bold text-slate-500 mb-1">Admin Aggregate Telemetry</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-white rounded-xl border border-slate-200">
                        <div className="text-xs text-slate-400 font-bold">Total Users</div>
                        <div className="text-xl font-black text-slate-900">1,248</div>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-slate-200">
                        <div className="text-xs text-slate-400 font-bold">Pipeline Value</div>
                        <div className="text-xl font-black text-blue-600">$18.5M</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ────────────────── METRICS & PERFORMANCE BANNER ────────────────── */}
        <section id="metrics" className="py-20 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/15">
              <div className="pt-4 md:pt-0">
                <div className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-1">
                  3.8x
                </div>
                <div className="text-xs sm:text-sm font-medium text-blue-200">
                  Faster Quote Generation
                </div>
              </div>

              <div className="pt-4 md:pt-0">
                <div className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-1">
                  $18.5M+
                </div>
                <div className="text-xs sm:text-sm font-medium text-blue-200">
                  Total Quoted Value
                </div>
              </div>

              <div className="pt-4 md:pt-0">
                <div className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-1">
                  99.98%
                </div>
                <div className="text-xs sm:text-sm font-medium text-blue-200">
                  Uptime Reliability SLA
                </div>
              </div>

              <div className="pt-4 md:pt-0">
                <div className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-1">
                  100%
                </div>
                <div className="text-xs sm:text-sm font-medium text-blue-200">
                  Role Data Isolation
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ────────────────── CONVERSION CTA BANNER ────────────────── */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-blue-900 px-8 py-16 sm:p-20 text-center shadow-2xl">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

              <h2 className="relative text-3xl sm:text-5xl font-black text-white tracking-tight max-w-3xl mx-auto">
                Ready to Accelerate Your B2B Distribution & Quoting?
              </h2>

              <p className="relative mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
                Join hundreds of forward-thinking suppliers and vendors using LeadMS to lock catalog goods, automate
                complex pricing math, and convert leads into closed deals.
              </p>

              <div className="relative mt-8 flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/register"
                  className="rounded-xl bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-blue-500 hover:shadow-blue-500/25 cursor-pointer"
                >
                  Create Your Free Account
                </Link>
                <Link
                  to="/login"
                  className="rounded-xl border border-white/20 bg-white/10 px-8 py-4 text-base font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20 cursor-pointer"
                >
                  Sign In to Workspace
                </Link>
              </div>

              <div className="relative mt-6 text-xs text-slate-400">
                Immediate access • No software download needed • Full API capability
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ────────────────── ENTERPRISE FOOTER ────────────────── */}
      <footer className="border-t border-slate-200 bg-slate-50 py-16 text-slate-600">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            {/* Col 1 */}
            <div className="col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm">
                  L
                </div>
                <span className="text-lg font-black text-slate-900 tracking-tight">
                  Lead<span className="text-blue-600">MS</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                The role-based B2B sales management and quotation engine designed for wholesale distribution,
                equipment traders, and commercial contracting teams.
              </p>
              <div className="text-xs text-slate-400">
                Built with React 19, Tailwind CSS v4, Express v5 & MongoDB Atlas.
              </div>
            </div>

            {/* Col 2 */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Product</h5>
              <ul className="space-y-2 text-xs">
                <li><a href="#features" className="hover:text-blue-600 transition-colors">Catalog Locking</a></li>
                <li><a href="#features" className="hover:text-blue-600 transition-colors">Quoting Engine</a></li>
                <li><a href="#features" className="hover:text-blue-600 transition-colors">Lead Pipeline</a></li>
                <li><a href="#metrics" className="hover:text-blue-600 transition-colors">Performance SLA</a></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Roles</h5>
              <ul className="space-y-2 text-xs">
                <li><a href="#roles" className="hover:text-blue-600 transition-colors">Vendors & Installers</a></li>
                <li><a href="#roles" className="hover:text-blue-600 transition-colors">Wholesale Traders</a></li>
                <li><a href="#roles" className="hover:text-blue-600 transition-colors">Sales Representatives</a></li>
                <li><a href="#roles" className="hover:text-blue-600 transition-colors">Platform Admins</a></li>
              </ul>
            </div>

            {/* Col 4 */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Security & Compliance</h5>
              <ul className="space-y-2 text-xs">
                <li><span className="text-slate-500">JWT Authentication</span></li>
                <li><span className="text-slate-500">Multi-Device Invalidation</span></li>
                <li><span className="text-slate-500">Role-Based Access Guard</span></li>
                <li><span className="text-slate-500">Encrypted Password Hashing</span></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div>
              &copy; {new Date().getFullYear()} LeadMS SaaS Inc. All rights reserved.
            </div>
            <div className="flex gap-6">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Security Center</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage


import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  ShieldCheck,
  Lock,
  Unlock,
  Calculator,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Package,
  Layers,
  Sparkles,
  ChevronRight,
  Star,
  Check,
  Building2,
  Play,
  Pause,
  Zap,
  Globe,
  Award,
  Mail,
  Workflow,
  Sliders,
  IndianRupee,
} from 'lucide-react'
import useAuthStore from '../store/useAuthStore'
import workflowDemoVideo from '../assets/workflow-demo.mp4'
import handshakeAnimationVideo from '../assets/handshake-animation.mp4'
import b2bCollabImg from '../assets/crm_b2b_collaboration.jpg'

// Lightweight SVG Sun & Moon icons for the theme switcher
const SunIcon = ({ size = 15, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
)

const MoonIcon = ({ size = 15, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
)

// Sample products for the Live Quote Simulator
const SAMPLE_PRODUCTS = [
  {
    id: 'solar-450w',
    name: '450W Mono PERC Solar Panel',
    category: 'PV Modules',
    basePrice: 14500,
    unit: 'panel',
    defaultQty: 8,
  },
  {
    id: 'inverter-5kw',
    name: '5kW Hybrid Smart Inverter',
    category: 'Power Electronics',
    basePrice: 48000,
    unit: 'unit',
    defaultQty: 1,
  },
  {
    id: 'battery-10kwh',
    name: '10kWh Lithium LFP Storage Bank',
    category: 'Energy Storage',
    basePrice: 125000,
    unit: 'pack',
    defaultQty: 0,
  },
  {
    id: 'mounting-kit',
    name: 'Anodized Rooftop Mounting Kit',
    category: 'Hardware',
    basePrice: 9500,
    unit: 'set',
    defaultQty: 1,
  },
]

function LandingPage() {
  const { isAuthenticated } = useAuthStore()
  const [activeRoleTab, setActiveRoleTab] = useState('vendor')

  // Theme state: Light / Dark theme support
  const [themeMode, setThemeMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('leadms-landing-theme') || 'light'
    }
    return 'light'
  })

  const toggleTheme = (mode) => {
    setThemeMode(mode)
    if (typeof window !== 'undefined') {
      localStorage.setItem('leadms-landing-theme', mode)
    }
    if (typeof document !== 'undefined') {
      if (mode === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }

  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (themeMode === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }, [themeMode])

  const isDark = themeMode === 'dark'

  // Feature 1: Interactive Live Quote Simulator State
  const [quantities, setQuantities] = useState({
    'solar-450w': 10,
    'inverter-5kw': 1,
    'battery-10kwh': 0,
    'mounting-kit': 1,
  })
  const [marginPercent, setMarginPercent] = useState(18)
  const [includeInstallation, setIncludeInstallation] = useState(true)
  const [quoteDispatched, setQuoteDispatched] = useState(false)

  // Feature 1 - Bento Card 2: Interactive Catalog Lock Simulator
  const [isDemoProductLocked, setIsDemoProductLocked] = useState(true)

  // Feature 2: Animated Mechanism Walkthrough State
  const [activeStep, setActiveStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [stepProgress, setStepProgress] = useState(0)

  // Scroll-based viewport playback using Intersection Observer API
  const videoRef = useRef(null)
  const heroVideoRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target
          if (!video) return

          if (entry.isIntersecting) {
            // Play video when it enters the viewport
            video.play().catch((error) => {
              console.log('Autoplay prevented:', error)
            })
          } else {
            // Pause video when it leaves the viewport
            video.pause()
          }
        })
      },
      {
        threshold: 0.5, // Trigger when 50% of the video is visible
      }
    )

    const currentHandshakeVideo = videoRef.current
    const currentHeroVideo = heroVideoRef.current

    if (currentHandshakeVideo) {
      observer.observe(currentHandshakeVideo)
    }
    if (currentHeroVideo) {
      observer.observe(currentHeroVideo)
    }

    return () => {
      if (currentHandshakeVideo) {
        observer.unobserve(currentHandshakeVideo)
      }
      if (currentHeroVideo) {
        observer.unobserve(currentHeroVideo)
      }
    }
  }, [])

  // Autoplay loop for the Mechanism Walkthrough Card
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setStepProgress((prev) => {
        if (prev >= 100) {
          setActiveStep((curr) => (curr + 1) % 3)
          return 0
        }
        return prev + 2.5 // ~4 seconds per step cycle
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isPlaying])

  const handleManualStepChange = (index) => {
    setActiveStep(index)
    setStepProgress(0)
  }

  // Quote Simulator Math Calculations in INR (₹)
  const baseEquipmentTotal = SAMPLE_PRODUCTS.reduce((acc, product) => {
    const qty = quantities[product.id] || 0
    return acc + product.basePrice * qty
  }, 0)

  const marginAmount = Math.round(baseEquipmentTotal * (marginPercent / 100))
  const installationFee = includeInstallation ? 12000 : 0
  const logisticsFee = 4500
  const finalQuoteTotal = baseEquipmentTotal + marginAmount + installationFee + logisticsFee

  const formatINR = (val) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val)

  const updateQuantity = (id, delta) => {
    setQuantities((prev) => {
      const current = prev[id] || 0
      const nextVal = Math.max(0, current + delta)
      return { ...prev, [id]: nextVal }
    })
    setQuoteDispatched(false)
  }

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-200 selection:bg-blue-600 selection:text-white ${
        isDark ? 'bg-[#090d16] text-slate-100' : 'bg-white text-slate-900'
      }`}
    >
      {/* ────────────────── TOP ANNOUNCEMENT BAR ────────────────── */}
      <div
        className={`px-4 py-2 text-center text-xs font-medium relative z-30 transition-colors ${
          isDark
            ? 'bg-[#060a12] border-b border-slate-800/80 text-slate-300'
            : 'bg-slate-900 text-slate-200 border-b border-slate-800'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2">
          <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-blue-300 border border-blue-500/30">
            v2.4 Release
          </span>
          <span className="hidden sm:inline">
            New: Automated Quoting Math Engine with One-Click Catalog Locking in ₹ INR.
          </span>
          <span className="sm:hidden">New: Live Quoting Engine v2.4</span>
          <a
            href="#simulator"
            className="inline-flex items-center gap-1 font-semibold text-blue-400 underline underline-offset-2 hover:text-blue-300 transition-colors ml-1"
          >
            Try Live Simulator <ArrowRight size={13} />
          </a>
        </div>
      </div>

      {/* ────────────────── STICKY ENTERPRISE NAVBAR ────────────────── */}
      <header
        className={`sticky top-0 z-50 transition-all border-b backdrop-blur-md ${
          isDark
            ? 'bg-[#090d16]/90 border-slate-800/80 text-slate-200'
            : 'bg-white/95 border-slate-200/80 text-slate-800'
        }`}
      >
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 lg:px-8">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <img
              src="/leadms_logo.jpg"
              alt="LeadMS"
              className="h-10 w-10 rounded-xl object-cover shadow-sm border border-slate-200 group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <span className="text-xl font-display font-black tracking-tight leading-tight">
                Lead<span className="text-blue-600">MS</span>
              </span>
              <span className="text-[10px] font-display font-bold uppercase tracking-widest text-slate-400 -mt-0.5">
                Enterprise CRM
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            className={`hidden md:flex items-center gap-8 text-[13px] font-sans font-medium tracking-wide ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            <a href="#simulator" className="hover:text-blue-600 transition-colors">
              Quote Calculator
            </a>
            <a href="#mechanism" className="hover:text-blue-600 transition-colors">
              How It Works
            </a>
            <a href="#collaboration" className="hover:text-blue-600 transition-colors">
              Wholesale Bridge
            </a>
            <a href="#roles" className="hover:text-blue-600 transition-colors">
              Role Portals
            </a>
            <a href="#metrics" className="hover:text-blue-600 transition-colors">
              Platform Impact
            </a>
          </nav>

          {/* Right Action Buttons & Theme Selector */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Pill: Icons Only */}
            <div
              className={`flex items-center rounded-xl p-1 border transition-colors ${
                isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-100/90 border-slate-200'
              }`}
            >
              <button
                onClick={() => toggleTheme('light')}
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all cursor-pointer ${
                  !isDark
                    ? 'bg-white text-amber-500 shadow-2xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Light Mode"
                aria-label="Switch to Light Mode"
              >
                <SunIcon size={16} />
              </button>
              <button
                onClick={() => toggleTheme('dark')}
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all cursor-pointer ${
                  isDark
                    ? 'bg-slate-800 text-blue-400 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Dark Mode"
                aria-label="Switch to Dark Mode"
              >
                <MoonIcon size={16} />
              </button>
            </div>

            {isAuthenticated ? (
              <Link
                to="/app/dashboard"
                className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-display font-semibold tracking-tight transition-all cursor-pointer shadow-sm ${
                  isDark
                    ? 'bg-white text-slate-950 hover:bg-slate-100'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                Go to Workspace <ArrowRight size={15} />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`hidden sm:inline-block rounded-xl px-3.5 py-2 text-[13px] font-sans font-medium tracking-wide transition-colors ${
                    isDark
                      ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className={`inline-flex items-center gap-1.5 rounded-xl px-4.5 py-2.5 text-sm font-display font-semibold tracking-tight transition-all cursor-pointer shadow-sm ${
                    isDark
                      ? 'bg-blue-600 hover:bg-blue-500 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/15'
                  }`}
                >
                  Start Free Trial <ChevronRight size={15} />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 font-sans">
        {/* ────────────────── 1. HERO SECTION WITH ANIMATED WORKFLOW VIDEO ────────────────── */}
        <section
          className={`relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32 transition-colors ${
            isDark ? 'bg-[#090d16]' : 'bg-gradient-to-b from-slate-50/80 via-white to-white'
          }`}
        >
          {/* Subtle Ambient Lighting (Natural, not neon AI) */}
          {isDark ? (
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-900/10 blur-[130px] pointer-events-none rounded-full" />
          ) : (
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-blue-100/30 blur-[100px] pointer-events-none rounded-full" />
          )}

          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left Column: Value Prop & CTAs */}
              <div className="lg:col-span-6 space-y-6 text-left z-10">
                <div>
                  <p className="text-xs font-semibold tracking-widest uppercase text-blue-600 dark:text-blue-400 mb-2">
                    Enterprise B2B Distribution & Quoting
                  </p>
                  {/* Main Headline */}
                  <h1
                    className={`text-4xl sm:text-5xl lg:text-6xl font-display font-black tracking-[-0.02em] leading-[1.05] ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    Connect Traders, Lock Catalogs, &{' '}
                    <span className={`inline ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                      Automate Commercial Deals
                    </span>
                  </h1>
                </div>

                <p
                  className={`text-base sm:text-lg font-sans leading-relaxed max-w-xl ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  LeadMS unifies wholesale equipment suppliers and distribution networks into one real-time workspace.
                  Lock trader inventory into private sales catalogs, compute dynamic margins in Indian Rupees, and
                  dispatch proposals in seconds.
                </p>

                {/* Primary Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                  <Link
                    to={isAuthenticated ? '/app/dashboard' : '/register'}
                    className={`inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-base font-display font-semibold tracking-tight transition-all hover:-translate-y-0.5 cursor-pointer shadow-md ${
                      isDark
                        ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-500/20'
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/25'
                    }`}
                  >
                    Start Free Trial <ArrowRight size={17} />
                  </Link>
                  <a
                    href="#simulator"
                    className={`inline-flex items-center justify-center gap-2 rounded-xl border px-6 py-3.5 text-base font-display font-medium tracking-tight shadow-2xs transition-all ${
                      isDark
                        ? 'border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-200'
                        : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Calculator size={17} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
                    Interactive Calculator
                  </a>
                </div>

                {/* Social Proof Badges */}
                <div
                  className={`pt-4 border-t flex flex-wrap items-center gap-6 text-xs ${
                    isDark ? 'border-slate-800/80 text-slate-400' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      <div className="h-8 w-8 rounded-full bg-blue-600 border-2 border-white dark:border-slate-950 flex items-center justify-center font-bold text-[10px] text-white">
                        SK
                      </div>
                      <div className="h-8 w-8 rounded-full bg-slate-800 border-2 border-white dark:border-slate-950 flex items-center justify-center font-bold text-[10px] text-white">
                        MR
                      </div>
                      <div className="h-8 w-8 rounded-full bg-emerald-600 border-2 border-white dark:border-slate-950 flex items-center justify-center font-bold text-[10px] text-white">
                        DL
                      </div>
                    </div>
                    <div className="pl-1">
                      <div className="flex items-center text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={13} className="fill-amber-500" />
                        ))}
                      </div>
                      <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
                        4.9/5 from 300+ B2B distributors
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 font-medium">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    <span>Real-Time Math Engine</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Floating Animated Workflow Video Card (Stripe Style) */}
              <div className="lg:col-span-6 relative z-10 w-full flex justify-center lg:justify-start">
                <div className="relative mx-auto lg:mx-0 w-full max-w-lg lg:max-w-none lg:w-[114%] xl:w-[120%] group">
                  {/* Multi-layered ambient depth glow (Stripe hero aesthetic) */}
                  <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-blue-600/20 via-indigo-600/15 to-blue-500/20 blur-xl opacity-80 -z-10 transition-opacity" />

                  {/* Floating Card Container with rounded-2xl, border border-white/20, shadow-2xl */}
                  <div
                    className={`relative overflow-hidden rounded-2xl border border-white/20 shadow-2xl transition-all duration-300 backdrop-blur-md ring-1 ring-black/5 dark:ring-white/10 ${
                      isDark
                        ? 'bg-slate-900/90 shadow-slate-950/70'
                        : 'bg-white/95 shadow-slate-900/20'
                    }`}
                  >
                    {/* Browser Window Header */}
                    <div
                      className={`flex h-10 items-center justify-between border-b px-4 transition-colors ${
                        isDark ? 'border-slate-800/80 bg-slate-950/80' : 'border-slate-200/80 bg-slate-100/90'
                      }`}
                    >
                      <div className="flex gap-2">
                        <div className="h-3 w-3 rounded-full bg-rose-400" />
                        <div className="h-3 w-3 rounded-full bg-amber-400" />
                        <div className="h-3 w-3 rounded-full bg-emerald-400" />
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                        <Lock size={11} className="text-slate-400" /> app.leadms.com/workflow-demo
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Workflow
                      </span>
                    </div>

                    {/* Animated Workflow Video Element with Required Attributes: autoPlay loop muted playsInline preload="auto" */}
                    <video
                      ref={heroVideoRef}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="auto"
                      src={workflowDemoVideo}
                      className="w-full h-auto object-cover rounded-b-2xl block shadow-inner"
                    >
                      <source src={workflowDemoVideo} type="video/mp4" />
                      <source src="/workflow-demo.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>

                  {/* Floating Micro-Card 1: Quoting Breakdown */}
                  <div
                    className={`absolute -bottom-6 -left-3 sm:-left-4 hidden sm:flex items-center gap-3.5 rounded-2xl border p-4 shadow-xl backdrop-blur-md ${
                      isDark
                        ? 'border-slate-800 bg-slate-900/95 text-white'
                        : 'border-slate-200 bg-white/95 text-slate-900'
                    }`}
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                      <IndianRupee size={20} />
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Live Quote Calculated
                      </div>
                      <div className="text-base font-black">
                        ₹2,38,000 <span className="text-xs font-semibold text-emerald-600">(+18% Margin)</span>
                      </div>
                    </div>
                  </div>

                  {/* Floating Micro-Card 2: Locked Catalog Badge */}
                  <div
                    className={`absolute -top-4 -right-4 hidden sm:flex items-center gap-2.5 rounded-2xl border px-4 py-3 shadow-xl backdrop-blur-md ${
                      isDark
                        ? 'border-slate-800 bg-slate-900/95 text-white'
                        : 'border-slate-200 bg-white/95 text-slate-900'
                    }`}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      <Lock size={15} />
                    </div>
                    <div>
                      <div className="text-xs font-bold">Locked Pricing</div>
                      <div className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
                        Private Catalog Rate
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enterprise Partners */}
          <div
            className={`relative mx-auto max-w-7xl px-6 lg:px-8 mt-20 pt-10 border-t text-center ${
              isDark ? 'border-slate-800/80' : 'border-slate-200'
            }`}
          >
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
              Powering High-Volume Distributors & Commercial Energy Contractors Nationwide
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-center opacity-65 hover:opacity-100 transition-opacity">
              <div className="flex items-center justify-center gap-2 font-bold text-sm sm:text-base">
                <Globe size={18} className="text-blue-600" /> NEXA SOLAR
              </div>
              <div className="flex items-center justify-center gap-2 font-bold text-sm sm:text-base">
                <Building2 size={18} className="text-indigo-600" /> APEX WHOLESALE
              </div>
              <div className="flex items-center justify-center gap-2 font-bold text-sm sm:text-base">
                <Zap size={18} className="text-amber-500" /> VOLTFLOW B2B
              </div>
              <div className="flex items-center justify-center gap-2 font-bold text-sm sm:text-base">
                <Layers size={18} className="text-purple-600" /> TRADEGRID
              </div>
              <div className="flex items-center justify-center gap-2 font-bold text-sm sm:text-base">
                <Award size={18} className="text-emerald-600" /> TERRAPOWER
              </div>
            </div>
          </div>
        </section>

        {/* ────────────────── 2. FEATURE 1: INTERACTIVE BENTO GRID WITH LIVE QUOTE SIMULATOR ────────────────── */}
        <section
          id="simulator"
          className={`relative py-24 border-t transition-colors ${
            isDark ? 'bg-[#0c101a] border-slate-800/80 text-slate-100' : 'bg-slate-50/70 border-slate-200 text-slate-900'
          }`}
        >
          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            {/* Section Heading */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-xs font-semibold tracking-widest uppercase text-blue-600 dark:text-blue-400 mb-2">
                Live Margin Math & Quoting
              </p>
              <h2
                className={`text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight leading-[1.1] ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                Instant Quote Building with Live Margin Math
              </h2>
              <p
                className={`mt-4 text-base sm:text-lg font-sans leading-relaxed ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                Experience the real-time pricing engine built for commercial distribution. Adjust equipment quantities,
                tune vendor profit margins, and calculate itemized proposals live in Indian Rupees (₹) with guaranteed math accuracy.
              </p>
            </div>

            {/* 3-COLUMN BENTO GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* ── BENTO BLOCK 1 (Span 8 Cols): LIVE QUOTE CALCULATOR WIDGET ── */}
              <div
                className={`lg:col-span-8 rounded-3xl border p-6 sm:p-8 shadow-sm flex flex-col justify-between transition-all ${
                  isDark
                    ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                    : 'bg-white border-slate-200/90 hover:border-slate-300'
                }`}
              >
                <div>
                  <div
                    className={`flex flex-wrap items-center justify-between gap-4 border-b pb-5 mb-6 ${
                      isDark ? 'border-slate-800' : 'border-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                        <Calculator size={22} />
                      </div>
                      <div>
                        <h3 className="text-xl font-display font-bold flex items-center gap-2">
                          Live Quote Calculator Widget
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800">
                            Real-Time Math
                          </span>
                        </h3>
                        <p className="text-xs font-sans leading-relaxed text-slate-500">
                          Click products, tune margins, and witness zero-latency Indian Rupee calculations.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-400 px-3 py-1.5 rounded-xl">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Currency: INR (₹)
                    </div>
                  </div>

                  {/* Sample Product Selection Row */}
                  <div className="mb-6">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between">
                      <span>Available Hardware Items in Vendor Catalog:</span>
                      <span className="text-blue-600 dark:text-blue-400 text-[11px] lowercase font-normal">
                        Adjust quantities below
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {SAMPLE_PRODUCTS.map((prod) => {
                        const qty = quantities[prod.id] || 0
                        const isSelected = qty > 0

                        return (
                          <div
                            key={prod.id}
                            className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                              isSelected
                                ? isDark
                                  ? 'bg-slate-800/90 border-blue-500/40 shadow-sm'
                                  : 'bg-blue-50/40 border-blue-200 shadow-2xs'
                                : isDark
                                ? 'bg-slate-950/50 border-slate-800 opacity-60 hover:opacity-100'
                                : 'bg-slate-50 border-slate-200/80 opacity-70 hover:opacity-100'
                            }`}
                          >
                            <div className="space-y-0.5 pr-2">
                              <div className="text-xs font-semibold line-clamp-1">{prod.name}</div>
                              <div className="text-[11px] text-blue-600 dark:text-blue-400 font-mono font-bold">
                                {formatINR(prod.basePrice)} <span className="text-slate-400 font-normal">/{prod.unit}</span>
                              </div>
                            </div>

                            {/* Quantity Stepper Buttons */}
                            <div
                              className={`flex items-center gap-1.5 px-2 py-1 rounded-xl border ${
                                isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
                              }`}
                            >
                              <button
                                onClick={() => updateQuantity(prod.id, -1)}
                                className={`h-6 w-6 rounded-lg text-xs font-bold flex items-center justify-center cursor-pointer transition-colors ${
                                  isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                }`}
                                title="Decrease"
                              >
                                -
                              </button>
                              <span className="w-7 text-center font-mono font-bold text-xs">
                                {qty}
                              </span>
                              <button
                                onClick={() => updateQuantity(prod.id, 1)}
                                className={`h-6 w-6 rounded-lg text-xs font-bold flex items-center justify-center cursor-pointer transition-colors ${
                                  isDark ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'
                                }`}
                                title="Increase"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Pricing Controls: Margin Slider & Installation Toggle */}
                  <div
                    className={`grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl border mb-6 ${
                      isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200/80'
                    }`}
                  >
                    {/* Vendor Margin % Slider */}
                    <div>
                      <div className="flex justify-between items-center text-xs font-bold mb-2">
                        <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                          <Sliders size={14} className="text-blue-600 dark:text-blue-400" /> Vendor Profit Margin:
                        </span>
                        <span className="text-blue-600 dark:text-blue-400 font-mono font-black text-sm">
                          {marginPercent}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="40"
                        value={marginPercent}
                        onChange={(e) => {
                          setMarginPercent(Number(e.target.value))
                          setQuoteDispatched(false)
                        }}
                        className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                        <span>5% (Competitive)</span>
                        <span>20% (Standard)</span>
                        <span>40% (Premium)</span>
                      </div>
                    </div>

                    {/* Installation Fee Toggle */}
                    <div className="flex flex-col justify-between">
                      <div className="flex justify-between items-center text-xs font-bold mb-1">
                        <span className="text-slate-700 dark:text-slate-300">Certified Installation:</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-mono text-xs">
                          {includeInstallation ? '+₹12,000' : 'Waived (₹0)'}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setIncludeInstallation(!includeInstallation)
                          setQuoteDispatched(false)
                        }}
                        className={`w-full py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-between cursor-pointer transition-all ${
                          includeInstallation
                            ? isDark
                              ? 'bg-emerald-950/70 border-emerald-600/60 text-emerald-300'
                              : 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-2xs hover:bg-emerald-100/80'
                            : isDark
                            ? 'bg-slate-900 border-slate-700 text-slate-400'
                            : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>Include Rooftop Mounting & Wiring</span>
                        <span
                          className={`h-4 w-7 rounded-full transition-colors flex items-center px-0.5 ${
                            includeInstallation ? 'bg-emerald-500 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                          }`}
                        >
                          <span className="h-3 w-3 rounded-full bg-white shadow-2xs" />
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Real-time Math Breakdown Bar */}
                <div className={`pt-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left mb-4">
                    <div
                      className={`p-3 rounded-xl border ${
                        isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200/80'
                      }`}
                    >
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Base Subtotal
                      </div>
                      <div className="text-sm font-bold font-mono">{formatINR(baseEquipmentTotal)}</div>
                    </div>

                    <div
                      className={`p-3 rounded-xl border ${
                        isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200/80'
                      }`}
                    >
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Margin (+{marginPercent}%)
                      </div>
                      <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                        +{formatINR(marginAmount)}
                      </div>
                    </div>

                    <div
                      className={`p-3 rounded-xl border ${
                        isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200/80'
                      }`}
                    >
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Install + Freight
                      </div>
                      <div className="text-sm font-bold text-blue-600 dark:text-blue-400 font-mono">
                        +{formatINR(installationFee + logisticsFee)}
                      </div>
                    </div>

                    <div
                      className={`p-3 rounded-xl border transition-all ${
                        isDark
                          ? 'bg-blue-950/90 border-blue-500/60 shadow-inner'
                          : 'bg-gradient-to-br from-blue-600 to-indigo-600 border-blue-600 shadow-md shadow-blue-500/20 text-white'
                      }`}
                    >
                      <div
                        className={`text-[10px] font-bold uppercase tracking-wider ${
                          isDark ? 'text-blue-300' : 'text-blue-100'
                        }`}
                      >
                        Final Client Total
                      </div>
                      <div
                        className={`text-base font-black font-mono tracking-tight ${
                          isDark ? 'text-white' : 'text-white'
                        }`}
                      >
                        {formatINR(finalQuoteTotal)}
                      </div>
                    </div>
                  </div>

                  {/* Dispatch Simulation Button */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="text-xs text-slate-400">
                      Formula:{' '}
                      <code className="text-slate-600 dark:text-slate-300 font-mono font-semibold">
                        Base + (Base × Margin%) + Fees = Total
                      </code>
                    </div>

                    <button
                      onClick={() => setQuoteDispatched(true)}
                      className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-display font-semibold tracking-tight transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                        quoteDispatched
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                          : isDark
                          ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20'
                      }`}
                    >
                      {quoteDispatched ? (
                        <>
                          <Check size={15} /> Lead Proposal #LM-4081 Generated in ₹ INR!
                        </>
                      ) : (
                        <>
                          <Zap size={15} /> Simulate Lead Dispatch & PDF Quote
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* ── BENTO BLOCK 2 (Col 3 Top, Span 4): ONE-CLICK CATALOG LOCKING ── */}
              <div
                className={`lg:col-span-4 rounded-3xl border p-6 sm:p-7 shadow-sm flex flex-col justify-between transition-all ${
                  isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/90'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900">
                      <Lock size={19} />
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800">
                      Locked Pricing
                    </span>
                  </div>

                  <h3 className="text-lg font-display font-bold mb-2">One-Click Catalog Locking</h3>
                  <p className="text-xs font-sans text-slate-500 leading-relaxed mb-5">
                    Vendors lock wholesale supplier inventory into private catalogs with one click, shielding raw
                    purchase costs from retail leads and competitors.
                  </p>

                  {/* Interactive Toggle Card */}
                  <div
                    className={`p-4 rounded-2xl border space-y-3 ${
                      isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold">Apex Bifacial 550W Module</div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isDemoProductLocked
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800'
                            : 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800'
                        }`}
                      >
                        {isDemoProductLocked ? 'Locked to Catalog' : 'Public Wholesale'}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 flex justify-between">
                      <span>Trader Base Cost:</span>
                      <span className="font-mono font-medium">₹18,200 / unit</span>
                    </div>

                    <div className="text-[11px] text-slate-500 flex justify-between">
                      <span>Vendor Quoting Status:</span>
                      <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">
                        {isDemoProductLocked ? 'Enabled (+20% Rule)' : 'Restricted'}
                      </span>
                    </div>

                    <button
                      onClick={() => setIsDemoProductLocked(!isDemoProductLocked)}
                      className={`w-full py-2.5 rounded-xl text-xs font-display font-semibold tracking-tight flex items-center justify-center gap-2 cursor-pointer transition-all border shadow-2xs ${
                        isDemoProductLocked
                          ? isDark
                            ? 'bg-rose-950/50 border-rose-800 text-rose-300 hover:bg-rose-900/60'
                            : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100/80'
                          : isDark
                          ? 'bg-blue-600 text-white hover:bg-blue-500 border-blue-500'
                          : 'bg-blue-600 text-white hover:bg-blue-700 border-blue-600 shadow-sm'
                      }`}
                    >
                      {isDemoProductLocked ? (
                        <>
                          <Unlock size={14} /> Unlock From My Catalog
                        </>
                      ) : (
                        <>
                          <Lock size={14} /> Lock to Private Catalog
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 text-[11px] text-slate-400">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span>Prevents unauthorized margin exposure across vendor teams.</span>
                </div>
              </div>

              {/* ── BENTO BLOCK 3 (Col 1 on Bottom Row, Span 4): ZERO MARGIN LEAKAGE ── */}
              <div
                className={`lg:col-span-4 rounded-3xl border p-6 sm:p-7 shadow-sm flex flex-col justify-between transition-all ${
                  isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/90'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
                      <ShieldCheck size={20} />
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800">
                      Private Margins
                    </span>
                  </div>

                  <h3 className="text-lg font-display font-bold mb-2">Zero Margin Leakage</h3>
                  <p className="text-xs font-sans text-slate-500 leading-relaxed mb-4">
                    Sales reps generate quotes without seeing the supplier base price. Wholesale margins stay 100%
                    confidential between the vendor owner and supplier.
                  </p>

                  <div className="space-y-2 text-xs">
                    <div
                      className={`p-2.5 rounded-xl border flex justify-between items-center ${
                        isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200/80'
                      }`}
                    >
                      <span className="text-slate-500">Wholesale Trader View:</span>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                        ₹42,000 (Cost)
                      </span>
                    </div>
                    <div
                      className={`p-2.5 rounded-xl border flex justify-between items-center ${
                        isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200/80'
                      }`}
                    >
                      <span className="text-slate-500">Client / Rep View:</span>
                      <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">
                        ₹51,500 (Quoted)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  <Check size={14} /> Enforced role security: sales reps only see final approved quotes.
                </div>
              </div>

              {/* ── BENTO BLOCK 4 (Col 2 on Bottom Row, Span 4): PIPELINE VELOCITY ── */}
              <div
                className={`lg:col-span-4 rounded-3xl border p-6 sm:p-7 shadow-sm flex flex-col justify-between transition-all ${
                  isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/90'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                      <TrendingUp size={20} />
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800">
                      Pipeline Velocity
                    </span>
                  </div>

                  <h3 className="text-lg font-display font-bold mb-2">Automated Pipeline Funnel</h3>
                  <p className="text-xs font-sans text-slate-500 leading-relaxed mb-4">
                    Deals automatically advance from <span className="font-semibold text-blue-600">New</span> to{' '}
                    <span className="font-semibold text-emerald-600">Quoted</span> upon proposal generation, keeping sales teams
                    synchronized in real time.
                  </p>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div
                      className={`p-2.5 rounded-xl border ${
                        isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">New</div>
                      <div className="font-bold text-slate-900 dark:text-slate-100 text-sm font-mono">142</div>
                    </div>
                    <div
                      className={`p-2.5 rounded-xl border ${
                        isDark
                          ? 'bg-blue-950/80 border-blue-700 text-blue-300'
                          : 'bg-blue-50 border-blue-200 text-blue-900 shadow-2xs'
                      }`}
                    >
                      <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Quoted</div>
                      <div className="font-bold text-blue-700 dark:text-blue-300 text-sm font-mono">88</div>
                    </div>
                    <div
                      className={`p-2.5 rounded-xl border ${
                        isDark
                          ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-900 shadow-2xs'
                      }`}
                    >
                      <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Won</div>
                      <div className="font-bold text-emerald-700 dark:text-emerald-300 text-sm font-mono">54</div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Avg Turnaround:</span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold font-mono">2.4 mins vs 48 hrs</span>
                </div>
              </div>

              {/* ── BENTO BLOCK 5 (Col 3 on Bottom Row, Span 4): INSTANT PROPOSAL DELIVERY ── */}
              <div
                className={`lg:col-span-4 rounded-3xl border p-6 sm:p-7 shadow-sm flex flex-col justify-between transition-all ${
                  isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/90'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400 border border-purple-200 dark:border-purple-900">
                      <Mail size={20} />
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800">
                      Auto-Sent Quotes
                    </span>
                  </div>

                  <h3 className="text-lg font-display font-bold mb-2">Instant Proposal Delivery</h3>
                  <p className="text-xs font-sans text-slate-500 leading-relaxed mb-4">
                    Deliver branded, itemized quotation summaries directly to prospective clients with one click,
                    logging delivery timestamps into your verified audit history.
                  </p>

                  <div
                    className={`p-3 rounded-xl border text-xs space-y-1 ${
                      isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200/80'
                    }`}
                  >
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Proposal #LM-4081 Dispatched</div>
                    <div className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 size={13} /> Delivered via Email & WhatsApp
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 text-[11px] text-slate-500">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span>Automated transmission with complete audit trail</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ────────────────── 3. FEATURE 2: VIDEO / ANIMATED MECHANISM WALKTHROUGH CARD ────────────────── */}
        <section
          id="mechanism"
          className={`relative py-24 border-t transition-colors ${
            isDark ? 'bg-[#090d16] border-slate-800/80 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-xs font-semibold tracking-widest uppercase text-blue-600 dark:text-blue-400 mb-2">
                Product Orchestration
              </p>
              <h2
                className={`text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight leading-[1.1] ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                How LeadMS Eliminates B2B Friction
              </h2>
              <p className={`mt-4 text-base sm:text-lg font-sans leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Observe the seamless 3-stage lifecycle from initial wholesale catalog publication to locked margin
                isolation and instant client proposal generation.
              </p>
            </div>

            {/* MECHANISM SHOWCASE CARD */}
            <div
              className={`mx-auto max-w-5xl rounded-3xl border shadow-xl overflow-hidden transition-colors ${
                isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/90'
              }`}
            >
              {/* Stepper Navigation Bar with Progress Bar */}
              <div className={`border-b px-6 py-4 ${isDark ? 'border-slate-800 bg-slate-950/70' : 'border-slate-100 bg-slate-50'}`}>
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  {[
                    { step: 0, title: '1. Wholesale Trader', sub: 'Adds & Publishes Product' },
                    { step: 1, title: '2. Local Vendor', sub: 'Locks to Private Catalog' },
                    { step: 2, title: '3. Instant Quote', sub: 'Generates Proposal for Lead' },
                  ].map((item) => (
                    <button
                      key={item.step}
                      onClick={() => handleManualStepChange(item.step)}
                      className={`relative text-left p-3 sm:p-4 rounded-2xl transition-all cursor-pointer ${
                        activeStep === item.step
                          ? isDark
                            ? 'bg-slate-900 border border-slate-700 shadow-sm'
                            : 'bg-white border border-slate-200 shadow-xs'
                          : 'hover:opacity-100 opacity-60 border border-transparent'
                      }`}
                    >
                      <div className="text-xs sm:text-sm font-display font-bold flex items-center gap-1.5">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            activeStep === item.step ? 'bg-blue-600' : 'bg-slate-400'
                          }`}
                        />
                        {item.title}
                      </div>
                      <div className="text-[11px] font-sans text-slate-400 hidden sm:block mt-0.5">{item.sub}</div>

                      {/* Animated Progress Bar for the active step */}
                      {activeStep === item.step && isPlaying && (
                        <div className="absolute bottom-0 left-3 right-3 h-0.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 transition-all duration-100"
                            style={{ width: `${stepProgress}%` }}
                          />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mechanism Stage Viewport */}
              <div className="p-6 sm:p-10">
                {/* STEP 0: TRADER ADDS PRODUCT */}
                {activeStep === 0 && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-6 space-y-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/60 dark:border-amber-800 dark:text-amber-300">
                        <Package size={13} /> Stage 01: Supplier Inventory
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-display font-black tracking-tight">Wholesale Trader Publishes Inventory</h3>
                      <p className={`text-sm font-sans leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Suppliers and national manufacturers register baseline specifications, warranty tiers, bulk
                        availability, and minimum wholesale prices into the unified LeadMS database pool.
                      </p>
                      <ul className={`space-y-2.5 text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-emerald-500" />
                          <span>Standardized SKU classification & high-res spec sheets</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-emerald-500" />
                          <span>Base pricing protected from unauthorized retail visitors</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-emerald-500" />
                          <span>Instantly broadcasted to verified platform vendors</span>
                        </li>
                      </ul>
                    </div>

                    {/* Stage Preview Card Mock */}
                    <div
                      className={`lg:col-span-6 rounded-2xl border p-6 shadow-sm space-y-4 ${
                        isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200/90'
                      }`}
                    >
                      <div
                        className={`flex items-center justify-between border-b pb-3 ${
                          isDark ? 'border-slate-800' : 'border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                          <span className="text-xs font-mono font-bold">
                            Trader SKU Listing: Solar Inverter 10kW
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-400">
                          Available in Pool
                        </span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between py-1.5 border-b border-slate-200/50 dark:border-slate-800/60">
                          <span className="text-slate-500">Manufacturer:</span>
                          <span className="font-semibold">Nexa Solar Corp</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-slate-200/50 dark:border-slate-800/60">
                          <span className="text-slate-500">Wholesale Base Cost:</span>
                          <span className="font-mono font-bold text-blue-600 dark:text-blue-400">₹65,000 / unit</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-slate-200/50 dark:border-slate-800/60">
                          <span className="text-slate-500">Warehouse Stock:</span>
                          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                            500 units available
                          </span>
                        </div>
                        <div className="flex justify-between py-1.5">
                          <span className="text-slate-500">API Payload Schema:</span>
                          <span className="font-mono text-[11px] text-slate-400">POST /api/products</span>
                        </div>
                      </div>

                      <div
                        className={`p-3 rounded-xl border text-[11px] font-mono ${
                          isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        {`{ "title": "10kW Grid-Tie Inverter", "basePrice": 65000, "isActive": true }`}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 1: VENDOR LOCKS PRODUCT */}
                {activeStep === 1 && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-6 space-y-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/60 dark:border-blue-800 dark:text-blue-300">
                        <Lock size={13} /> Stage 02: Atomic Locking
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-display font-black tracking-tight">Vendor Locks Item & Binds Margins</h3>
                      <p className={`text-sm font-sans leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Local distributors claim the item into their active sales catalog with 1-click atomic MongoDB
                        locking. The vendor's proprietary margin ruleset is automatically attached.
                      </p>
                      <ul className={`space-y-2.5 text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-emerald-500" />
                          <span>Atomic MongoDB $addToSet isolates concurrent locks</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-emerald-500" />
                          <span>Custom VendorProfile margin percentage applied (+20%)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-emerald-500" />
                          <span>Delegated team reps can now sell without price leakage</span>
                        </li>
                      </ul>
                    </div>

                    {/* Stage Preview Card Mock */}
                    <div
                      className={`lg:col-span-6 rounded-2xl border p-6 shadow-sm space-y-4 ${
                        isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200/90'
                      }`}
                    >
                      <div
                        className={`flex items-center justify-between border-b pb-3 ${
                          isDark ? 'border-slate-800' : 'border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                          <span className="text-xs font-mono font-bold">
                            Vendor Catalog: Atomic Lock Active
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full dark:bg-blue-950 dark:border-blue-800 dark:text-blue-400">
                          Locked by Vendor
                        </span>
                      </div>

                      <div
                        className={`p-4 rounded-xl border space-y-2 ${
                          isDark ? 'bg-blue-950/30 border-blue-900/60' : 'bg-blue-50/60 border-blue-100'
                        }`}
                      >
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Protected Wholesale Base:</span>
                          <span className="font-mono">₹65,000</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Vendor Target Margin (+20%):</span>
                          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">+₹13,000</span>
                        </div>
                        <div className="flex justify-between text-xs pt-1 border-t border-slate-200 dark:border-slate-800 font-bold">
                          <span>Active Catalog Quote Base:</span>
                          <span className="font-mono text-blue-600 dark:text-blue-400">₹78,000</span>
                        </div>
                      </div>

                      <div
                        className={`p-3 rounded-xl border text-[11px] font-mono ${
                          isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        {`// Atomic Mongoose Operation
await VendorProfile.updateOne(
  { vendorId: user._id },
  { $addToSet: { lockedProducts: productId } }
);`}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: VENDOR GENERATES QUOTE */}
                {activeStep === 2 && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-6 space-y-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-300">
                        <IndianRupee size={13} /> Stage 03: Deal Execution
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-display font-black tracking-tight">Instant Itemized Quote & Dispatch</h3>
                      <p className={`text-sm font-sans leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Sales reps select the locked item for their assigned lead, automatically calculating installation
                        fees and taxes. An itemized proposal in Indian Rupees is generated and dispatched.
                      </p>
                      <ul className={`space-y-2.5 text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-emerald-500" />
                          <span>Sub-50ms execution of complex margins & installation fees</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-emerald-500" />
                          <span>Lead status automatically transitions to 'quoted'</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-emerald-500" />
                          <span>Instant transactional email dispatch via Nodemailer</span>
                        </li>
                      </ul>
                    </div>

                    {/* Stage Preview Card Mock */}
                    <div
                      className={`lg:col-span-6 rounded-2xl border p-6 shadow-sm space-y-4 ${
                        isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200/90'
                      }`}
                    >
                      <div
                        className={`flex items-center justify-between border-b pb-3 ${
                          isDark ? 'border-slate-800' : 'border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                          <span className="text-xs font-mono font-bold">
                            Proposal #LM-8924 for Riya Sharma
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-400">
                          Status: Quoted
                        </span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-500">10kW Solar Plant Hardware:</span>
                          <span className="font-mono">₹1,45,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Margin Applied (+18%):</span>
                          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">+₹26,100</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Certified Installation & Testing:</span>
                          <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold">+₹13,200</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-sm font-black">
                          <span>Net Total Quote:</span>
                          <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">₹1,84,300</span>
                        </div>
                      </div>

                      <div
                        className={`p-3 rounded-xl border text-[11px] font-mono flex items-center justify-between ${
                          isDark
                            ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
                            : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        }`}
                      >
                        <span>Instant Proposal PDF Sent</span>
                        <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded font-bold">
                          DELIVERED
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Showcase Play / Pause Controls & Next Button */}
              <div
                className={`border-t px-6 py-3 flex items-center justify-between ${
                  isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-100 bg-slate-50'
                }`}
              >
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex items-center gap-1.5 text-xs font-display font-semibold tracking-tight text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  {isPlaying ? (
                    <>
                      <Pause size={14} /> Pause Autoplay
                    </>
                  ) : (
                    <>
                      <Play size={14} /> Resume Autoplay
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono">Stage {activeStep + 1} of 3</span>
                  <button
                    onClick={() => setActiveStep((prev) => (prev + 1) % 3)}
                    className="text-xs font-display font-semibold tracking-tight px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer"
                  >
                    Next Stage →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ────────────────── 6. COLLABORATION SHOWCASE ────────────────── */}
        <section
          id="collaboration"
          className={`py-24 border-t transition-colors ${
            isDark ? 'bg-[#0c101a] border-slate-800/80 text-slate-100' : 'bg-slate-50/70 border-slate-200 text-slate-900'
          }`}
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Image Side */}
              <div className="lg:col-span-6 order-2 lg:order-1">
                <div
                  className={`overflow-hidden rounded-3xl border shadow-xl ${
                    isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'
                  }`}
                >
                  <video
                    ref={videoRef}
                    src="/handshake-animation.mp4"
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover rounded-2xl"
                  >
                    <source src="/handshake-animation.mp4" type="video/mp4" />
                    <source src={handshakeAnimationVideo} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <div
                    className={`p-6 border-t flex items-center justify-between ${
                      isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-white'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Seamless Handshake
                      </div>
                      <div className="text-sm font-display font-extrabold">Wholesale Trader ↔ Local Vendor Alignment</div>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-400">
                      Zero Friction
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Content Side */}
              <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
                <div>
                  <p className="text-xs font-semibold tracking-widest uppercase text-blue-600 dark:text-blue-400 mb-2">
                    Wholesale Alignment
                  </p>
                  <h2
                    className={`text-3xl sm:text-4xl font-display font-black tracking-tight leading-[1.1] ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    Stop Juggling Messy Spreadsheets & Fragmented Price Lists
                  </h2>
                </div>

                <p className={`text-base font-sans leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Traditional B2B distribution suffers from slow pricing updates, leaked margins, and delayed customer
                  proposals. LeadMS creates a secure digital bridge where wholesale suppliers publish live product
                  inventories and distributors instantly configure custom margins to quote their clients.
                </p>

                <div className="space-y-4 pt-2">
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400 font-display font-bold border border-blue-200 dark:border-blue-900">
                      1
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-base">Instant Catalog Locking</h4>
                      <p className={`text-sm font-sans leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Vendors claim exclusive supplier items into their active sales catalog with one click.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 font-display font-bold border border-indigo-200 dark:border-indigo-900">
                      2
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-base">Configurable Pricing Profiles</h4>
                      <p className={`text-sm font-sans leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Pre-set your vendor margin %, flat installation rates, and miscellaneous charges.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400 font-display font-bold border border-purple-200 dark:border-purple-900">
                      3
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-base">Real-Time Quoting Engine</h4>
                      <p className={`text-sm font-sans leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Generate comprehensive itemized estimates instantly and update client pipeline status.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ────────────────── 7. INTERACTIVE ROLE ARCHITECTURE (TABS) ────────────────── */}
        <section
          id="roles"
          className={`py-24 border-t transition-colors ${
            isDark ? 'bg-[#090d16] border-slate-800/80 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="text-xs font-semibold tracking-widest uppercase text-blue-600 dark:text-blue-400 mb-2">
                Role-Based Portals
              </p>
              <h2
                className={`text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight leading-[1.1] ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                Built for Every Role Across the Wholesale Lifecycle
              </h2>
              <p className={`mt-3 text-base font-sans leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Select a role below to explore customized dashboards and quoting tools designed for your workflow.
              </p>
            </div>

            {/* Role Switcher Tabs */}
            <div className="flex justify-center mb-10">
              <div
                className={`inline-flex rounded-2xl border p-1.5 shadow-2xs ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
                }`}
              >
                {[
                  { id: 'vendor', label: 'Vendors & Installers' },
                  { id: 'trader', label: 'Wholesale Traders' },
                  { id: 'team', label: 'Sales Team Members' },
                  { id: 'admin', label: 'Platform Admins' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveRoleTab(tab.id)}
                    className={`rounded-xl px-5 py-2.5 text-xs sm:text-sm font-display font-semibold tracking-tight transition-all cursor-pointer ${
                      activeRoleTab === tab.id
                        ? isDark
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Role Content Card */}
            <div
              className={`mx-auto max-w-4xl rounded-3xl border p-8 sm:p-12 shadow-xl ${
                isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/90'
              }`}
            >
              {activeRoleTab === 'vendor' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <span className="inline-flex items-center rounded-lg bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-300 mb-3">
                      Role: Vendor / Commercial Contractor
                    </span>
                    <h3 className="text-2xl font-display font-black tracking-tight mb-3">Control Your Margins & Build Rapid Proposals</h3>
                    <p className={`text-sm font-sans mb-6 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Lock supplier goods directly to your sales catalog, set your profit margin percentages, and generate
                      professional, itemized quotes for your residential and commercial clients in seconds.
                    </p>
                    <ul className={`space-y-3 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
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
                  <div
                    className={`rounded-2xl border p-6 space-y-4 ${
                      isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div
                      className={`flex items-center justify-between border-b pb-3 ${
                        isDark ? 'border-slate-800' : 'border-slate-200'
                      }`}
                    >
                      <span className="text-xs font-bold text-slate-400">Pricing Profile Simulation</span>
                      <span className="text-xs font-bold text-emerald-600">Active</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Base Equipment Cost:</span>
                      <span className="font-bold">₹1,10,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Applied Margin (+20%):</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">+₹22,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Installation & Logistics:</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">+₹16,500</span>
                    </div>
                    <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between text-base font-black">
                      <span>Total Client Quote:</span>
                      <span className="text-blue-600 dark:text-blue-400">₹1,48,500</span>
                    </div>
                  </div>
                </div>
              )}

              {activeRoleTab === 'trader' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <span className="inline-flex items-center rounded-lg bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-300 mb-3">
                      Role: Wholesale Trader / Manufacturer
                    </span>
                    <h3 className="text-2xl font-display font-black tracking-tight mb-3">Expand Wholesale Distribution Across Verified Vendors</h3>
                    <p className={`text-sm font-sans mb-6 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Publish wholesale products, manage stock specifications, and expand commercial demand across all
                      registered vendors without handling retail customer inquiries directly.
                    </p>
                    <ul className={`space-y-3 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
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
                  <div
                    className={`rounded-2xl border p-6 space-y-3 ${
                      isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div
                      className={`flex items-center justify-between border-b pb-3 ${
                        isDark ? 'border-slate-800' : 'border-slate-200'
                      }`}
                    >
                      <span className="text-xs font-bold text-slate-400">Live Trader SKU Listing</span>
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400">Available</span>
                    </div>
                    <div
                      className={`p-3 rounded-xl border ${
                        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="font-bold text-sm">5kW Grid-Tie Solar Inverter</div>
                      <div className="text-xs text-slate-400">Wholesale Base: ₹48,000 / unit</div>
                    </div>
                    <div
                      className={`p-3 rounded-xl border ${
                        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="font-bold text-sm">450W Monocrystalline Panel</div>
                      <div className="text-xs text-slate-400">Wholesale Base: ₹14,500 / unit</div>
                    </div>
                  </div>
                </div>
              )}

              {activeRoleTab === 'team' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <span className="inline-flex items-center rounded-lg bg-purple-50 border border-purple-200 px-3 py-1 text-xs font-semibold text-purple-700 dark:bg-purple-950 dark:border-purple-800 dark:text-purple-300 mb-3">
                      Role: Sales Representative / Team Member
                    </span>
                    <h3 className="text-2xl font-display font-black tracking-tight mb-3">
                      Focus on Relationships While Prices Calculate Automatically
                    </h3>
                    <p className={`text-sm font-sans mb-6 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Team members invited by vendors can manage their assigned pipeline, add client inquiries, and generate
                      quotes utilizing the vendor's locked catalog and verified pricing rules.
                    </p>
                    <ul className={`space-y-3 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
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
                  <div
                    className={`rounded-2xl border p-6 space-y-3 ${
                      isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-400 mb-1">Assigned Pipeline Opportunities</div>
                    <div
                      className={`p-3 rounded-xl border flex items-center justify-between ${
                        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-sm">Riya Yadav</div>
                        <div className="text-xs text-slate-400">Commercial Rooftop 10kW</div>
                      </div>
                      <span className="rounded-full bg-purple-50 border border-purple-200 dark:bg-purple-950 dark:border-purple-800 px-2.5 py-0.5 text-xs font-bold text-purple-700 dark:text-purple-300">
                        Quoted
                      </span>
                    </div>
                    <div
                      className={`p-3 rounded-xl border flex items-center justify-between ${
                        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-sm">Apex Retailers</div>
                        <div className="text-xs text-slate-400">Warehouse Retrofit</div>
                      </div>
                      <span className="rounded-full bg-blue-50 border border-blue-200 dark:bg-blue-950 dark:border-blue-800 px-2.5 py-0.5 text-xs font-bold text-blue-700 dark:text-blue-300">
                        New
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeRoleTab === 'admin' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <span className="inline-flex items-center rounded-lg bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 px-3 py-1 text-xs font-semibold mb-3">
                      Role: Platform Administrator
                    </span>
                    <h3 className="text-2xl font-display font-black tracking-tight mb-3">Total System Visibility & Financial Governance</h3>
                    <p className={`text-sm font-sans mb-6 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Admins enjoy complete audit access to monitor platform user growth, track overall pipeline revenue,
                      and inspect quoting profit margins across all registered companies.
                    </p>
                    <ul className={`space-y-3 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
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
                  <div
                    className={`rounded-2xl border p-6 space-y-3 ${
                      isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-400 mb-1">Admin Aggregate Telemetry</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div
                        className={`p-3 rounded-xl border ${
                          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="text-xs text-slate-400 font-bold">Total Users</div>
                        <div className="text-xl font-black">1,248</div>
                      </div>
                      <div
                        className={`p-3 rounded-xl border ${
                          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="text-xs text-slate-400 font-bold">Pipeline Value</div>
                        <div className="text-xl font-black text-blue-600 dark:text-blue-400">₹14.2 Cr</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ────────────────── METRICS & PERFORMANCE BANNER ────────────────── */}
        <section
          id="metrics"
          className={`py-20 border-y transition-colors ${
            isDark ? 'bg-[#060a12] border-slate-800 text-white' : 'bg-slate-900 border-slate-900 text-white'
          }`}
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="text-xs font-semibold tracking-widest uppercase text-blue-400 mb-2">
                Platform Impact
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
              <div className="pt-4 md:pt-0">
                <div className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tabular-nums tracking-tight text-blue-400 mb-1.5">
                  3.8x
                </div>
                <div className="text-xs sm:text-sm font-sans font-medium text-slate-300">
                  Faster Quote Turnaround
                </div>
              </div>

              <div className="pt-4 md:pt-0">
                <div className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tabular-nums tracking-tight text-blue-400 mb-1.5">
                  ₹18.5 Cr+
                </div>
                <div className="text-xs sm:text-sm font-sans font-medium text-slate-300">
                  Total Quoted Value
                </div>
              </div>

              <div className="pt-4 md:pt-0">
                <div className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tabular-nums tracking-tight text-blue-400 mb-1.5">
                  99.98%
                </div>
                <div className="text-xs sm:text-sm font-sans font-medium text-slate-300">
                  Uptime Reliability SLA
                </div>
              </div>

              <div className="pt-4 md:pt-0">
                <div className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tabular-nums tracking-tight text-blue-400 mb-1.5">
                  100%
                </div>
                <div className="text-xs sm:text-sm font-sans font-medium text-slate-300">
                  Confidential Margin Protection
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ────────────────── CONVERSION CTA BANNER ────────────────── */}
        <section
          className={`py-24 transition-colors ${
            isDark ? 'bg-[#090d16]' : 'bg-white'
          }`}
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div
              className={`relative overflow-hidden rounded-3xl border px-8 py-16 sm:p-20 text-center shadow-xl ${
                isDark
                  ? 'bg-slate-900 border-slate-800 text-white'
                  : 'bg-slate-900 border-slate-900 text-white'
              }`}
            >
              <p className="relative text-xs font-semibold tracking-widest uppercase text-blue-400 mb-3">
                Enterprise Onboarding
              </p>
              <h2 className="relative text-3xl sm:text-5xl font-display font-black tracking-tight max-w-3xl mx-auto leading-[1.1]">
                Ready to Accelerate Your B2B Distribution & Quoting?
              </h2>

              <p className="relative mt-4 text-base sm:text-lg font-sans leading-relaxed text-slate-300 max-w-2xl mx-auto">
                Join hundreds of forward-thinking suppliers and vendors using LeadMS to lock catalog goods, automate
                complex pricing math, and convert leads into closed deals.
              </p>

              <div className="relative mt-8 flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/register"
                  className="rounded-xl bg-blue-600 hover:bg-blue-500 px-8 py-4 text-base font-display font-semibold tracking-tight text-white shadow-sm transition-all cursor-pointer"
                >
                  Create Your Free Account
                </Link>
                <Link
                  to="/login"
                  className="rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 px-8 py-4 text-base font-display font-semibold tracking-tight text-white backdrop-blur-sm transition-all cursor-pointer"
                >
                  Sign In to Workspace
                </Link>
              </div>

              <div className="relative mt-6 text-xs font-sans text-slate-400">
                Immediate access • No credit card required • Instant Team Onboarding
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ────────────────── ENTERPRISE FOOTER ────────────────── */}
      <footer
        className={`border-t py-16 transition-colors ${
          isDark
            ? 'bg-[#060a12] border-slate-800 text-slate-400'
            : 'bg-slate-50 border-slate-200 text-slate-600'
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            {/* Col 1 */}
            <div className="col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <img
                  src="/leadms_logo.jpg"
                  alt="LeadMS"
                  className="h-8 w-8 rounded-lg object-cover shadow-2xs border border-slate-200"
                />
                <span className="text-lg font-display font-black tracking-tight">
                  Lead<span className="text-blue-600">MS</span>
                </span>
              </div>
              <p className="text-xs font-sans max-w-sm leading-relaxed text-slate-500">
                The role-based B2B sales management and quotation engine designed for wholesale distribution,
                equipment traders, and commercial contracting teams.
              </p>
              <div className="text-xs font-sans text-slate-400">
                Enterprise B2B Distribution & Quoting Platform.
              </div>
            </div>

            {/* Col 2 */}
            <div>
              <h5 className="text-xs font-display font-bold uppercase tracking-wider mb-3 text-slate-900 dark:text-slate-200">
                Product
              </h5>
              <ul className="space-y-2 text-xs font-sans">
                <li>
                  <a href="#simulator" className="hover:text-blue-600 transition-colors">
                    Quote Calculator
                  </a>
                </li>
                <li>
                  <a href="#mechanism" className="hover:text-blue-600 transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#collaboration" className="hover:text-blue-600 transition-colors">
                    Wholesale Bridge
                  </a>
                </li>
                <li>
                  <a href="#roles" className="hover:text-blue-600 transition-colors">
                    Role Portals
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <h5 className="text-xs font-display font-bold uppercase tracking-wider mb-3 text-slate-900 dark:text-slate-200">
                Role Portals
              </h5>
              <ul className="space-y-2 text-xs font-sans">
                <li>
                  <a href="#roles" className="hover:text-blue-600 transition-colors">
                    Vendors & Installers
                  </a>
                </li>
                <li>
                  <a href="#roles" className="hover:text-blue-600 transition-colors">
                    Wholesale Traders
                  </a>
                </li>
                <li>
                  <a href="#roles" className="hover:text-blue-600 transition-colors">
                    Sales Representatives
                  </a>
                </li>
                <li>
                  <a href="#roles" className="hover:text-blue-600 transition-colors">
                    Platform Admins
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4 */}
            <div>
              <h5 className="text-xs font-display font-bold uppercase tracking-wider mb-3 text-slate-900 dark:text-slate-200">
                Security & Governance
              </h5>
              <ul className="space-y-2 text-xs font-sans text-slate-400">
                <li>Role-Based Access Control (RBAC)</li>
                <li>Confidential Margin Protection</li>
                <li>Private Catalog Security</li>
                <li>Audit Logs & Compliance</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>&copy; {new Date().getFullYear()} LeadMS Inc. All rights reserved.</div>
            <div className="flex gap-6">
              <span className="hover:text-slate-700 dark:hover:text-slate-300">Privacy Policy</span>
              <span className="hover:text-slate-700 dark:hover:text-slate-300">Terms of Service</span>
              <span className="hover:text-slate-700 dark:hover:text-slate-300">Security Audit</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage

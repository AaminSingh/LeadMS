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
  Copy,
  CheckCheck,
  Server,
  Database,
  Cpu,
  Mail,
  RefreshCw,
  Code2,
  Network,
  Workflow,
  Sliders,
  FileCode,
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

// Architecture nodes metadata
const ARCHITECTURE_NODES = [
  {
    id: 'frontend',
    name: 'React 19 SPA & Zustand',
    tag: 'Client Layer',
    icon: Cpu,
    color: 'text-blue-600 border-blue-200 bg-blue-50 dark:text-blue-400 dark:border-blue-900 dark:bg-blue-950/40',
    dotColor: 'bg-blue-500',
    latency: '12ms client render',
    protocol: 'Virtual DOM + Stores',
    description:
      'High-performance React 19 UI state orchestrated by Zustand with persistent credentials and optimistic quoting updates.',
    codeRef: 'src/store/useAuthStore.js',
  },
  {
    id: 'interceptor',
    name: 'Axios Interceptors',
    tag: 'Network Gateway',
    icon: Network,
    color: 'text-indigo-600 border-indigo-200 bg-indigo-50 dark:text-indigo-400 dark:border-indigo-900 dark:bg-indigo-950/40',
    dotColor: 'bg-indigo-500',
    latency: '< 25ms roundtrip',
    protocol: 'Bearer Auth & Refresh',
    description:
      'Injects Bearer JWT on every API request and performs silent refresh token rotation on 401 errors without session disruption.',
    codeRef: 'src/services/apiClient.js',
  },
  {
    id: 'backend',
    name: 'Express v5 API Gateway',
    tag: 'Backend Core',
    icon: Server,
    color: 'text-slate-700 border-slate-200 bg-slate-100 dark:text-slate-300 dark:border-slate-800 dark:bg-slate-900/60',
    dotColor: 'bg-slate-500',
    latency: '< 30ms execution',
    protocol: 'REST / Middleware Chain',
    description:
      'Express v5 router with centralized error handling, input validation, and asynchronous quote calculation controllers.',
    codeRef: 'leadms-backend/src/routes/leadRoutes.js',
  },
  {
    id: 'jwt',
    name: 'JWT Auth & Role Guard',
    tag: 'Security Layer',
    icon: ShieldCheck,
    color: 'text-purple-600 border-purple-200 bg-purple-50 dark:text-purple-400 dark:border-purple-900 dark:bg-purple-950/40',
    dotColor: 'bg-purple-500',
    latency: '< 4ms signature verify',
    protocol: 'HMAC SHA-256 JWT',
    description:
      'Enforces strict multi-tenant boundaries between Vendors, Wholesale Traders, and Sales Representatives with role-specific route gates.',
    codeRef: 'leadms-backend/src/middleware/authMiddleware.js',
  },
  {
    id: 'database',
    name: 'MongoDB Atlas & Mongoose',
    tag: 'Persistence Layer',
    icon: Database,
    color: 'text-emerald-600 border-emerald-200 bg-emerald-50 dark:text-emerald-400 dark:border-emerald-900 dark:bg-emerald-950/40',
    dotColor: 'bg-emerald-500',
    latency: '< 18ms query time',
    protocol: 'Mongoose ODM / Mongo Wire',
    description:
      'Atomic $addToSet & $pull locking logic for private vendor catalogs with isolated collections for Users, Products, and Leads.',
    codeRef: 'leadms-backend/src/models/Product.js',
  },
  {
    id: 'services',
    name: 'Nodemailer & PDF Dispatch',
    tag: 'Async Services',
    icon: Mail,
    color: 'text-amber-600 border-amber-200 bg-amber-50 dark:text-amber-400 dark:border-amber-900 dark:bg-amber-950/40',
    dotColor: 'bg-amber-500',
    latency: '< 120ms queue dispatch',
    protocol: 'SMTP / RFC 5322',
    description:
      'Automated transmission of itemized Indian Rupee quotation summaries directly to prospective leads upon quote approval.',
    codeRef: 'leadms-backend/src/services/emailService.js',
  },
]

// Real code snippets for the Code Integration Preview
const CODE_SNIPPETS = {
  quoteController: {
    filename: 'leadController.js',
    path: 'leadms-backend/src/controllers/leadController.js',
    lang: 'javascript',
    code: `// Express v5 Quote Calculation Engine
export const generateQuote = async (req, res, next) => {
  try {
    const { products } = req.body; // Array of { productId, quantity }
    const lead = await Lead.findOne({ _id: req.params.id });
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    // Enforce role isolation: verify vendor or assigned team member
    if (req.user.role === 'vendor' && lead.vendorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized vendor access' });
    }

    const vendorProfile = await VendorProfile.findOne({ vendorId: lead.vendorId });
    let baseTotal = 0;
    const selectedProducts = [];

    for (let item of products) {
      const product = await Product.findById(item.productId);
      if (product && product.isActive) {
        const itemTotal = product.basePrice * (item.quantity || 1);
        baseTotal += itemTotal;
        selectedProducts.push({
          productId: product._id,
          quantity: item.quantity || 1,
          priceAtQuote: product.basePrice
        });
      }
    }

    // Dynamic Indian Rupee margins & operational fees
    const marginApplied = baseTotal * (vendorProfile.marginPercentage / 100);
    const finalTotal = baseTotal + marginApplied + 
      vendorProfile.installationPrice + vendorProfile.miscCharges;

    lead.quote = { selectedProducts, baseTotal, marginApplied, finalTotal };
    lead.status = 'quoted';
    await lead.save();

    res.status(200).json(lead);
  } catch (error) {
    next(error);
  }
};`,
  },
  apiClient: {
    filename: 'apiClient.js',
    path: 'src/services/apiClient.js',
    lang: 'javascript',
    code: `// React 19 Axios Interceptors with Silent JWT Refresh
import axios from 'axios';
import useAuthStore from '../store/useAuthStore';

const apiClient = axios.create({
  baseURL: 'https://leadms.onrender.com/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach Bearer token on every outgoing request
apiClient.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken) {
    config.headers.Authorization = \`Bearer \${accessToken}\`;
  }
  return config;
});

// Handle 401s with silent token rotation
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = useAuthStore.getState().refreshToken;
      if (refreshToken) {
        const { data } = await axios.post('/auth/refresh-token', { refreshToken });
        useAuthStore.getState().setCredentials({ accessToken: data.accessToken });
        originalRequest.headers.Authorization = \`Bearer \${data.accessToken}\`;
        return apiClient(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);`,
  },
  leadModel: {
    filename: 'Lead.js',
    path: 'leadms-backend/src/models/Lead.js',
    lang: 'javascript',
    code: `// MongoDB Mongoose Schema with Embedded Quote Document
const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    status: {
      type: String,
      enum: ['new', 'contacted', 'quoted', 'accepted', 'rejected'],
      default: 'new'
    },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    quote: {
      selectedProducts: [
        {
          productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
          quantity: Number,
          priceAtQuote: Number
        }
      ],
      baseTotal: Number,
      marginApplied: Number,
      installationPrice: Number,
      miscCharges: Number,
      finalTotal: Number
    }
  },
  { timestamps: true }
);`,
  },
}

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
  }

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

  // Feature 4: Interactive Architecture Map State
  const [activeArchNode, setActiveArchNode] = useState(ARCHITECTURE_NODES[0])

  // Feature 5: Code Integration Preview Tab State
  const [activeCodeTab, setActiveCodeTab] = useState('quoteController')
  const [copiedCode, setCopiedCode] = useState(false)

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

  const handleCopyCode = () => {
    navigator.clipboard.writeText(CODE_SNIPPETS[activeCodeTab].code)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
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
              <span className="text-xl font-black tracking-tight leading-tight">
                Lead<span className="text-blue-600">MS</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 -mt-0.5">
                Enterprise CRM
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            className={`hidden md:flex items-center gap-8 text-sm font-semibold ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            <a href="#simulator" className="hover:text-blue-600 transition-colors">
              Quote Simulator
            </a>
            <a href="#mechanism" className="hover:text-blue-600 transition-colors">
              B2B Mechanism
            </a>
            <a href="#architecture" className="hover:text-blue-600 transition-colors">
              Architecture Map
            </a>
            <a href="#code" className="hover:text-blue-600 transition-colors">
              API & Code
            </a>
            <a href="#roles" className="hover:text-blue-600 transition-colors">
              Roles
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
                className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all cursor-pointer shadow-sm ${
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
                  className={`hidden sm:inline-block rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors ${
                    isDark
                      ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className={`inline-flex items-center gap-1.5 rounded-xl px-4.5 py-2.5 text-sm font-semibold transition-all cursor-pointer shadow-sm ${
                    isDark
                      ? 'bg-blue-600 hover:bg-blue-500 text-white'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  Start Free Trial <ChevronRight size={15} />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
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
                <div
                  className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-semibold transition-colors ${
                    isDark
                      ? 'bg-blue-950/60 border border-blue-800/60 text-blue-300'
                      : 'bg-blue-50 border border-blue-200 text-blue-700'
                  }`}
                >
                  <Sparkles size={13} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
                  <span>Enterprise B2B Distribution & Quoting</span>
                </div>

                {/* Main Headline */}
                <h1
                  className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  Connect Traders, Lock Catalogs, &{' '}
                  <span className={isDark ? 'text-blue-400' : 'text-blue-600'}>
                    Automate Commercial Deals
                  </span>
                </h1>

                <p
                  className={`text-base sm:text-lg leading-relaxed max-w-xl ${
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
                    className={`inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-base font-semibold shadow-sm transition-all hover:shadow hover:-translate-y-0.5 cursor-pointer ${
                      isDark
                        ? 'bg-white text-slate-950 hover:bg-slate-100'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    Start Free Trial <ArrowRight size={17} />
                  </Link>
                  <a
                    href="#simulator"
                    className={`inline-flex items-center justify-center gap-2 rounded-xl border px-6 py-3.5 text-base font-medium shadow-2xs transition-all ${
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
              <div className="lg:col-span-6 relative z-10 w-full">
                <div className="relative mx-auto max-w-lg lg:max-w-none group">
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
                    className={`absolute -bottom-6 -left-6 hidden sm:flex items-center gap-3.5 rounded-2xl border p-4 shadow-xl backdrop-blur-md ${
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
                      <div className="text-xs font-bold">Product Locked</div>
                      <div className="text-[10px] text-blue-600 dark:text-blue-400 font-mono">
                        Atomic $addToSet
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
              <div
                className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-semibold mb-3 ${
                  isDark
                    ? 'bg-blue-950/60 border border-blue-800/60 text-blue-300'
                    : 'bg-blue-50 border border-blue-200 text-blue-700'
                }`}
              >
                <Calculator size={13} />
                <span>Feature 1: Interactive Quoting Engine</span>
              </div>
              <h2
                className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                Modern 3-Column Bento Architecture
              </h2>
              <p
                className={`mt-4 text-base sm:text-lg ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                Experience the real math engine powering LeadMS. Adjust quantities, slide vendor margins, and watch
                subtotals and final totals recalculate live in Indian Rupees (₹).
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
                        <h3 className="text-xl font-bold flex items-center gap-2">
                          Live Quote Calculator Widget
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800">
                            Real-Time Math
                          </span>
                        </h3>
                        <p className="text-xs text-slate-500">
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
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300'
                            : isDark
                            ? 'bg-slate-900 border-slate-800 text-slate-400'
                            : 'bg-white border-slate-200 text-slate-500'
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

                    <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 dark:bg-blue-950/40 dark:border-blue-900">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
                        Final Client Total
                      </div>
                      <div className="text-base font-black text-blue-700 dark:text-blue-300 font-mono">
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
                      className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                        quoteDispatched
                          ? 'bg-emerald-600 text-white'
                          : isDark
                          ? 'bg-blue-600 hover:bg-blue-500 text-white'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
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

              {/* ── BENTO BLOCK 2 (Col 3 Top, Span 4): ATOMIC CATALOG LOCKING ENGINE ── */}
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
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800">
                      Atomic $addToSet
                    </span>
                  </div>

                  <h3 className="text-lg font-bold mb-2">Atomic Catalog Locking</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-5">
                    Vendors lock wholesale supplier inventory into private catalogs with atomic MongoDB operations,
                    shielding raw wholesale prices from retail leads.
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
                      className={`w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all border ${
                        isDemoProductLocked
                          ? isDark
                            ? 'bg-rose-950/30 border-rose-900 text-rose-300 hover:bg-rose-900/40'
                            : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                          : isDark
                          ? 'bg-blue-600 text-white hover:bg-blue-500 border-blue-500'
                          : 'bg-slate-900 text-white hover:bg-slate-800 border-slate-800'
                      }`}
                    >
                      {isDemoProductLocked ? (
                        <>
                          <Unlock size={14} /> Unlock From My Catalog
                        </>
                      ) : (
                        <>
                          <Lock size={14} /> Lock to My Catalog ($addToSet)
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 text-[11px] text-slate-400">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span>Zero double-allocation across vendor teams.</span>
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
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800">
                      Field Redaction
                    </span>
                  </div>

                  <h3 className="text-lg font-bold mb-2">Zero Margin Leakage</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
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
                  <Check size={14} /> Strict JWT role filtering in Mongoose projections.
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
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800">
                      Pipeline Velocity
                    </span>
                  </div>

                  <h3 className="text-lg font-bold mb-2">Automated Stage Transitions</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    Leads automatically graduate from <span className="font-mono text-blue-600 font-bold">new</span> to{' '}
                    <span className="font-mono text-emerald-600 font-bold">quoted</span> upon PDF generation, updating the
                    team funnel in real time.
                  </p>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div
                      className={`p-2 rounded-xl border ${
                        isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200/80'
                      }`}
                    >
                      <div className="text-[10px] text-slate-400">New</div>
                      <div className="font-bold text-sm">142</div>
                    </div>
                    <div className="p-2 rounded-xl bg-blue-50 border border-blue-200 dark:bg-blue-950/40 dark:border-blue-900">
                      <div className="text-[10px] text-blue-600 dark:text-blue-400">Quoted</div>
                      <div className="font-bold text-blue-700 dark:text-blue-300 text-sm">88</div>
                    </div>
                    <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-900">
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400">Won</div>
                      <div className="font-bold text-emerald-700 dark:text-emerald-300 text-sm">54</div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Avg Turnaround:</span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold font-mono">2.4 mins vs 48 hrs</span>
                </div>
              </div>

              {/* ── BENTO BLOCK 5 (Col 3 on Bottom Row, Span 4): AUDIT & EXPORT ── */}
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
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800">
                      Nodemailer SMTP
                    </span>
                  </div>

                  <h3 className="text-lg font-bold mb-2">Automated Dispatch Queue</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    Clean transactional email templates dispatch branded Indian Rupee quotations to customers with one
                    click, logging delivery receipts directly into the audit trail.
                  </p>

                  <div
                    className={`p-3 rounded-xl border text-xs font-mono space-y-1 ${
                      isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200/80'
                    }`}
                  >
                    <div className="text-[10px] text-slate-400">POST /api/leads/:id/quote</div>
                    <div className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      ✓ 200 OK — Proposal Sent via SMTP
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 text-[11px] text-slate-500">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span>Integrated with AWS SES, SendGrid & SMTP</span>
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
              <div
                className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-semibold mb-3 ${
                  isDark
                    ? 'bg-blue-950/60 border border-blue-800/60 text-blue-300'
                    : 'bg-blue-50 border border-blue-200 text-blue-700'
                }`}
              >
                <Workflow size={13} />
                <span>Feature 2: Product Orchestration Walkthrough</span>
              </div>
              <h2
                className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                How LeadMS Eliminates B2B Friction
              </h2>
              <p className={`mt-4 text-base sm:text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
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
                      <div className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            activeStep === item.step ? 'bg-blue-600' : 'bg-slate-400'
                          }`}
                        />
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-400 hidden sm:block mt-0.5">{item.sub}</div>

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
                      <h3 className="text-2xl sm:text-3xl font-black">Wholesale Trader Publishes Inventory</h3>
                      <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
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
                      <h3 className="text-2xl sm:text-3xl font-black">Vendor Locks Item & Binds Margins</h3>
                      <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
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
                      <h3 className="text-2xl sm:text-3xl font-black">Instant Itemized Quote & Dispatch</h3>
                      <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
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
                        <span>Nodemailer: Quote PDF Dispatched</span>
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
                  className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
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
                    onClick={() => handleManualStepChange((activeStep + 1) % 3)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    Next Stage <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ────────────────── 4. FEATURE 4: INTERACTIVE ARCHITECTURE FLOW MAP ────────────────── */}
        <section
          id="architecture"
          className={`relative py-24 border-t transition-colors ${
            isDark ? 'bg-[#0c101a] border-slate-800/80 text-slate-100' : 'bg-slate-50/70 border-slate-200 text-slate-900'
          }`}
        >
          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div
                className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-semibold mb-3 ${
                  isDark
                    ? 'bg-blue-950/60 border border-blue-800/60 text-blue-300'
                    : 'bg-blue-50 border border-blue-200 text-blue-700'
                }`}
              >
                <Network size={13} />
                <span>Feature 4: Full-Stack Architecture Topology</span>
              </div>
              <h2
                className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                Interactive Architecture Flow Map
              </h2>
              <p className={`mt-4 text-base sm:text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Inspect how the React 19 SPA communicates with Express v5 through Axios interceptors, verifies JWT
                claims, and operates atomically on MongoDB collections.
              </p>
            </div>

            {/* INTERACTIVE NODE-AND-EDGE TOPOLOGY CANVAS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Visual Node Network Graph */}
              <div
                className={`lg:col-span-8 rounded-3xl border p-6 sm:p-8 shadow-sm ${
                  isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/90'
                }`}
              >
                <div
                  className={`flex items-center justify-between border-b pb-4 mb-6 ${
                    isDark ? 'border-slate-800' : 'border-slate-100'
                  }`}
                >
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                    Interactive Topology: Click any node to inspect telemetry
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800">
                    Active: {activeArchNode.name}
                  </span>
                </div>

                {/* Nodes Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 relative">
                  {ARCHITECTURE_NODES.map((node) => {
                    const Icon = node.icon
                    const isSelected = activeArchNode.id === node.id

                    return (
                      <button
                        key={node.id}
                        onClick={() => setActiveArchNode(node)}
                        className={`text-left p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                          isSelected
                            ? isDark
                              ? 'bg-slate-800 border-blue-500 shadow-md scale-[1.02]'
                              : 'bg-blue-50/50 border-blue-400 shadow-sm scale-[1.02]'
                            : isDark
                            ? 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div
                            className={`h-10 w-10 rounded-xl flex items-center justify-center border ${node.color}`}
                          >
                            <Icon size={20} />
                          </div>
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${node.dotColor} ${
                              isSelected ? 'animate-ping' : ''
                            }`}
                          />
                        </div>

                        <div className="text-xs font-mono font-bold text-slate-400 mb-1 uppercase tracking-wider">
                          {node.tag}
                        </div>
                        <div className="text-sm font-black group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {node.name}
                        </div>

                        <div
                          className={`mt-3 pt-3 border-t flex items-center justify-between text-[10px] font-mono ${
                            isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'
                          }`}
                        >
                          <span>{node.latency}</span>
                          <span className="text-blue-600 dark:text-blue-400 font-bold group-hover:underline">
                            Inspect &rarr;
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Data Pipeline Flow Graphic */}
                <div
                  className={`mt-8 p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono ${
                    isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200/80'
                  }`}
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-slate-400 font-sans">Pipeline:</span>
                    <span className="font-bold">Browser</span>
                    <span className="text-slate-400">&rarr;</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">Axios</span>
                    <span className="text-slate-400">&rarr;</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">Express v5</span>
                    <span className="text-slate-400">&rarr;</span>
                    <span className="font-bold text-purple-600 dark:text-purple-400">JWT Guard</span>
                    <span className="text-slate-400">&rarr;</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">MongoDB</span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-400 px-2.5 py-1 rounded-lg">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    TLS 1.3 / Sub-50ms
                  </div>
                </div>
              </div>

              {/* Right Column: Active Node Telemetry Inspector */}
              <div
                className={`lg:col-span-4 rounded-3xl border p-6 sm:p-7 shadow-sm ${
                  isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/90'
                }`}
              >
                <div
                  className={`flex items-center justify-between border-b pb-4 mb-5 ${
                    isDark ? 'border-slate-800' : 'border-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-8 w-8 rounded-lg flex items-center justify-center border ${activeArchNode.color}`}
                    >
                      <activeArchNode.icon size={16} />
                    </div>
                    <div>
                      <div className="text-xs font-bold">{activeArchNode.name}</div>
                      <div className="text-[10px] text-slate-400">{activeArchNode.tag}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800 px-2 py-0.5 rounded-full">
                    HEALTHY
                  </span>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Component Function
                    </div>
                    <p
                      className={`leading-relaxed p-3 rounded-xl border ${
                        isDark ? 'bg-slate-950/70 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200/80 text-slate-700'
                      }`}
                    >
                      {activeArchNode.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 font-mono">
                    <div
                      className={`p-3 rounded-xl border ${
                        isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200/80'
                      }`}
                    >
                      <div className="text-[10px] text-slate-400">Latency</div>
                      <div className="font-bold text-xs mt-0.5 text-blue-600 dark:text-blue-400">
                        {activeArchNode.latency}
                      </div>
                    </div>
                    <div
                      className={`p-3 rounded-xl border ${
                        isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200/80'
                      }`}
                    >
                      <div className="text-[10px] text-slate-400">Protocol Spec</div>
                      <div className="font-bold text-xs mt-0.5 text-emerald-600 dark:text-emerald-400">
                        {activeArchNode.protocol}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Source Implementation File
                    </div>
                    <div
                      className={`p-2.5 rounded-xl border font-mono text-[11px] flex items-center gap-1.5 ${
                        isDark ? 'bg-slate-950 border-slate-800 text-blue-400' : 'bg-slate-50 border-slate-200 text-blue-700'
                      }`}
                    >
                      <FileCode size={13} />
                      {activeArchNode.codeRef}
                    </div>
                  </div>
                </div>

                <div
                  className={`mt-6 pt-4 border-t flex items-center justify-between text-[11px] text-slate-400 ${
                    isDark ? 'border-slate-800' : 'border-slate-100'
                  }`}
                >
                  <span>Architecture SLA:</span>
                  <span className="font-bold font-mono">99.98% High Availability</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ────────────────── 5. FEATURE 5: CODE INTEGRATION PREVIEW SPLIT-SECTION ────────────────── */}
        <section
          id="code"
          className={`relative py-24 border-t transition-colors ${
            isDark ? 'bg-[#090d16] border-slate-800/80 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Enterprise Narrative */}
              <div className="lg:col-span-5 space-y-6">
                <div
                  className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-semibold ${
                    isDark
                      ? 'bg-blue-950/60 border border-blue-800/60 text-blue-300'
                      : 'bg-blue-50 border border-blue-200 text-blue-700'
                  }`}
                >
                  <Code2 size={13} />
                  <span>Feature 5: Production-Grade Codebase</span>
                </div>

                <h2
                  className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  Engineered with Enterprise Rigor, Not Fragile Sheets
                </h2>

                <p className={`text-base leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Every quote calculation, catalog lock, and role boundary is strictly validated through verified
                  Express v5 controllers and Mongoose schemas. Inspect real production code snippets right in your
                  browser.
                </p>

                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                      <Lock size={17} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">Atomic Concurrency Safety</h4>
                      <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        MongoDB <code className="font-semibold text-blue-600 dark:text-blue-400">$addToSet</code> ensures
                        product locks cannot collide or overwrite during simultaneous updates.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900">
                      <RefreshCw size={17} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">Silent Dual-Token Rotation</h4>
                      <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Short-lived 15m access tokens paired with secure 7d refresh tokens prevent session timeouts
                        during lengthy proposal authoring.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
                      <IndianRupee size={17} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">Zero-Rounding Math Engine</h4>
                      <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Dynamic Indian Rupee formulas compute margins, certified labor charges, and logistics with
                        deterministic decimal accuracy.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 flex items-center gap-4">
                  <Link
                    to={isAuthenticated ? '/app/leads' : '/register'}
                    className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold shadow-sm transition-all cursor-pointer ${
                      isDark
                        ? 'bg-blue-600 hover:bg-blue-500 text-white'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    Deploy Your Workspace <ArrowRight size={15} />
                  </Link>
                </div>
              </div>

              {/* Right Column: Dark Syntax-Highlighted Code Editor Window */}
              <div className="lg:col-span-7">
                <div className="rounded-2xl border border-slate-800 bg-[#0c1017] shadow-2xl overflow-hidden text-slate-100">
                  {/* Mac OS Window Header with File Tabs */}
                  <div className="flex flex-wrap items-center justify-between border-b border-slate-800 bg-[#080c12] px-4 py-2.5">
                    {/* Window Control Dots */}
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <div className="h-3 w-3 rounded-full bg-rose-500" />
                        <div className="h-3 w-3 rounded-full bg-amber-500" />
                        <div className="h-3 w-3 rounded-full bg-emerald-500" />
                      </div>

                      {/* File Tabs */}
                      <div className="flex gap-1">
                        {[
                          { id: 'quoteController', label: 'leadController.js' },
                          { id: 'apiClient', label: 'apiClient.js' },
                          { id: 'leadModel', label: 'Lead.js' },
                        ].map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => setActiveCodeTab(tab.id)}
                            className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                              activeCodeTab === tab.id
                                ? 'bg-slate-800 text-blue-400 font-bold border border-slate-700'
                                : 'text-slate-400 hover:text-white hover:bg-slate-900'
                            }`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Copy Code Button */}
                    <button
                      onClick={handleCopyCode}
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition-colors cursor-pointer bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800"
                      title="Copy code snippet"
                    >
                      {copiedCode ? (
                        <>
                          <CheckCheck size={13} className="text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Code Content Block */}
                  <div className="p-4 sm:p-6 bg-[#0c1017] font-mono text-xs overflow-x-auto code-scroll max-h-[460px]">
                    <div className="text-[11px] text-slate-500 mb-3 border-b border-slate-800/80 pb-2 flex items-center justify-between">
                      <span>{CODE_SNIPPETS[activeCodeTab].path}</span>
                      <span className="text-slate-400 uppercase">{CODE_SNIPPETS[activeCodeTab].lang}</span>
                    </div>

                    <pre className="text-slate-300 leading-relaxed font-mono">
                      <code>{CODE_SNIPPETS[activeCodeTab].code}</code>
                    </pre>
                  </div>

                  {/* Footer Bar of Code Window */}
                  <div className="border-t border-slate-800 bg-[#080c12] px-4 py-2 flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <div className="flex items-center gap-3">
                      <span>UTF-8</span>
                      <span>JavaScript ES2024</span>
                      <span>Node v20.x</span>
                    </div>
                    <span className="text-emerald-400">Lint: 0 Errors</span>
                  </div>
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
                      <div className="text-sm font-extrabold">Wholesale Trader ↔ Local Vendor Alignment</div>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-400">
                      Zero Friction
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Content Side */}
              <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
                <div
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold ${
                    isDark
                      ? 'bg-blue-950/60 border border-blue-800/60 text-blue-300'
                      : 'bg-blue-50 border border-blue-200 text-blue-700'
                  }`}
                >
                  <Zap size={13} /> Bridge The Wholesale Gap
                </div>

                <h2
                  className={`text-3xl sm:text-4xl font-black tracking-tight leading-tight ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  Stop Juggling Messy Spreadsheets & Fragmented Price Lists
                </h2>

                <p className={`text-base leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Traditional B2B distribution suffers from slow pricing updates, leaked margins, and delayed customer
                  proposals. LeadMS creates a secure digital bridge where wholesale suppliers publish live product
                  inventories and distributors instantly configure custom margins to quote their clients.
                </p>

                <div className="space-y-4 pt-2">
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400 font-bold border border-blue-200 dark:border-blue-900">
                      1
                    </div>
                    <div>
                      <h4 className="font-bold text-base">Atomic Product Locking</h4>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Vendors claim exclusive supplier items into their active sales catalog with one click.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 font-bold border border-indigo-200 dark:border-indigo-900">
                      2
                    </div>
                    <div>
                      <h4 className="font-bold text-base">Configurable Pricing Profiles</h4>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Pre-set your vendor margin %, flat installation rates, and miscellaneous charges.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400 font-bold border border-purple-200 dark:border-purple-900">
                      3
                    </div>
                    <div>
                      <h4 className="font-bold text-base">Real-Time Quoting Engine</h4>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
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
              <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2">
                Multi-Tenant Governance
              </h2>
              <p
                className={`text-3xl sm:text-4xl font-black tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                Tailored for Every Stakeholder
              </p>
              <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Select a role below to see tailored tools and capabilities.
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
                    className={`rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
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
                    <h3 className="text-2xl font-black mb-3">Control Your Margins & Build Rapid Proposals</h3>
                    <p className={`text-sm mb-6 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
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
                    <h3 className="text-2xl font-black mb-3">Expand Wholesale Distribution Across Verified Vendors</h3>
                    <p className={`text-sm mb-6 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
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
                    <h3 className="text-2xl font-black mb-3">
                      Focus on Relationships While Prices Calculate Automatically
                    </h3>
                    <p className={`text-sm mb-6 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
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
                    <h3 className="text-2xl font-black mb-3">Total System Visibility & Financial Governance</h3>
                    <p className={`text-sm mb-6 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
              <div className="pt-4 md:pt-0">
                <div className="text-4xl sm:text-5xl font-black tracking-tight text-blue-400 mb-1">3.8x</div>
                <div className="text-xs sm:text-sm font-medium text-slate-300">Faster Quote Turnaround</div>
              </div>

              <div className="pt-4 md:pt-0">
                <div className="text-4xl sm:text-5xl font-black tracking-tight text-blue-400 mb-1">₹18.5 Cr+</div>
                <div className="text-xs sm:text-sm font-medium text-slate-300">Total Quoted Value</div>
              </div>

              <div className="pt-4 md:pt-0">
                <div className="text-4xl sm:text-5xl font-black tracking-tight text-blue-400 mb-1">99.98%</div>
                <div className="text-xs sm:text-sm font-medium text-slate-300">Uptime Reliability SLA</div>
              </div>

              <div className="pt-4 md:pt-0">
                <div className="text-4xl sm:text-5xl font-black tracking-tight text-blue-400 mb-1">100%</div>
                <div className="text-xs sm:text-sm font-medium text-slate-300">Role Data Isolation</div>
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
              <h2 className="relative text-3xl sm:text-5xl font-black tracking-tight max-w-3xl mx-auto">
                Ready to Accelerate Your B2B Distribution & Quoting?
              </h2>

              <p className="relative mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
                Join hundreds of forward-thinking suppliers and vendors using LeadMS to lock catalog goods, automate
                complex pricing math, and convert leads into closed deals.
              </p>

              <div className="relative mt-8 flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/register"
                  className="rounded-xl bg-blue-600 hover:bg-blue-500 px-8 py-4 text-base font-semibold text-white shadow-sm transition-all cursor-pointer"
                >
                  Create Your Free Account
                </Link>
                <Link
                  to="/login"
                  className="rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all cursor-pointer"
                >
                  Sign In to Workspace
                </Link>
              </div>

              <div className="relative mt-6 text-xs text-slate-400">
                Immediate access • No credit card required • Full REST API capability
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
                <span className="text-lg font-black tracking-tight">
                  Lead<span className="text-blue-600">MS</span>
                </span>
              </div>
              <p className="text-xs max-w-sm leading-relaxed text-slate-500">
                The role-based B2B sales management and quotation engine designed for wholesale distribution,
                equipment traders, and commercial contracting teams.
              </p>
              <div className="text-xs text-slate-400">
                Built with React 19, Tailwind CSS v4, Express v5 & MongoDB Atlas.
              </div>
            </div>

            {/* Col 2 */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider mb-3 text-slate-900 dark:text-slate-200">
                Product
              </h5>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="#simulator" className="hover:text-blue-600 transition-colors">
                    Quote Simulator
                  </a>
                </li>
                <li>
                  <a href="#mechanism" className="hover:text-blue-600 transition-colors">
                    B2B Mechanism
                  </a>
                </li>
                <li>
                  <a href="#architecture" className="hover:text-blue-600 transition-colors">
                    Architecture Map
                  </a>
                </li>
                <li>
                  <a href="#code" className="hover:text-blue-600 transition-colors">
                    Code Snippets
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider mb-3 text-slate-900 dark:text-slate-200">
                Role Portals
              </h5>
              <ul className="space-y-2 text-xs">
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
              <h5 className="text-xs font-bold uppercase tracking-wider mb-3 text-slate-900 dark:text-slate-200">
                Security & Compliance
              </h5>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>JWT Role Guarding</li>
                <li>Mongoose Projections</li>
                <li>Atomic Locking</li>
                <li>GDPR Compliant</li>
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

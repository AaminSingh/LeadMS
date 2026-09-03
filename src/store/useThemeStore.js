import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const THEMES = [
  {
    id: 'cyan',
    name: 'Ocean Cyan',
    description: 'Clean modern SaaS with vibrant cyan and teal accents',
    primary: '#0891b2', // cyan-600
    accent: '#0d9488',  // teal-600
    gradient: 'from-cyan-600 to-teal-600',
    hoverGradient: 'hover:from-cyan-500 hover:to-teal-500',
    ring: 'focus:ring-cyan-500/20',
    border: 'border-cyan-500',
    bgSubtle: 'bg-cyan-50',
    textPrimary: 'text-cyan-700',
    previewBadge: 'bg-cyan-100 text-cyan-800',
    swatch: ['#0891b2', '#0d9488', '#06b6d4'],
  },
  {
    id: 'indigo',
    name: 'Royal Indigo',
    description: 'Deep violet and indigo tailored for executive tech platforms',
    primary: '#4f46e5', // indigo-600
    accent: '#7c3aed',  // violet-600
    gradient: 'from-indigo-600 to-violet-600',
    hoverGradient: 'hover:from-indigo-500 hover:to-violet-500',
    ring: 'focus:ring-indigo-500/20',
    border: 'border-indigo-500',
    bgSubtle: 'bg-indigo-50',
    textPrimary: 'text-indigo-700',
    previewBadge: 'bg-indigo-100 text-indigo-800',
    swatch: ['#4f46e5', '#7c3aed', '#6366f1'],
  },
  {
    id: 'emerald',
    name: 'Emerald Growth',
    description: 'Fresh emerald and mint tailored for sales and growth metrics',
    primary: '#059669', // emerald-600
    accent: '#0d9488',  // teal-600
    gradient: 'from-emerald-600 to-teal-600',
    hoverGradient: 'hover:from-emerald-500 hover:to-teal-500',
    ring: 'focus:ring-emerald-500/20',
    border: 'border-emerald-500',
    bgSubtle: 'bg-emerald-50',
    textPrimary: 'text-emerald-700',
    previewBadge: 'bg-emerald-100 text-emerald-800',
    swatch: ['#059669', '#10b981', '#14b8a6'],
  },
  {
    id: 'sunset',
    name: 'Sunset Rose',
    description: 'Warm coral, amber, and rose gradients with energetic punch',
    primary: '#e11d48', // rose-600
    accent: '#ea580c',  // orange-600
    gradient: 'from-rose-600 to-amber-600',
    hoverGradient: 'hover:from-rose-500 hover:to-amber-500',
    ring: 'focus:ring-rose-500/20',
    border: 'border-rose-500',
    bgSubtle: 'bg-rose-50',
    textPrimary: 'text-rose-700',
    previewBadge: 'bg-rose-100 text-rose-800',
    swatch: ['#e11d48', '#ea580c', '#f43f5e'],
  },
  {
    id: 'midnight',
    name: 'Midnight Dark',
    description: 'Sleek high-contrast dark theme with glowing cyan highlights',
    primary: '#06b6d4', // cyan-500
    accent: '#38bdf8',  // sky-400
    gradient: 'from-slate-800 to-cyan-950',
    hoverGradient: 'hover:from-slate-700 hover:to-cyan-900',
    ring: 'focus:ring-cyan-400/30',
    border: 'border-cyan-400',
    bgSubtle: 'bg-slate-800',
    textPrimary: 'text-cyan-400',
    previewBadge: 'bg-cyan-950 text-cyan-300 border border-cyan-800',
    swatch: ['#0f172a', '#06b6d4', '#1e293b'],
  },
]

export const UI_SIZES = [
  {
    id: 'compact',
    name: 'Compact',
    badge: 'High Density',
    description: 'Higher information density with tighter padding, ideal for viewing large tables and dashboards.',
    spacingLabel: 'Tighter row height & smaller cards',
  },
  {
    id: 'comfortable',
    name: 'Comfortable',
    badge: 'Default',
    description: 'Standard balanced spacing with modern padding and clean visual breathing room.',
    spacingLabel: 'Balanced modern SaaS spacing',
  },
  {
    id: 'spacious',
    name: 'Spacious',
    badge: 'Relaxed',
    description: 'Expanded whitespace and larger click targets, perfect for presentations or touch devices.',
    spacingLabel: 'Generous padding & larger targets',
  },
]

export const applyThemeToDOM = (themeId, uiSizeId) => {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.setAttribute('data-theme', themeId || 'cyan')
  root.setAttribute('data-size', uiSizeId || 'comfortable')

  if (themeId === 'midnight') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'cyan',
      uiSize: 'comfortable',

      setTheme: (theme) => {
        set({ theme })
        applyThemeToDOM(theme, get().uiSize)
      },

      setUiSize: (uiSize) => {
        set({ uiSize })
        applyThemeToDOM(get().theme, uiSize)
      },

      resetToDefaults: () => {
        set({ theme: 'cyan', uiSize: 'comfortable' })
        applyThemeToDOM('cyan', 'comfortable')
      },
    }),
    {
      name: 'leadms-theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyThemeToDOM(state.theme || 'cyan', state.uiSize || 'comfortable')
        }
      },
    }
  )
)

export default useThemeStore

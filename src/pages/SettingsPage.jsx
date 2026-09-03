import { Check, Palette, Sliders, User, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import useThemeStore, { THEMES, UI_SIZES } from '../store/useThemeStore'
import useAuthStore from '../store/useAuthStore'

function SettingsPage() {
  const { theme, uiSize, setTheme, setUiSize, resetToDefaults } = useThemeStore()
  const user = useAuthStore((state) => state.user)

  const handleSelectTheme = (themeId) => {
    setTheme(themeId)
    const selected = THEMES.find((t) => t.id === themeId)
    toast.success(`Theme switched to ${selected?.name || themeId}!`)
  }

  const handleSelectUiSize = (sizeId) => {
    setUiSize(sizeId)
    const selected = UI_SIZES.find((s) => s.id === sizeId)
    toast.success(`UI size updated to ${selected?.name || sizeId}!`)
  }

  const handleReset = () => {
    resetToDefaults()
    toast.success('Settings reset to default values!')
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Sliders className="text-theme" size={26} />
            Settings & Customization
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Personalize your workspace color scheme, UI density, and interface experience.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <RotateCcw size={14} />
          Reset Defaults
        </button>
      </div>

      {/* ─── Section 1: Color Themes ─── */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
        <div className="mb-5 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-theme-subtle border border-theme text-theme shadow-2xs">
            <Palette size={18} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Color Themes</h2>
            <p className="text-xs text-gray-500">
              Select an aesthetic color palette for buttons, indicators, charts, and accents.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {THEMES.map((item) => {
            const isSelected = theme === item.id

            return (
              <div
                key={item.id}
                onClick={() => handleSelectTheme(item.id)}
                className={`relative flex flex-col justify-between rounded-2xl border p-5 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-2 ring-3 shadow-md ' + item.border + ' ' + item.ring + ' bg-gray-50/50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/40'
                }`}
              >
                <div>
                  {/* Color Swatch Dots */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      {item.swatch.map((color, i) => (
                        <span
                          key={i}
                          className="h-5 w-5 rounded-full border border-white/60 shadow-xs"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>

                    {isSelected && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-theme px-2.5 py-0.5 text-xs font-bold text-white shadow-2xs">
                        <Check size={12} strokeWidth={3} /> Active
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-gray-900">{item.name}</h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Preview gradient bar */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div className={`h-2.5 w-full rounded-full bg-gradient-to-r ${item.gradient}`} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ─── Section 2: UI Density & Sizing ─── */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
        <div className="mb-5 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-theme-subtle border border-theme text-theme shadow-2xs">
            <Sliders size={18} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Interface Density & Sizing</h2>
            <p className="text-xs text-gray-500">
              Adjust spacing and padding throughout tables, forms, and cards.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {UI_SIZES.map((size) => {
            const isSelected = uiSize === size.id

            return (
              <div
                key={size.id}
                onClick={() => handleSelectUiSize(size.id)}
                className={`relative flex flex-col justify-between rounded-2xl border p-5 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-2 border-theme ring-3 ring-cyan-500/20 bg-gray-50/50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {size.badge}
                    </span>
                    {isSelected && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-theme px-2 py-0.5 text-xs font-bold text-white">
                        <Check size={12} strokeWidth={3} /> Selected
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-gray-900">{size.name}</h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {size.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 text-xs font-medium text-theme">
                  {size.spacingLabel}
                </div>
              </div>
            )
          })}
        </div>

        {/* Live Interactive Density Demo Preview */}
        <div className="mt-6 rounded-xl border border-dashed border-gray-300 bg-gray-50/70 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-600 flex items-center gap-1.5">
              <Sparkles size={14} className="text-theme" />
              Live Interactive Preview (Current Mode: {uiSize.toUpperCase()})
            </span>
            <span className="text-xs text-gray-400">Updates dynamically</span>
          </div>

          <div
            className={`rounded-xl border border-gray-200 bg-white shadow-xs transition-all ${
              uiSize === 'compact' ? 'p-3' : uiSize === 'spacious' ? 'p-6' : 'p-4'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
              <div>
                <div className="font-bold text-gray-900 text-sm">Lead #LD-4091 — Solar Array Project</div>
                <div className="text-xs text-gray-500">Acme Industries &bull; Created 2 hours ago</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="badge-theme rounded-full px-2.5 py-0.5 text-xs font-bold">
                  Quoted (₹12,450)
                </span>
                <button
                  type="button"
                  className={`btn-theme-gradient rounded-lg font-semibold shadow-xs cursor-pointer ${
                    uiSize === 'compact'
                      ? 'px-2.5 py-1 text-xs'
                      : uiSize === 'spacious'
                      ? 'px-4 py-2 text-sm'
                      : 'px-3 py-1.5 text-xs'
                  }`}
                >
                  Action Button
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Section 3: Profile & Security Overview ─── */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
        <div className="mb-5 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-theme-subtle border border-theme text-theme shadow-2xs">
            <User size={18} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">User Account & Security</h2>
            <p className="text-xs text-gray-500">
              Information about your current session and role authentication.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
            <span className="text-xs font-medium text-gray-500">Logged in As</span>
            <div className="mt-1 text-sm font-bold text-gray-900 truncate">
              {user?.name || user?.email || 'Authenticated User'}
            </div>
            <div className="text-xs text-gray-500 truncate">{user?.email}</div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
            <span className="text-xs font-medium text-gray-500">Assigned Role</span>
            <div className="mt-1 flex items-center gap-2">
              <span className="badge-theme rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider">
                {user?.role || 'VENDOR'}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1">Authorized for quotes & leads</div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
            <span className="text-xs font-medium text-gray-500">Session Security</span>
            <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
              <ShieldCheck size={16} />
              Single-Device Protected
            </div>
            <div className="text-xs text-gray-500 mt-1">Active JWT refresh rotation</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage

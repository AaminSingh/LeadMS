import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, Package, BarChart3, Settings, X, Sparkles } from 'lucide-react'
import useAuthStore from '../../store/useAuthStore'
import useThemeStore, { THEMES } from '../../store/useThemeStore'

const navItems = [
  { to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/app/leads', label: 'Leads', icon: Users },
  { to: '/app/products', label: 'Products', icon: Package },
  { to: '/app/settings', label: 'Settings', icon: Settings },
]

function Sidebar({ isOpen = false, onClose }) {
  const user = useAuthStore((state) => state.user)
  const theme = useThemeStore((state) => state.theme)
  const currentTheme = THEMES.find((t) => t.id === theme) || THEMES[0]
  const isAdmin = user?.role === 'admin'

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6">
          <div className="flex items-center gap-2.5">
            <img
              src="/leadms_logo.jpg"
              alt="LeadMS"
              className="h-9 w-9 rounded-xl object-cover shadow-xs border border-gray-200"
            />
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              Lead<span className="text-theme">MS</span>
            </h1>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 lg:hidden cursor-pointer"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1.5 p-4 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-theme-subtle text-theme font-bold border-l-4 border-theme shadow-2xs'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <Icon size={19} />
              {label}
            </NavLink>
          ))}

          {isAdmin && (
            <NavLink
              to="/app/admin"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-purple-50 text-purple-700 font-semibold shadow-2xs'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <BarChart3 size={19} />
              Admin Analytics
            </NavLink>
          )}
        </nav>

        {/* Bottom Theme & User pill */}
        <div className="border-t border-gray-200 p-4">
          <NavLink
            to="/app/settings"
            onClick={onClose}
            className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/70 p-3 hover:bg-gray-100/80 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <span
                className="h-3 w-3 rounded-full border border-white shadow-xs"
                style={{ backgroundColor: currentTheme.primary }}
              />
              <div className="text-left">
                <div className="text-xs font-bold text-gray-900">{currentTheme.name}</div>
                <div className="text-2xs text-gray-500">Theme Active</div>
              </div>
            </div>
            <Sparkles size={14} className="text-theme" />
          </NavLink>
        </div>
      </aside>
    </>
  )
}

export default Sidebar

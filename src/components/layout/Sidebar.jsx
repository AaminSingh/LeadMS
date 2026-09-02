import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, Package, BarChart3, X } from 'lucide-react'
import useAuthStore from '../../store/useAuthStore'

const navItems = [
  { to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/app/leads', label: 'Leads', icon: Users },
  { to: '/app/products', label: 'Products', icon: Package },
]

function Sidebar({ isOpen = false, onClose }) {
  const user = useAuthStore((state) => state.user)
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
        className={`fixed inset-y-0 left-0 z-50 w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:flex ${isOpen ? 'translate-x-0 flex' : '-translate-x-full hidden lg:flex'
          }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-[#0B192C] to-slate-900 border border-cyan-500/40 text-cyan-400 font-black text-sm shadow-xs">
              L
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              Lead<span className="text-cyan-600">MS</span>
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
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${isActive
                  ? 'bg-cyan-500/10 text-cyan-900 font-bold border-l-4 border-cyan-600 shadow-2xs'
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
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${isActive
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
      </aside>
    </>
  )
}

export default Sidebar

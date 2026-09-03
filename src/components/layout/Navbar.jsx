import { useNavigate } from 'react-router-dom'
import { LogOut, Menu, Settings } from 'lucide-react'
import useAuthStore from '../../store/useAuthStore'
import authService from '../../services/authService'
import toast from 'react-hot-toast'

function Navbar({ onToggleSidebar }) {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = async () => {
    try {
      await authService.logout()
      toast.success('Logged out successfully')
    } catch (error) {
      console.error('Logout API error:', error)
    } finally {
      logout()
      navigate('/login', { replace: true })
    }
  }

  const initial = (user?.name || user?.email || 'U')[0].toUpperCase()

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 lg:hidden cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <Menu size={22} />
        </button>

        <h1 className="text-xl font-bold text-gray-900 lg:hidden flex items-center gap-2">
          <img
            src="/leadms_logo.jpg"
            alt="LeadMS"
            className="h-7 w-7 rounded-lg object-cover shadow-xs border border-gray-200"
          />
          Lead<span className="text-theme">MS</span>
        </h1>
      </div>

      <div className="ml-auto flex items-center gap-3 sm:gap-4">
        {/* Quick Settings Shortcut */}
        <button
          onClick={() => navigate('/app/settings')}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-gray-50/70 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer"
          title="Theme & UI Sizing Settings"
        >
          <Settings size={18} />
        </button>

        {user && (
          <div className="text-sm text-gray-600 flex items-center gap-2">
            {/* User Avatar Circle */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full btn-theme-gradient text-white font-bold text-xs shadow-xs">
              {initial}
            </div>

            <div className="hidden sm:flex flex-col text-left">
              <span className="font-semibold text-gray-900 text-xs leading-tight">
                {user.name || user.email}
              </span>
              {user.role && (
                <span className="text-2xs font-bold uppercase tracking-wider text-gray-400">
                  {user.role}
                </span>
              )}
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
          title="Sign out of workspace"
        >
          <LogOut size={15} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  )
}

export default Navbar

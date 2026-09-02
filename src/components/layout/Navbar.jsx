import { useNavigate } from 'react-router-dom'
import { LogOut, Menu } from 'lucide-react'
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

        <h1 className="text-xl font-bold text-gray-900 lg:hidden flex items-center gap-1.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white font-black text-sm">
            L
          </span>
          LeadMS
        </h1>
      </div>

      <div className="ml-auto flex items-center gap-4">
        {user && (
          <div className="text-sm text-gray-600 flex items-center">
            <span className="font-semibold text-gray-900 hidden sm:inline">
              {user.name || user.email}
            </span>
            {user.role && (
              <span className="ml-2 rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-xs font-semibold text-blue-700 uppercase tracking-wider">
                {user.role}
              </span>
            )}
          </div>
        )}

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  )
}

export default Navbar

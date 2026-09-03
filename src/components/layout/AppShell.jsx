import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import useThemeStore, { applyThemeToDOM } from '../../store/useThemeStore'

function AppShell() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const { theme, uiSize } = useThemeStore()

  useEffect(() => {
    applyThemeToDOM(theme, uiSize)
  }, [theme, uiSize])

  const mainPadding =
    uiSize === 'compact'
      ? 'p-3 sm:p-4 lg:p-6'
      : uiSize === 'spacious'
      ? 'p-6 sm:p-8 lg:p-10'
      : 'p-4 sm:p-6 lg:p-8'

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden transition-colors">
      <Sidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar onToggleSidebar={() => setMobileSidebarOpen((prev) => !prev)} />

        <main className={`flex-1 overflow-y-auto ${mainPadding} transition-all`}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppShell

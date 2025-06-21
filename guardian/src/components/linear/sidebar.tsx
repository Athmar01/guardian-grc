'use client'

import { useState, createContext, useContext } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home,
  Shield,
  AlertTriangle,
  FileText,
  Users,
  BarChart3,
  Settings,
  HelpCircle,
  Menu,
  X,
  ChevronLeft,
  Activity,
  CheckSquare,
  FileCheck,
  Search,
  Bell,
  LogOut,
  User
} from 'lucide-react'

// Sidebar context for managing collapse state
const SidebarContext = createContext({
  isCollapsed: false,
  toggleCollapse: () => {},
})

export function useSidebar() {
  return useContext(SidebarContext)
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleCollapse }}>
      {children}
    </SidebarContext.Provider>
  )
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Risks', href: '/dashboard/risks', icon: AlertTriangle },
  { name: 'Controls', href: '/dashboard/controls', icon: Shield },
  { name: 'Incidents', href: '/dashboard/incidents', icon: Activity },
  { name: 'Policies', href: '/dashboard/policies', icon: FileText },
  { name: 'Audits', href: '/dashboard/audits', icon: FileCheck },
  { name: 'Reports', href: '/dashboard/reports', icon: BarChart3 },
]

const secondaryNavigation = [
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  { name: 'Help', href: '/dashboard/help', icon: HelpCircle },
]

export function Sidebar() {
  const pathname = usePathname()
  const { isCollapsed, toggleCollapse } = useSidebar()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 flex flex-col
        ${isCollapsed ? 'w-sidebar-collapsed' : 'w-sidebar-expanded'}
        bg-bg-1 border-r border-border
        transition-all duration-base
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="flex h-header items-center justify-between px-4 border-b border-border">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <span className="font-semibold text-text-primary">Guardian</span>
            </div>
          )}
          
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex h-8 w-8 items-center justify-center rounded-md hover:bg-bg-2 text-text-secondary transition-colors"
          >
            <ChevronLeft className={`h-4 w-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
          </button>

          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden h-8 w-8 flex items-center justify-center rounded-md hover:bg-bg-2 text-text-secondary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium
                  transition-all duration-base
                  ${isActive 
                    ? 'bg-accent text-white' 
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-2'
                  }
                  ${isCollapsed ? 'justify-center' : ''}
                `}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Secondary Navigation */}
        <div className="border-t border-border p-3 space-y-1">
          {secondaryNavigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium
                  transition-all duration-base
                  ${isActive 
                    ? 'bg-accent text-white' 
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-2'
                  }
                  ${isCollapsed ? 'justify-center' : ''}
                `}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            )
          })}
        </div>

        {/* User Menu */}
        <div className="border-t border-border p-3">
          <button className={`
            w-full flex items-center gap-3 px-3 py-2 rounded-md
            text-sm font-medium text-text-secondary
            hover:text-text-primary hover:bg-bg-2
            transition-all duration-base
            ${isCollapsed ? 'justify-center' : ''}
          `}>
            <div className="h-8 w-8 rounded-full bg-accent-subtle flex-shrink-0" />
            {!isCollapsed && (
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-text-primary">John Doe</p>
                <p className="text-xs text-text-tertiary">john@example.com</p>
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-4 left-4 z-40 lg:hidden h-10 w-10 flex items-center justify-center rounded-md bg-bg-1 border border-border shadow-sm"
      >
        <Menu className="h-5 w-5" />
      </button>
    </>
  )
}

'use client'

import { useState } from 'react'
import { CommandMenu } from './command-menu'
import { Sidebar, SidebarProvider, useSidebar } from './sidebar'
import { Search, Bell, Command } from 'lucide-react'

function AppShellContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar()
  const [isCommandOpen, setIsCommandOpen] = useState(false)

  return (
    <>
      <Sidebar />
      
      {/* Main content area */}
      <div 
        className={`
          transition-all duration-base
          ${isCollapsed ? 'lg:ml-[72px]' : 'lg:ml-[240px]'}
        `}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 h-header border-b border-border bg-bg-0 backdrop-blur-sm">
          <div className="flex h-full items-center justify-between px-6">
            {/* Search */}
            <div className="flex items-center gap-4 flex-1">
              <button
                onClick={() => setIsCommandOpen(true)}
                className="flex items-center gap-2 h-9 px-3 text-sm text-text-secondary bg-bg-1 hover:bg-bg-2 border border-border hover:border-border-hover rounded-md transition-all duration-base"
              >
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">Search or press</span>
                <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-xs bg-bg-2 border border-border rounded">
                  <Command className="h-3 w-3" />K
                </kbd>
              </button>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <button className="relative h-9 w-9 flex items-center justify-center rounded-md hover:bg-bg-1 text-text-secondary transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-danger" />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="min-h-[calc(100vh-var(--header-height))]">
          {children}
        </main>
      </div>

      {/* Command Menu */}
      <CommandMenu open={isCommandOpen} onOpenChange={setIsCommandOpen} />
    </>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppShellContent>{children}</AppShellContent>
    </SidebarProvider>
  )
}

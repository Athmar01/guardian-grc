'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Command } from 'cmdk'
import { 
  Search, 
  Home, 
  FileText, 
  Shield, 
  AlertTriangle, 
  BookOpen, 
  CheckSquare,
  Settings,
  HelpCircle,
  Plus,
  User,
  Moon,
  Sun,
  Monitor,
  Hash,
  Calendar,
  Tag,
  ArrowRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface CommandMenuProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function CommandMenu({ open: controlledOpen, onOpenChange }: CommandMenuProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  
  const isOpen = controlledOpen !== undefined ? controlledOpen : open
  const handleOpenChange = onOpenChange || setOpen

  // Keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        handleOpenChange(!isOpen)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [isOpen, handleOpenChange])

  const navigate = useCallback((href: string) => {
    router.push(href)
    handleOpenChange(false)
  }, [router, handleOpenChange])

  const runCommand = useCallback((command: () => void) => {
    handleOpenChange(false)
    command()
  }, [handleOpenChange])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-fast"
        onClick={() => handleOpenChange(false)}
      />
      
      {/* Command Menu */}
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
        <Command.Dialog
          open={isOpen}
          onOpenChange={handleOpenChange}
          className="w-full max-w-2xl bg-background-elevated rounded-lg shadow-xl border border-border overflow-hidden animate-in slide-in-from-top-2 duration-base"
        >
          <div className="flex items-center border-b border-border px-4">
            <Search className="mr-2 h-4 w-4 shrink-0 text-text-tertiary" />
            <Command.Input
              placeholder="Search for pages, actions, or settings..."
              className="flex h-12 w-full bg-transparent py-3 text-sm outline-none placeholder:text-text-muted disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <Command.List className="max-h-96 overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-text-tertiary">
              No results found.
            </Command.Empty>
            
            {/* Pages */}
            <Command.Group heading="Pages" className="mb-2">
              <Command.Item
                onSelect={() => navigate('/dashboard')}
                className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm text-text-secondary hover:bg-background-secondary hover:text-text-primary transition-colors duration-fast"
              >
                <Home size={16} />
                <span>Overview</span>
              </Command.Item>
              <Command.Item
                onSelect={() => navigate('/dashboard/risks')}
                className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm text-text-secondary hover:bg-background-secondary hover:text-text-primary transition-colors duration-fast"
              >
                <AlertTriangle size={16} />
                <span>Risk Register</span>
                <span className="ml-auto text-xs text-text-tertiary">23 open</span>
              </Command.Item>
              <Command.Item
                onSelect={() => navigate('/dashboard/controls')}
                className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm text-text-secondary hover:bg-background-secondary hover:text-text-primary transition-colors duration-fast"
              >
                <Shield size={16} />
                <span>Controls</span>
                <span className="ml-auto text-xs text-text-tertiary">156 active</span>
              </Command.Item>
              <Command.Item
                onSelect={() => navigate('/dashboard/incidents')}
                className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm text-text-secondary hover:bg-background-secondary hover:text-text-primary transition-colors duration-fast"
              >
                <FileText size={16} />
                <span>Incidents</span>
              </Command.Item>
              <Command.Item
                onSelect={() => navigate('/dashboard/policies')}
                className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm text-text-secondary hover:bg-background-secondary hover:text-text-primary transition-colors duration-fast"
              >
                <BookOpen size={16} />
                <span>Policies</span>
              </Command.Item>
              <Command.Item
                onSelect={() => navigate('/dashboard/audits')}
                className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm text-text-secondary hover:bg-background-secondary hover:text-text-primary transition-colors duration-fast"
              >
                <CheckSquare size={16} />
                <span>Audits</span>
              </Command.Item>
            </Command.Group>

            {/* Actions */}
            <Command.Group heading="Actions" className="mb-2">
              <Command.Item
                onSelect={() => runCommand(() => navigate('/dashboard/risks/new'))}
                className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm text-text-secondary hover:bg-background-secondary hover:text-text-primary transition-colors duration-fast"
              >
                <Plus size={16} />
                <span>Create New Risk</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => navigate('/dashboard/controls/new'))}
                className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm text-text-secondary hover:bg-background-secondary hover:text-text-primary transition-colors duration-fast"
              >
                <Plus size={16} />
                <span>Create New Control</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => navigate('/dashboard/incidents/new'))}
                className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm text-text-secondary hover:bg-background-secondary hover:text-text-primary transition-colors duration-fast"
              >
                <Plus size={16} />
                <span>Report Incident</span>
              </Command.Item>
            </Command.Group>

            {/* Recent Items */}
            <Command.Group heading="Recent" className="mb-2">
              <Command.Item
                onSelect={() => navigate('/dashboard/risks/1')}
                className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm text-text-secondary hover:bg-background-secondary hover:text-text-primary transition-colors duration-fast"
              >
                <Hash size={16} className="text-text-tertiary" />
                <div className="flex flex-col">
                  <span>Data Breach Risk</span>
                  <span className="text-xs text-text-tertiary">RISK-2024-001 • High severity</span>
                </div>
              </Command.Item>
              <Command.Item
                onSelect={() => navigate('/dashboard/controls/1')}
                className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm text-text-secondary hover:bg-background-secondary hover:text-text-primary transition-colors duration-fast"
              >
                <Tag size={16} className="text-text-tertiary" />
                <div className="flex flex-col">
                  <span>Access Control Policy</span>
                  <span className="text-xs text-text-tertiary">CTRL-AC-001 • Implemented</span>
                </div>
              </Command.Item>
            </Command.Group>

            {/* Settings */}
            <Command.Group heading="Settings">
              <Command.Item
                onSelect={() => navigate('/dashboard/settings')}
                className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm text-text-secondary hover:bg-background-secondary hover:text-text-primary transition-colors duration-fast"
              >
                <Settings size={16} />
                <span>Settings</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => console.log('Toggle theme'))}
                className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm text-text-secondary hover:bg-background-secondary hover:text-text-primary transition-colors duration-fast"
              >
                <Sun size={16} />
                <span>Change Theme</span>
                <ArrowRight size={14} className="ml-auto text-text-tertiary" />
              </Command.Item>
            </Command.Group>
          </Command.List>

          {/* Footer */}
          <div className="border-t border-border px-4 py-3">
            <div className="flex items-center justify-between text-xs text-text-tertiary">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-background-secondary px-1.5 font-mono text-[10px] font-medium">
                    ↑↓
                  </kbd>
                  <span>Navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-background-secondary px-1.5 font-mono text-[10px] font-medium">
                    ↵
                  </kbd>
                  <span>Select</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-background-secondary px-1.5 font-mono text-[10px] font-medium">
                    esc
                  </kbd>
                  <span>Close</span>
                </span>
              </div>
            </div>
          </div>
        </Command.Dialog>
      </div>
    </>
  )
}

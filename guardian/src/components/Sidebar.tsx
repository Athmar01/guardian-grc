"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, ReactNode } from 'react';
import {
  HomeIcon,
  FileTextIcon,
  CheckCircledIcon,
  BadgeIcon,
  GearIcon,
  ActivityLogIcon,
  HamburgerMenuIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@radix-ui/react-icons';
import ThemeToggle from './ThemeToggle';
import UserProfileSidebar from './UserProfileSidebar';
import { Button } from '@/components/ui/Button'; // Corrected import path casing
import { useAuth } from '@/lib/auth'; // Assuming useAuth provides user info
import { cn } from '@/lib/utils'; // For conditional class names

interface NavItem {
  name: string;
  href: string;
  icon: ReactNode;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: <HomeIcon className="w-5 h-5" /> },
  { name: 'Policies', href: '/dashboard/policies', icon: <FileTextIcon className="w-5 h-5" /> },
  { name: 'Risks', href: '/dashboard/risks', icon: <CheckCircledIcon className="w-5 h-5" /> },
  { name: 'Compliance', href: '/dashboard/compliance', icon: <BadgeIcon className="w-5 h-5" /> },
  { name: 'Risk Matrices', href: '/dashboard/risk-matrices', icon: <FileTextIcon className="w-5 h-5" /> },
  { name: 'Activity Log', href: '/dashboard/activity', icon: <ActivityLogIcon className="w-5 h-5" />, adminOnly: true },
  { name: 'Settings', href: '/dashboard/settings', icon: <GearIcon className="w-5 h-5" />, adminOnly: true },
];

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isCollapsed, toggleSidebar }: SidebarProps) {
  const { user } = useAuth();
  const role = user?.role || 'viewer'; // Reverted to user.role, verify actual user object structure
  const pathname = usePathname();
  

  return (
    <aside
      className={cn(
        'flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-700 transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Header with Logo and Toggle Button */}
      <div className={cn('flex items-center border-b border-neutral-200 dark:border-neutral-700',
        isCollapsed ? 'justify-center h-[60px]' : 'justify-between h-[60px] px-4')}>
        {!isCollapsed && (
          <Link href="/dashboard" className="text-2xl font-bold text-primary">
            Guardian
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className={cn('text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800',
            isCollapsed && "mx-auto" // Center button when collapsed
          )}
        >
          {isCollapsed ? <ChevronRightIcon className="w-6 h-6" /> : <ChevronLeftIcon className="w-6 h-6" />}
        </Button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow px-2 py-4 space-y-1">
        {navItems.map((item) => {
          if (item.adminOnly && role !== 'admin') {
            return null;
          }
          const currentPathname = pathname || '';
          const isActive = currentPathname === item.href || (item.href !== '/dashboard' && currentPathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              title={isCollapsed ? item.name : undefined}
              className={cn(
                'flex items-center rounded-md group transition-colors duration-150',
                'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-primary dark:hover:text-primary',
                isActive
                  ? 'bg-primary/10 text-primary border-l-4 border-primary font-medium dark:bg-primary/20'
                  : 'border-l-4 border-transparent',
                isCollapsed ? 'justify-center h-12 w-12 mx-auto' : 'gap-3 px-3 py-2.5 h-10'
              )}
            >
              <span className={cn('transition-transform duration-150 group-hover:scale-110', isCollapsed ? 'w-6 h-6' : 'w-5 h-5')}>
                {item.icon}
              </span>
              {!isCollapsed && <span className="text-sm">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer Section */}
      <div className={cn('mt-auto border-t border-neutral-200 dark:border-neutral-700 p-3 space-y-3',
         isCollapsed && "py-3")}>
        <ThemeToggle isCollapsed={isCollapsed} />
        <UserProfileSidebar isCollapsed={isCollapsed} />
        {!isCollapsed && (
             <Button variant="outline" className="w-full mt-2 text-xs" disabled>
                Active Directory Login
            </Button>
        )}
      </div>
    </aside>
  );
}
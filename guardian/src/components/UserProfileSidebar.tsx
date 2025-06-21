"use client";
import { useAuth } from '@/lib/auth';

interface UserProfileSidebarProps {
  isCollapsed: boolean;
}

export default function UserProfileSidebar({ isCollapsed }: UserProfileSidebarProps) {
  const { user } = useAuth();
  
  if (!user) return null;
  
  return (
    <div className={`flex flex-col items-center ${isCollapsed ? 'my-2' : 'mb-6'}`}>
      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
        {user.name?.charAt(0).toUpperCase() || 'U'}
      </div>
      {!isCollapsed && (
        <div className="mt-2 text-sm text-center">
          <div className="font-semibold text-neutral-700 dark:text-neutral-200 truncate max-w-[120px]">{user.name}</div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400 truncate max-w-[120px]">{user.email}</div>
          {user.role && <div className="mt-1 text-xs text-primary font-medium">{user.role}</div>}
        </div>
      )}
    </div>
  );
}
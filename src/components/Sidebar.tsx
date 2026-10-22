import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Home,
  Sparkles,
  CreditCard,
  BookOpen,
  Mail,
  User,
  Bell,
} from 'lucide-react';
import { currentRole } from '../auth/auth';

interface NavItem {
  label: string;
  to: string;
  icon: React.ElementType;
  roles?: string[];
}

const navItems: NavItem[] = [
  { label: 'Home', to: '/home', icon: Home },
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Features', to: '/features', icon: Sparkles },
  { label: 'Pricing', to: '/pricing', icon: CreditCard },
  { label: 'Resources', to: '/resources', icon: BookOpen },
  { label: 'Contact', to: '/contact', icon: Mail },
  { label: 'Notifications', to: '/notifications', icon: Bell },
  { label: 'Profile', to: '/profile', icon: User },
];

export function Sidebar(): React.ReactElement {
  const role = currentRole();

  const visibleItems = navItems.filter((item) => !item.roles || (role && item.roles.includes(role)));

  return (
    <aside className="hidden lg:flex lg:flex-col w-64 shrink-0 border-r border-border-subtle dark:border-border-dark bg-surface dark:bg-surface-dark sticky top-0 h-screen">
      <div className="flex items-center gap-2 px-6 py-6">
        <div className="h-9 w-9 rounded-card bg-gradient-primary shadow-card-lg" />
        <span className="text-lg font-semibold tracking-tight">Nimbus</span>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-card px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-white shadow-card'
                    : 'text-muted hover:bg-canvas dark:hover:bg-night dark:text-muted-dark'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="px-6 py-4 text-xs text-muted border-t border-border-subtle dark:border-border-dark">
        &copy; {new Date().getFullYear()} Nimbus SaaS
      </div>
    </aside>
  );
}

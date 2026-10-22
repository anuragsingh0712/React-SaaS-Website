import React, { useEffect, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { Bell, Menu, Moon, Sun, X, LogOut, UserRound } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { currentFullUser, logout } from '../auth/auth';
import { getNotifications } from '../data/store';
import { ConfirmDialog } from './ConfirmDialog';

const mobileNavItems = [
  { label: 'Home', to: '/home' },
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Features', to: '/features' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Resources', to: '/resources' },
  { label: 'Contact', to: '/contact' },
  { label: 'Notifications', to: '/notifications' },
  { label: 'Profile', to: '/profile' },
];

export function TopBar(): React.ReactElement {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const user = currentFullUser();

  useEffect(() => {
    getNotifications().then((notifications) => {
      setUnreadCount(notifications.filter((notification) => !notification.read).length);
    });
  }, []);

  const handleLogout = async (): Promise<void> => {
    await logout();
    setIsLogoutConfirmOpen(false);
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-border-subtle dark:border-border-dark bg-surface/80 dark:bg-surface-dark/80 backdrop-blur-md px-4 lg:px-8 h-16">
      <button
        type="button"
        className="lg:hidden rounded-card p-2 text-muted hover:bg-canvas dark:hover:bg-night"
        onClick={() => setIsMobileMenuOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex-1 lg:flex-none">
        <span className="font-semibold text-sm lg:hidden">Nimbus</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-card p-2 text-muted hover:bg-canvas dark:hover:bg-night transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <button
          type="button"
          onClick={() => navigate('/notifications')}
          className="relative rounded-card p-2 text-muted hover:bg-canvas dark:hover:bg-night transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-pill bg-danger-dark text-[10px] font-semibold text-white">
              {unreadCount}
            </span>
          )}
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsUserMenuOpen((open) => !open)}
            className="flex items-center gap-2 rounded-card px-2 py-1.5 hover:bg-canvas dark:hover:bg-night transition-colors"
          >
            <div className="h-8 w-8 rounded-pill bg-gradient-primary flex items-center justify-center text-white text-xs font-semibold">
              {user ? `${user.firstName[0]}${user.lastName[0] ?? ''}` : <UserRound className="h-4 w-4" />}
            </div>
            <span className="hidden sm:block text-sm font-medium">
              {user ? `${user.firstName} ${user.lastName}` : 'Account'}
            </span>
          </button>

          {isUserMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-48 rounded-card border border-border-subtle dark:border-border-dark bg-surface dark:bg-surface-dark shadow-card-lg py-1"
              onMouseLeave={() => setIsUserMenuOpen(false)}
            >
              <button
                type="button"
                onClick={() => {
                  setIsUserMenuOpen(false);
                  navigate('/profile');
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-left hover:bg-canvas dark:hover:bg-night"
              >
                <UserRound className="h-4 w-4" /> Profile
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsUserMenuOpen(false);
                  setIsLogoutConfirmOpen(true);
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-left text-danger-dark hover:bg-canvas dark:hover:bg-night"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-surface dark:bg-surface-dark p-6 shadow-card-lg">
            <div className="flex items-center justify-between mb-6">
              <span className="font-semibold">Nimbus</span>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
                className="rounded-card p-2 text-muted hover:bg-canvas dark:hover:bg-night"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="space-y-1">
              {mobileNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-card px-3 py-2.5 text-sm font-medium ${
                      isActive ? 'bg-primary text-white' : 'text-muted hover:bg-canvas dark:hover:bg-night'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={isLogoutConfirmOpen}
        title="Log out"
        message="Are you sure you want to log out of Nimbus?"
        confirmLabel="Log out"
        onCancel={() => setIsLogoutConfirmOpen(false)}
        onConfirm={handleLogout}
      />
    </header>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun, Trash2, LogOut, Pencil } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAsyncData } from '../hooks/useAsyncData';
import { getProfile, updateProfile, clearApplicationData, getCurrentSubscription, getActivities } from '../data/store';
import { logout } from '../auth/auth';
import { useTheme } from '../contexts/ThemeContext';
import { validateRequired } from '../validation';
import { Card } from '../components/Card';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { FormField, inputClassName } from '../components/FormField';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { formatDateTime } from '../utils/format';

export function Profile(): React.ReactElement {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const profileQuery = useAsyncData(getProfile, []);
  const subscriptionQuery = useAsyncData(getCurrentSubscription, []);
  const activitiesQuery = useAsyncData(getActivities, []);

  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [company, setCompany] = useState('');
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  const startEditing = (): void => {
    if (!profileQuery.data) return;
    setFirstName(profileQuery.data.firstName);
    setLastName(profileQuery.data.lastName);
    setCompany(profileQuery.data.company);
    setNotificationsEnabled(profileQuery.data.notificationsEnabled);
    setIsEditing(true);
    setHasAttemptedSubmit(false);
  };

  const firstNameError = validateRequired(firstName, 'First name');
  const isValid = !firstNameError;

  const handleSaveProfile = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    setHasAttemptedSubmit(true);
    if (!isValid) return;

    await updateProfile({ firstName, lastName, company, notificationsEnabled });
    setIsEditing(false);
    profileQuery.refetch();
    toast.success('Profile updated successfully.');
  };

  const handleToggleNotifications = async (): Promise<void> => {
    if (!profileQuery.data) return;
    await updateProfile({ notificationsEnabled: !profileQuery.data.notificationsEnabled });
    profileQuery.refetch();
  };

  const handleClearData = async (): Promise<void> => {
    await clearApplicationData();
    setIsClearConfirmOpen(false);
    profileQuery.refetch();
    subscriptionQuery.refetch();
    toast.success('Application data cleared.');
  };

  const handleLogout = async (): Promise<void> => {
    await logout();
    setIsLogoutConfirmOpen(false);
    navigate('/login');
  };

  if (profileQuery.isLoading) {
    return (
      <div className="space-y-4">
        <SkeletonLoader className="h-32 w-full" />
        <SkeletonLoader className="h-48 w-full" />
      </div>
    );
  }

  const profile = profileQuery.data;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Profile &amp; settings</h1>
        <p className="mt-1 text-sm text-muted">Manage your account information and preferences.</p>
      </div>

      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-pill bg-gradient-primary flex items-center justify-center text-xl font-semibold text-white">
              {profile ? `${profile.firstName[0]}${profile.lastName[0] ?? ''}` : '?'}
            </div>
            <div>
              <p className="text-lg font-semibold">
                {profile?.firstName} {profile?.lastName}
              </p>
              <p className="text-sm text-muted">{profile?.email}</p>
              <p className="text-sm text-muted">{profile?.company || 'No company set'}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={startEditing}
            className="inline-flex items-center gap-2 self-start rounded-card border border-border-default dark:border-border-dark px-4 py-2 text-sm font-medium hover:bg-canvas dark:hover:bg-night"
          >
            <Pencil className="h-4 w-4" /> Edit profile
          </button>
        </div>

        {isEditing && (
          <form className="mt-6 space-y-4 border-t border-border-subtle dark:border-border-dark pt-6" onSubmit={handleSaveProfile} noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="First name" htmlFor="firstName" error={hasAttemptedSubmit ? firstNameError : undefined}>
                <input id="firstName" value={firstName} onChange={(event) => setFirstName(event.target.value)} className={inputClassName} />
              </FormField>
              <FormField label="Last name" htmlFor="lastName">
                <input id="lastName" value={lastName} onChange={(event) => setLastName(event.target.value)} className={inputClassName} />
              </FormField>
            </div>
            <FormField label="Company" htmlFor="profile-company">
              <input id="profile-company" value={company} onChange={(event) => setCompany(event.target.value)} className={inputClassName} />
            </FormField>
            <div className="flex gap-3">
              <button type="submit" disabled={!isValid} className="rounded-card bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50">
                Save changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-card border border-border-default dark:border-border-dark px-5 py-2.5 text-sm font-medium text-muted hover:bg-canvas dark:hover:bg-night"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="font-semibold mb-4">Subscription</h2>
          {subscriptionQuery.data ? (
            <div className="space-y-1 text-sm">
              <p>
                Plan: <span className="font-semibold">{subscriptionQuery.data.plan}</span>
              </p>
              <p>Billing: {subscriptionQuery.data.billingCycle}</p>
              <p>Price: ${subscriptionQuery.data.price}</p>
              <p className="text-muted">Renews {formatDateTime(subscriptionQuery.data.renewalDate)}</p>
            </div>
          ) : (
            <p className="text-sm text-muted">No active subscription.</p>
          )}
          <button
            type="button"
            onClick={() => navigate('/pricing')}
            className="mt-4 text-sm font-semibold text-primary hover:underline"
          >
            Manage plan
          </button>
        </Card>

        <Card>
          <h2 className="font-semibold mb-4">Preferences</h2>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium">Theme</p>
              <p className="text-xs text-muted">Toggle between light and dark mode.</p>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex items-center gap-2 rounded-card border border-border-default dark:border-border-dark px-3 py-1.5 text-sm font-medium"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-border-subtle dark:border-border-dark">
            <div>
              <p className="text-sm font-medium">Notifications</p>
              <p className="text-xs text-muted">Receive product announcements and reminders.</p>
            </div>
            <button
              type="button"
              onClick={handleToggleNotifications}
              className={`relative h-6 w-11 rounded-pill transition-colors ${
                profile?.notificationsEnabled ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'
              }`}
              aria-label="Toggle notifications"
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-pill bg-white transition-transform ${
                  profile?.notificationsEnabled ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="font-semibold mb-4">Recent activity</h2>
        {activitiesQuery.isLoading ? (
          <SkeletonLoader className="h-10 w-full" count={3} />
        ) : (
          <ul className="space-y-3">
            {(activitiesQuery.data ?? []).slice(0, 5).map((activity) => (
              <li key={activity.id} className="text-sm">
                <p className="font-medium">{activity.description}</p>
                <p className="text-xs text-muted">{formatDateTime(activity.timestamp)}</p>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card className="border-danger-light">
        <h2 className="font-semibold text-danger-dark mb-2">Danger zone</h2>
        <p className="text-sm text-muted mb-4">
          These actions are destructive. Clearing data removes bookmarks, notifications, and contact submissions from
          this browser.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setIsClearConfirmOpen(true)}
            className="inline-flex items-center gap-2 rounded-card border border-danger-light px-4 py-2 text-sm font-medium text-danger-dark hover:bg-danger-light"
          >
            <Trash2 className="h-4 w-4" /> Clear application data
          </button>
          <button
            type="button"
            onClick={() => setIsLogoutConfirmOpen(true)}
            className="inline-flex items-center gap-2 rounded-card bg-danger-dark px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </Card>

      <ConfirmDialog
        isOpen={isClearConfirmOpen}
        title="Clear application data"
        message="This will remove all locally stored bookmarks, notifications, and submissions. This cannot be undone."
        confirmLabel="Clear data"
        onCancel={() => setIsClearConfirmOpen(false)}
        onConfirm={handleClearData}
      />

      <ConfirmDialog
        isOpen={isLogoutConfirmOpen}
        title="Log out"
        message="Are you sure you want to log out of Nimbus?"
        confirmLabel="Log out"
        onCancel={() => setIsLogoutConfirmOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}

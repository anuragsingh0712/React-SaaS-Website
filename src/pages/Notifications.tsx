import React from 'react';
import { Megaphone, Rocket, UserCog, BellRing, Check, X } from 'lucide-react';
import { useAsyncData } from '../hooks/useAsyncData';
import { getNotifications, markNotificationRead, dismissNotification, markAllNotificationsRead } from '../data/store';
import type { NotificationType } from '../types';
import { Card } from '../components/Card';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { ErrorState } from '../components/ErrorState';
import { EmptyState } from '../components/EmptyState';
import { Badge } from '../components/Badge';
import { formatDateTime } from '../utils/format';

const typeConfig: Record<NotificationType, { label: string; icon: React.ElementType; tone: 'primary' | 'success' | 'warning' | 'info' }> = {
  announcement: { label: 'Announcement', icon: Megaphone, tone: 'info' },
  feature_release: { label: 'Feature release', icon: Rocket, tone: 'primary' },
  account_update: { label: 'Account update', icon: UserCog, tone: 'success' },
  reminder: { label: 'Reminder', icon: BellRing, tone: 'warning' },
};

export function Notifications(): React.ReactElement {
  const notificationsQuery = useAsyncData(getNotifications, []);

  const handleMarkRead = async (id: string): Promise<void> => {
    await markNotificationRead(id);
    notificationsQuery.refetch();
  };

  const handleDismiss = async (id: string): Promise<void> => {
    await dismissNotification(id);
    notificationsQuery.refetch();
  };

  const handleMarkAllRead = async (): Promise<void> => {
    await markAllNotificationsRead();
    notificationsQuery.refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Notification center</h1>
          <p className="mt-1 text-sm text-muted">Announcements, releases, account updates, and reminders.</p>
        </div>
        <button
          type="button"
          onClick={handleMarkAllRead}
          className="inline-flex items-center gap-2 rounded-card border border-border-default dark:border-border-dark px-4 py-2 text-sm font-medium hover:bg-canvas dark:hover:bg-night"
        >
          <Check className="h-4 w-4" /> Mark all as read
        </button>
      </div>

      {notificationsQuery.isLoading ? (
        <SkeletonLoader className="h-20 w-full" count={4} />
      ) : notificationsQuery.error ? (
        <ErrorState message={notificationsQuery.error} onRetry={notificationsQuery.refetch} />
      ) : notificationsQuery.data && notificationsQuery.data.length > 0 ? (
        <div className="space-y-3">
          {notificationsQuery.data.map((notification) => {
            const config = typeConfig[notification.type];
            const Icon = config.icon;
            return (
              <Card key={notification.id} className={notification.read ? 'opacity-70' : ''}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-pill bg-canvas dark:bg-night p-2 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">{notification.title}</p>
                        {!notification.read && <Badge tone="primary">Unread</Badge>}
                        <Badge tone={config.tone}>{config.label}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted">{notification.message}</p>
                      <p className="mt-1 text-xs text-muted">{formatDateTime(notification.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {!notification.read && (
                      <button
                        type="button"
                        onClick={() => handleMarkRead(notification.id)}
                        className="rounded-card p-2 text-muted hover:bg-canvas dark:hover:bg-night"
                        aria-label="Mark as read"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDismiss(notification.id)}
                      className="rounded-card p-2 text-muted hover:bg-canvas dark:hover:bg-night"
                      aria-label="Dismiss notification"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState title="No notifications" description="You're all caught up for now." />
      )}
    </div>
  );
}

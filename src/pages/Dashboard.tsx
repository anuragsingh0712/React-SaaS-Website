import React, { useState } from 'react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useAsyncData } from '../hooks/useAsyncData';
import { getChartData, getNotifications } from '../data/store';
import { DASHBOARD_FILTERS } from '../constants';
import { Card } from '../components/Card';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { RefreshButton } from '../components/RefreshButton';
import { ProgressBar } from '../components/ProgressBar';
import { Badge } from '../components/Badge';
import { formatDateTime } from '../utils/format';

type FilterValue = (typeof DASHBOARD_FILTERS)[number];

export function Dashboard(): React.ReactElement {
  const [filter, setFilter] = useState<FilterValue>('weekly');

  const chartQuery = useAsyncData(() => getChartData(filter), [filter]);
  const notificationsQuery = useAsyncData(getNotifications, []);

  const totals = chartQuery.data?.reduce(
    (accumulator, point) => ({
      revenue: accumulator.revenue + point.revenue,
      activeUsers: Math.max(accumulator.activeUsers, point.activeUsers),
      completedTasks: accumulator.completedTasks + point.completedTasks,
      conversionRate: accumulator.conversionRate + point.conversionRate,
    }),
    { revenue: 0, activeUsers: 0, completedTasks: 0, conversionRate: 0 },
  );

  const averageConversionRate = totals && chartQuery.data?.length
    ? (totals.conversionRate / chartQuery.data.length).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Analytics dashboard</h1>
          <p className="mt-1 text-sm text-muted">Track revenue, users, and delivery across your workspace.</p>
        </div>
        <RefreshButton
          onRefresh={() => {
            chartQuery.refetch();
            notificationsQuery.refetch();
          }}
          isLoading={chartQuery.isLoading || notificationsQuery.isLoading}
        />
      </div>

      <div className="inline-flex rounded-card border border-border-default dark:border-border-dark p-1">
        {DASHBOARD_FILTERS.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={`rounded-card px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
              filter === value ? 'bg-primary text-white' : 'text-muted hover:bg-canvas dark:hover:bg-night'
            }`}
          >
            {value}
          </button>
        ))}
      </div>

      {chartQuery.isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SkeletonLoader className="h-24 w-full" count={4} />
        </div>
      ) : chartQuery.error ? (
        <ErrorState message={chartQuery.error} onRetry={chartQuery.refetch} />
      ) : totals ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <p className="text-sm text-muted">Revenue summary</p>
            <p className="mt-2 text-2xl font-semibold">${totals.revenue.toLocaleString()}</p>
          </Card>
          <Card>
            <p className="text-sm text-muted">Active users</p>
            <p className="mt-2 text-2xl font-semibold">{totals.activeUsers.toLocaleString()}</p>
          </Card>
          <Card>
            <p className="text-sm text-muted">Completed tasks</p>
            <p className="mt-2 text-2xl font-semibold">{totals.completedTasks.toLocaleString()}</p>
          </Card>
          <Card>
            <p className="text-sm text-muted">Conversion rate</p>
            <p className="mt-2 text-2xl font-semibold">{averageConversionRate}%</p>
          </Card>
        </div>
      ) : (
        <EmptyState title="No analytics data" description="Analytics will appear once data is available." />
      )}

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <h2 className="font-semibold mb-4">Project progress</h2>
          {chartQuery.isLoading ? (
            <SkeletonLoader className="h-64 w-full" />
          ) : chartQuery.data && chartQuery.data.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartQuery.data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip />
                <Bar dataKey="completedTasks" fill="#14b8a6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState title="No project data" description="Project progress will appear here." />
          )}

          <div className="mt-6 space-y-4">
            <ProgressBar label="Sprint completion" percentage={72} />
            <ProgressBar label="QA coverage" percentage={58} />
            <ProgressBar label="Release readiness" percentage={90} />
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold mb-4">Notifications</h2>
          {notificationsQuery.isLoading ? (
            <SkeletonLoader className="h-10 w-full" count={4} />
          ) : notificationsQuery.error ? (
            <ErrorState message={notificationsQuery.error} onRetry={notificationsQuery.refetch} />
          ) : notificationsQuery.data && notificationsQuery.data.length > 0 ? (
            <ul className="space-y-4">
              {notificationsQuery.data.slice(0, 5).map((notification) => (
                <li key={notification.id} className="text-sm">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{notification.title}</p>
                    {!notification.read && <Badge tone="primary">New</Badge>}
                  </div>
                  <p className="text-xs text-muted">{formatDateTime(notification.createdAt)}</p>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="You're all caught up" description="No new notifications right now." />
          )}
        </Card>
      </section>
    </div>
  );
}

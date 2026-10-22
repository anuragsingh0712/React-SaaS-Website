import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Sparkles, CreditCard, BookOpen } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useAsyncData } from '../hooks/useAsyncData';
import { getKpis, getActivities, getChartData } from '../data/store';
import { currentFullUser } from '../auth/auth';
import { KpiCard } from '../components/KpiCard';
import { Card } from '../components/Card';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { RefreshButton } from '../components/RefreshButton';
import { TestimonialsCarousel } from '../components/TestimonialsCarousel';
import { formatDateTime } from '../utils/format';

const quickActions = [
  { label: 'View Analytics', description: 'Dive into detailed metrics', icon: LayoutDashboard, to: '/dashboard' },
  { label: 'Explore Features', description: 'See what Nimbus can do', icon: Sparkles, to: '/features' },
  { label: 'Upgrade Plan', description: 'Compare pricing tiers', icon: CreditCard, to: '/pricing' },
  { label: 'Browse Resources', description: 'Guides, tutorials & FAQs', icon: BookOpen, to: '/resources' },
];

export function Home(): React.ReactElement {
  const navigate = useNavigate();
  const user = currentFullUser();

  const kpisQuery = useAsyncData(getKpis, []);
  const activitiesQuery = useAsyncData(getActivities, []);
  const chartQuery = useAsyncData(() => getChartData('weekly'), []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back{user ? `, ${user.firstName}` : ''}
          </h1>
          <p className="mt-1 text-sm text-muted">Here is what is happening across your workspace today.</p>
        </div>
        <RefreshButton
          onRefresh={() => {
            kpisQuery.refetch();
            activitiesQuery.refetch();
            chartQuery.refetch();
          }}
          isLoading={kpisQuery.isLoading || activitiesQuery.isLoading || chartQuery.isLoading}
        />
      </div>

      <section>
        {kpisQuery.isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <SkeletonLoader className="h-28 w-full" count={5} />
          </div>
        ) : kpisQuery.error ? (
          <ErrorState message={kpisQuery.error} onRetry={kpisQuery.refetch} />
        ) : kpisQuery.data && kpisQuery.data.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {kpisQuery.data.map((kpi, index) => (
              <KpiCard key={kpi.id} kpi={kpi} index={index} />
            ))}
          </div>
        ) : (
          <EmptyState title="No KPIs yet" description="KPI metrics will appear here once available." />
        )}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <h2 className="font-semibold mb-4">Revenue overview</h2>
          {chartQuery.isLoading ? (
            <SkeletonLoader className="h-64 w-full" />
          ) : chartQuery.error ? (
            <ErrorState message={chartQuery.error} onRetry={chartQuery.refetch} />
          ) : chartQuery.data && chartQuery.data.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={chartQuery.data}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" fill="url(#revenueGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState title="No revenue data" description="Revenue trends will appear once data is available." />
          )}
        </Card>

        <Card>
          <h2 className="font-semibold mb-4">Recent activity</h2>
          {activitiesQuery.isLoading ? (
            <SkeletonLoader className="h-10 w-full" count={5} />
          ) : activitiesQuery.error ? (
            <ErrorState message={activitiesQuery.error} onRetry={activitiesQuery.refetch} />
          ) : activitiesQuery.data && activitiesQuery.data.length > 0 ? (
            <ul className="space-y-4">
              {activitiesQuery.data.map((activity) => (
                <li key={activity.id} className="text-sm">
                  <p className="font-medium">{activity.description}</p>
                  <p className="text-xs text-muted">{formatDateTime(activity.timestamp)}</p>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="No recent activity" description="Your team's activity will show up here." />
          )}
        </Card>
      </section>

      <section>
        <h2 className="font-semibold mb-4">Quick actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card key={action.to} onClick={() => navigate(action.to)}>
                <Icon className="h-6 w-6 text-primary" />
                <h3 className="mt-3 font-semibold">{action.label}</h3>
                <p className="mt-1 text-sm text-muted">{action.description}</p>
              </Card>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="font-semibold mb-4">What our customers say</h2>
        <TestimonialsCarousel />
      </section>
    </div>
  );
}

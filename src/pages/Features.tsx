import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Workflow, Users2, CheckCircle2 } from 'lucide-react';
import { useAsyncData } from '../hooks/useAsyncData';
import { getFeatureModules } from '../data/store';
import { Card } from '../components/Card';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { ErrorState } from '../components/ErrorState';
import { EmptyState } from '../components/EmptyState';

const moduleIcons: Record<string, React.ElementType> = {
  Analytics: BarChart3,
  Automation: Workflow,
  Collaboration: Users2,
};

export function Features(): React.ReactElement {
  const navigate = useNavigate();
  const featuresQuery = useAsyncData(getFeatureModules, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Platform features</h1>
        <p className="mt-1 text-sm text-muted">
          Three modules built to help your team analyze, automate, and collaborate at scale.
        </p>
      </div>

      {featuresQuery.isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SkeletonLoader className="h-80 w-full" count={3} />
        </div>
      ) : featuresQuery.error ? (
        <ErrorState message={featuresQuery.error} onRetry={featuresQuery.refetch} />
      ) : featuresQuery.data && featuresQuery.data.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {featuresQuery.data.map((feature) => {
            const Icon = moduleIcons[feature.name] ?? CheckCircle2;
            return (
              <Card key={feature.id} className="flex flex-col">
                <div className="h-12 w-12 rounded-card bg-primary-50 flex items-center justify-center text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="mt-4 text-lg font-semibold">{feature.name}</h2>
                <p className="mt-2 text-sm text-muted">{feature.overview}</p>

                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">Benefits</p>
                  <ul className="mt-2 space-y-1.5 text-sm">
                    {feature.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="mt-4 text-sm text-muted">{feature.workflowDescription}</p>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  {feature.usageStatistics.map((stat) => (
                    <div key={stat.label} className="rounded-card bg-canvas dark:bg-night px-3 py-2">
                      <p className="text-xs text-muted">{stat.label}</p>
                      <p className="text-sm font-semibold">{stat.value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">Sample insights</p>
                  <ul className="mt-2 space-y-1 text-sm text-muted">
                    {feature.sampleInsights.map((insight) => (
                      <li key={insight}>&ldquo;{insight}&rdquo;</li>
                    ))}
                  </ul>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState title="No features available" description="Feature modules will appear here once published." />
      )}

      <Card className="bg-gradient-primary text-white">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Ready to see pricing?</h2>
            <p className="mt-1 text-sm text-white/80">Compare plans and find the right fit for your team.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/pricing')}
            className="rounded-card bg-white px-5 py-2.5 text-sm font-semibold text-primary hover:opacity-90"
          >
            View pricing
          </button>
        </div>
      </Card>
    </div>
  );
}

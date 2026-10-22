import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { useAsyncData } from '../hooks/useAsyncData';
import { getPricingTiers, getCurrentSubscription, selectSubscription } from '../data/store';
import { YEARLY_DISCOUNT_PERCENT } from '../constants';
import type { BillingCycle, PricingTier } from '../types';
import { Card } from '../components/Card';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { ErrorState } from '../components/ErrorState';
import { Badge } from '../components/Badge';
import { ConfirmDialog } from '../components/ConfirmDialog';

export function Pricing(): React.ReactElement {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [pendingTier, setPendingTier] = useState<PricingTier | null>(null);
  const [confirmedPlan, setConfirmedPlan] = useState<string | null>(null);

  const tiersQuery = useAsyncData(getPricingTiers, []);
  const subscriptionQuery = useAsyncData(getCurrentSubscription, []);

  const handleConfirmSelection = async (): Promise<void> => {
    if (!pendingTier) return;
    const price = billingCycle === 'monthly' ? pendingTier.monthlyPrice : pendingTier.yearlyPrice;
    await selectSubscription(pendingTier.name, billingCycle, price, pendingTier.features);
    setConfirmedPlan(pendingTier.name);
    setPendingTier(null);
    subscriptionQuery.refetch();
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Simple, transparent pricing</h1>
        <p className="mt-2 text-sm text-muted">Choose the plan that fits your team's needs.</p>

        {subscriptionQuery.data && (
          <p className="mt-2 text-sm font-medium text-primary">
            Current plan: {subscriptionQuery.data.plan} ({subscriptionQuery.data.billingCycle})
          </p>
        )}

        <div className="mt-6 inline-flex rounded-card border border-border-default dark:border-border-dark p-1">
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            className={`rounded-card px-4 py-1.5 text-sm font-medium transition-colors ${
              billingCycle === 'monthly' ? 'bg-primary text-white' : 'text-muted hover:bg-canvas dark:hover:bg-night'
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle('yearly')}
            className={`rounded-card px-4 py-1.5 text-sm font-medium transition-colors ${
              billingCycle === 'yearly' ? 'bg-primary text-white' : 'text-muted hover:bg-canvas dark:hover:bg-night'
            }`}
          >
            Yearly
            <span className="ml-1 text-xs font-normal">(save {YEARLY_DISCOUNT_PERCENT}%)</span>
          </button>
        </div>
      </div>

      {tiersQuery.isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SkeletonLoader className="h-96 w-full" count={3} />
        </div>
      ) : tiersQuery.error ? (
        <ErrorState message={tiersQuery.error} onRetry={tiersQuery.refetch} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {tiersQuery.data?.map((tier) => {
            const price = billingCycle === 'monthly' ? tier.monthlyPrice : tier.yearlyPrice;
            const monthlyEquivalent = billingCycle === 'yearly' ? Math.round(tier.yearlyPrice / 12) : tier.monthlyPrice;
            const isCurrentPlan = subscriptionQuery.data?.plan === tier.name;

            return (
              <Card
                key={tier.id}
                className={tier.highlighted ? 'border-primary ring-2 ring-primary-100 relative' : 'relative'}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge tone="primary">Most popular</Badge>
                  </div>
                )}

                <h2 className="text-lg font-semibold">{tier.name}</h2>
                <p className="mt-4 text-3xl font-bold">
                  ${price}
                  <span className="text-sm font-normal text-muted">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                </p>
                {billingCycle === 'yearly' && (
                  <p className="text-xs text-success-dark mt-1">
                    Equivalent to ${monthlyEquivalent}/mo — save {YEARLY_DISCOUNT_PERCENT}% vs monthly billing
                  </p>
                )}

                <ul className="mt-6 space-y-2.5 text-sm">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => setPendingTier(tier)}
                  disabled={isCurrentPlan}
                  className={`mt-6 w-full rounded-card py-2.5 text-sm font-semibold transition-opacity ${
                    tier.highlighted
                      ? 'bg-primary text-white hover:opacity-90'
                      : 'border border-border-default dark:border-border-dark hover:bg-canvas dark:hover:bg-night'
                  } disabled:opacity-50`}
                >
                  {isCurrentPlan ? 'Current plan' : 'Select plan'}
                </button>
              </Card>
            );
          })}
        </div>
      )}

      {confirmedPlan && (
        <div className="rounded-card bg-success-light px-4 py-3 text-sm font-medium text-success-dark">
          You are now subscribed to the {confirmedPlan} plan.
        </div>
      )}

      <ConfirmDialog
        isOpen={pendingTier !== null}
        title="Confirm plan selection"
        message={`Switch to the ${pendingTier?.name} plan, billed ${billingCycle}?`}
        confirmLabel="Confirm"
        onCancel={() => setPendingTier(null)}
        onConfirm={handleConfirmSelection}
      />
    </div>
  );
}

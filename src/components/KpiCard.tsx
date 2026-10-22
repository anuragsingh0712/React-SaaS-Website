import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { KPI } from '../types';
import { Card } from './Card';

interface KpiCardProps {
  kpi: KPI;
  index?: number;
}

const trendConfig = {
  up: { icon: TrendingUp, className: 'text-success-dark' },
  down: { icon: TrendingDown, className: 'text-danger-dark' },
  neutral: { icon: Minus, className: 'text-muted' },
};

export function KpiCard({ kpi, index = 0 }: KpiCardProps): React.ReactElement {
  const trend = trendConfig[kpi.trend];
  const TrendIcon = trend.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
    >
      <Card>
        <p className="text-sm text-muted">{kpi.name}</p>
        <p className="mt-2 text-2xl font-semibold tracking-tight">{kpi.value}</p>
        <div className={`mt-3 inline-flex items-center gap-1 text-xs font-medium ${trend.className}`}>
          <TrendIcon className="h-3.5 w-3.5" />
          {kpi.trendPercentage}% {kpi.trend === 'neutral' ? 'no change' : kpi.trend === 'up' ? 'increase' : 'decrease'}
        </div>
      </Card>
    </motion.div>
  );
}

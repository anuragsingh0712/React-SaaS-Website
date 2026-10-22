export type ThemePreference = 'light' | 'dark';

export type SubscriptionPlanName = 'Starter' | 'Professional' | 'Enterprise';

export type BillingCycle = 'monthly' | 'yearly';

export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  company: string;
  role: UserRole;
  themePreference: ThemePreference;
  notificationsEnabled: boolean;
  subscriptionPlan: SubscriptionPlanName;
  createdAt: string;
  updatedAt: string;
}

export interface AuthToken {
  email: string;
  userId: string;
  role: UserRole;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlanName;
  billingCycle: BillingCycle;
  price: number;
  features: string[];
  startDate: string;
  renewalDate: string;
  status: 'active' | 'cancelled' | 'expired';
}

export interface KPI {
  id: string;
  userId: string;
  name: string;
  value: string;
  trend: 'up' | 'down' | 'neutral';
  trendPercentage: number;
  timestamp: string;
}

export interface Activity {
  id: string;
  userId: string;
  type: string;
  description: string;
  timestamp: string;
}

export interface ChartDataPoint {
  id: string;
  date: string;
  revenue: number;
  activeUsers: number;
  conversionRate: number;
  completedTasks: number;
}

export interface FeatureModule {
  id: string;
  name: 'Analytics' | 'Automation' | 'Collaboration';
  overview: string;
  benefits: string[];
  workflowDescription: string;
  usageStatistics: { label: string; value: string }[];
  sampleInsights: string[];
}

export type ResourceCategory = 'Articles' | 'Tutorials' | 'FAQs' | 'Product Guides';

export interface Resource {
  id: string;
  title: string;
  content: string;
  category: ResourceCategory;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Bookmark {
  id: string;
  userId: string;
  resourceId: string;
  createdAt: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  company: string;
  message: string;
  submittedAt: string;
  status: 'new' | 'read' | 'resolved';
}

export type NotificationType = 'announcement' | 'feature_release' | 'account_update' | 'reminder';

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  dismissedAt: string | null;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  customerName: string;
  customerCompany: string;
  jobTitle: string;
  review: string;
  rating: number;
  businessOutcome: string;
  photoUrl: string;
}

export interface PricingTier {
  id: string;
  name: SubscriptionPlanName;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  highlighted: boolean;
}

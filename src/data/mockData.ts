// MOCK DATA — placeholder records for local development only.
// Replace with real API data before production use.
import type {
  User,
  Subscription,
  KPI,
  Activity,
  ChartDataPoint,
  FeatureModule,
  Resource,
  ContactSubmission,
  AppNotification,
  Testimonial,
  PricingTier,
} from '../types';

export const mockUsers: User[] = [
  {
    id: 'u1',
    email: 'admin@example.com',
    password: 'password123',
    firstName: 'Ava',
    lastName: 'Morgan',
    company: 'Northwind Analytics',
    role: 'admin',
    themePreference: 'light',
    notificationsEnabled: true,
    subscriptionPlan: 'Professional',
    createdAt: '2023-01-10T09:00:00.000Z',
    updatedAt: '2024-05-01T09:00:00.000Z',
  },
  {
    id: 'u2',
    email: 'demo@example.com',
    password: 'password123',
    firstName: 'Jordan',
    lastName: 'Lee',
    company: 'Lee Consulting',
    role: 'user',
    themePreference: 'dark',
    notificationsEnabled: true,
    subscriptionPlan: 'Starter',
    createdAt: '2023-03-20T09:00:00.000Z',
    updatedAt: '2024-05-01T09:00:00.000Z',
  },
];

export const mockSubscriptions: Subscription[] = [
  {
    id: 's1',
    userId: 'u1',
    plan: 'Professional',
    billingCycle: 'monthly',
    price: 79,
    features: ['Unlimited projects', 'Advanced analytics', 'Priority support'],
    startDate: '2024-01-01T00:00:00.000Z',
    renewalDate: '2024-07-01T00:00:00.000Z',
    status: 'active',
  },
  {
    id: 's2',
    userId: 'u2',
    plan: 'Starter',
    billingCycle: 'monthly',
    price: 19,
    features: ['3 projects', 'Basic analytics', 'Email support'],
    startDate: '2024-02-01T00:00:00.000Z',
    renewalDate: '2024-08-01T00:00:00.000Z',
    status: 'active',
  },
];

export const mockKpis: KPI[] = [
  { id: 'k1', userId: 'u1', name: 'Revenue', value: '$128,430', trend: 'up', trendPercentage: 12.4, timestamp: '2024-05-01T00:00:00.000Z' },
  { id: 'k2', userId: 'u1', name: 'Active Customers', value: '3,241', trend: 'up', trendPercentage: 4.1, timestamp: '2024-05-01T00:00:00.000Z' },
  { id: 'k3', userId: 'u1', name: 'Projects', value: '128', trend: 'neutral', trendPercentage: 0, timestamp: '2024-05-01T00:00:00.000Z' },
  { id: 'k4', userId: 'u1', name: 'Engagement Score', value: '87%', trend: 'up', trendPercentage: 2.3, timestamp: '2024-05-01T00:00:00.000Z' },
  { id: 'k5', userId: 'u1', name: 'System Health', value: '99.98%', trend: 'down', trendPercentage: 0.1, timestamp: '2024-05-01T00:00:00.000Z' },
];

export const mockActivities: Activity[] = [
  { id: 'a1', userId: 'u1', type: 'deployment', description: 'Deployed new Analytics module to production', timestamp: '2024-05-01T08:30:00.000Z' },
  { id: 'a2', userId: 'u1', type: 'billing', description: 'Invoice #1042 paid successfully', timestamp: '2024-04-30T14:12:00.000Z' },
  { id: 'a3', userId: 'u1', type: 'team', description: 'Jordan Lee joined the Collaboration workspace', timestamp: '2024-04-29T11:05:00.000Z' },
  { id: 'a4', userId: 'u1', type: 'automation', description: 'Automation "Weekly Report" ran successfully', timestamp: '2024-04-28T06:00:00.000Z' },
  { id: 'a5', userId: 'u1', type: 'alert', description: 'Conversion rate increased by 3.2% this week', timestamp: '2024-04-27T19:45:00.000Z' },
  { id: 'a6', userId: 'u1', type: 'support', description: 'Support ticket #884 resolved', timestamp: '2024-04-26T10:21:00.000Z' },
];

export const mockChartData: ChartDataPoint[] = [
  { id: 'c1', date: 'Mon', revenue: 4200, activeUsers: 240, conversionRate: 3.1, completedTasks: 18 },
  { id: 'c2', date: 'Tue', revenue: 4800, activeUsers: 260, conversionRate: 3.4, completedTasks: 22 },
  { id: 'c3', date: 'Wed', revenue: 4500, activeUsers: 255, conversionRate: 3.0, completedTasks: 20 },
  { id: 'c4', date: 'Thu', revenue: 5300, activeUsers: 290, conversionRate: 3.8, completedTasks: 26 },
  { id: 'c5', date: 'Fri', revenue: 6100, activeUsers: 320, conversionRate: 4.2, completedTasks: 31 },
  { id: 'c6', date: 'Sat', revenue: 5700, activeUsers: 300, conversionRate: 3.9, completedTasks: 24 },
  { id: 'c7', date: 'Sun', revenue: 6400, activeUsers: 340, conversionRate: 4.5, completedTasks: 29 },
];

export const mockFeatureModules: FeatureModule[] = [
  {
    id: 'f1',
    name: 'Analytics',
    overview: 'Turn raw product and business data into actionable insight with real-time dashboards.',
    benefits: ['Real-time KPI tracking', 'Customizable dashboards', 'Automated anomaly detection'],
    workflowDescription: 'Connect your data sources, build dashboards in minutes, and share insights with your team automatically.',
    usageStatistics: [
      { label: 'Dashboards created', value: '1,204' },
      { label: 'Avg. time to insight', value: '3.2 min' },
    ],
    sampleInsights: ['Revenue grew 12% week over week', 'Churn risk flagged for 4 accounts'],
  },
  {
    id: 'f2',
    name: 'Automation',
    overview: 'Automate repetitive business workflows and free your team to focus on high-value work.',
    benefits: ['No-code workflow builder', 'Scheduled triggers', 'Third-party integrations'],
    workflowDescription: 'Design a trigger, add actions, and let the automation engine handle recurring tasks reliably.',
    usageStatistics: [
      { label: 'Workflows active', value: '342' },
      { label: 'Hours saved / month', value: '1,890' },
    ],
    sampleInsights: ['Weekly report automation saved 6 hours this month', '94% of invoices auto-reconciled'],
  },
  {
    id: 'f3',
    name: 'Collaboration',
    overview: 'Keep every team aligned with shared workspaces, comments, and real-time presence.',
    benefits: ['Shared workspaces', 'Inline comments', 'Real-time presence indicators'],
    workflowDescription: 'Invite your team, assign ownership, and track progress together inside a single workspace.',
    usageStatistics: [
      { label: 'Active workspaces', value: '89' },
      { label: 'Comments / week', value: '2,430' },
    ],
    sampleInsights: ['Collaboration workspace adoption up 18%', 'Average response time down to 4 minutes'],
  },
];

export const mockResources: Resource[] = [
  { id: 'r1', title: 'Getting Started with Analytics', content: 'This guide walks you through connecting your first data source, building a dashboard, and sharing it with your team. Start by navigating to the Analytics module and clicking "New Dashboard".', category: 'Articles', description: 'A beginner-friendly introduction to the Analytics module.', createdAt: '2024-01-05T00:00:00.000Z', updatedAt: '2024-01-05T00:00:00.000Z' },
  { id: 'r2', title: 'Building Your First Automation', content: 'Automations let you trigger actions based on events. In this tutorial we build a workflow that sends a weekly summary email every Monday at 9am.', category: 'Tutorials', description: 'Step-by-step tutorial for the Automation module.', createdAt: '2024-01-10T00:00:00.000Z', updatedAt: '2024-01-10T00:00:00.000Z' },
  { id: 'r3', title: 'How do I invite teammates?', content: 'Go to Profile > Team and click "Invite Member". Enter their email address and choose a role. They will receive an email invitation.', category: 'FAQs', description: 'Answers common questions about inviting teammates.', createdAt: '2024-01-12T00:00:00.000Z', updatedAt: '2024-01-12T00:00:00.000Z' },
  { id: 'r4', title: 'Collaboration Workspace Guide', content: 'The Collaboration module centralizes team communication. Create a workspace, add members, and start commenting on shared documents.', category: 'Product Guides', description: 'Complete guide to setting up a Collaboration workspace.', createdAt: '2024-01-15T00:00:00.000Z', updatedAt: '2024-01-15T00:00:00.000Z' },
  { id: 'r5', title: 'Understanding Conversion Rate Metrics', content: 'Conversion rate is calculated as completed actions divided by total visits. Learn how to interpret trends and set realistic targets.', category: 'Articles', description: 'Deep dive into conversion rate metrics and benchmarks.', createdAt: '2024-01-18T00:00:00.000Z', updatedAt: '2024-01-18T00:00:00.000Z' },
  { id: 'r6', title: 'Integrating Third-Party Tools', content: 'Our platform supports integrations with Slack, Zapier, and more. This tutorial covers connecting Slack for automation notifications.', category: 'Tutorials', description: 'Connect external tools to extend your workflows.', createdAt: '2024-01-20T00:00:00.000Z', updatedAt: '2024-01-20T00:00:00.000Z' },
  { id: 'r7', title: 'Billing and Subscription FAQs', content: 'Find answers about billing cycles, upgrading or downgrading plans, and how refunds are handled.', category: 'FAQs', description: 'Everything you need to know about billing.', createdAt: '2024-01-22T00:00:00.000Z', updatedAt: '2024-01-22T00:00:00.000Z' },
  { id: 'r8', title: 'Enterprise Security Overview', content: 'Our Enterprise plan includes SSO, audit logs, and dedicated infrastructure. This guide outlines the security architecture.', category: 'Product Guides', description: 'Security features available on the Enterprise plan.', createdAt: '2024-01-25T00:00:00.000Z', updatedAt: '2024-01-25T00:00:00.000Z' },
  { id: 'r9', title: 'Customizing Your Dashboard', content: 'Drag and drop widgets, resize charts, and save custom views. This article shows advanced dashboard customization options.', category: 'Articles', description: 'Advanced tips for customizing dashboards.', createdAt: '2024-01-28T00:00:00.000Z', updatedAt: '2024-01-28T00:00:00.000Z' },
  { id: 'r10', title: 'Setting Up Notification Preferences', content: 'Control which notifications you receive from Profile > Notification Preferences. Toggle announcements, releases, and reminders individually.', category: 'Tutorials', description: 'Manage your notification preferences.', createdAt: '2024-02-01T00:00:00.000Z', updatedAt: '2024-02-01T00:00:00.000Z' },
  { id: 'r11', title: 'Can I change my plan later?', content: 'Yes, you can upgrade or downgrade your plan at any time from the Pricing page. Changes take effect at the next billing cycle.', category: 'FAQs', description: 'Plan change policy explained.', createdAt: '2024-02-03T00:00:00.000Z', updatedAt: '2024-02-03T00:00:00.000Z' },
  { id: 'r12', title: 'Analytics Module Deep Dive', content: 'A comprehensive guide covering every chart type, filter, and export option available in the Analytics module.', category: 'Product Guides', description: 'The complete reference for the Analytics module.', createdAt: '2024-02-05T00:00:00.000Z', updatedAt: '2024-02-05T00:00:00.000Z' },
];

export const mockContactSubmissions: ContactSubmission[] = [
  { id: 'cs1', name: 'Taylor Brooks', email: 'taylor@brooksco.com', company: 'Brooks & Co', message: 'Interested in the Enterprise plan for our 200-person team.', submittedAt: '2024-04-20T10:00:00.000Z', status: 'new' },
];

export const mockNotifications: AppNotification[] = [
  { id: 'n1', userId: 'u1', type: 'announcement', title: 'New Analytics dashboards are live', message: 'We just shipped customizable dashboards with drag-and-drop widgets.', read: false, dismissedAt: null, createdAt: '2024-05-01T09:00:00.000Z' },
  { id: 'n2', userId: 'u1', type: 'feature_release', title: 'Automation triggers v2 released', message: 'Build more powerful automations with our new conditional triggers.', read: false, dismissedAt: null, createdAt: '2024-04-28T09:00:00.000Z' },
  { id: 'n3', userId: 'u1', type: 'account_update', title: 'Your invoice has been paid', message: 'Invoice #1042 for $79.00 was paid successfully.', read: true, dismissedAt: null, createdAt: '2024-04-25T09:00:00.000Z' },
  { id: 'n4', userId: 'u1', type: 'reminder', title: 'Weekly report due soon', message: 'Your weekly business summary is scheduled to generate tomorrow.', read: false, dismissedAt: null, createdAt: '2024-04-24T09:00:00.000Z' },
  { id: 'n5', userId: 'u1', type: 'account_update', title: 'Profile updated', message: 'Your profile information was updated successfully.', read: true, dismissedAt: null, createdAt: '2024-04-20T09:00:00.000Z' },
];

export const mockTestimonials: Testimonial[] = [
  { id: 't1', customerName: 'Elena Rodriguez', customerCompany: 'Finch Capital', jobTitle: 'VP of Operations', review: 'This platform transformed how we track performance across every team. The dashboards are gorgeous and the automations save us hours every week.', rating: 5, businessOutcome: 'Reduced reporting time by 70%', photoUrl: 'https://i.pravatar.cc/150?img=1' },
  { id: 't2', customerName: 'Marcus Chen', customerCompany: 'Lumen Labs', jobTitle: 'Head of Growth', review: 'The Collaboration module keeps our distributed team perfectly in sync. We would not run our business without it anymore.', rating: 5, businessOutcome: 'Improved team response time by 3x', photoUrl: 'https://i.pravatar.cc/150?img=2' },
  { id: 't3', customerName: 'Priya Natarajan', customerCompany: 'Orbit Systems', jobTitle: 'CFO', review: 'Switching to the Enterprise plan gave us the security and audit logs we needed to pass our compliance review on the first try.', rating: 4, businessOutcome: 'Passed SOC 2 audit on first attempt', photoUrl: 'https://i.pravatar.cc/150?img=3' },
];

export const mockPricingTiers: PricingTier[] = [
  {
    id: 'p1',
    name: 'Starter',
    monthlyPrice: 19,
    yearlyPrice: 182,
    features: ['Up to 3 projects', 'Basic analytics', 'Email support', '1 workspace'],
    highlighted: false,
  },
  {
    id: 'p2',
    name: 'Professional',
    monthlyPrice: 79,
    yearlyPrice: 758,
    features: ['Unlimited projects', 'Advanced analytics', 'Priority support', '5 workspaces', 'Automation workflows'],
    highlighted: true,
  },
  {
    id: 'p3',
    name: 'Enterprise',
    monthlyPrice: 199,
    yearlyPrice: 1910,
    features: ['Unlimited everything', 'Dedicated support', 'SSO & audit logs', 'Custom integrations', 'SLA guarantee'],
    highlighted: false,
  },
];

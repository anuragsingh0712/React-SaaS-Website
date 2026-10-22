export const ROUTES = {
  LOGIN: '/login',
  HOME: '/home',
  DASHBOARD: '/dashboard',
  FEATURES: '/features',
  PRICING: '/pricing',
  RESOURCES: '/resources',
  RESOURCE_DETAIL: (id: string) => `/resources/${id}`,
  CONTACT: '/contact',
  PROFILE: '/profile',
  NOTIFICATIONS: '/notifications',
} as const;

export const DASHBOARD_FILTERS = ['daily', 'weekly', 'monthly'] as const;

export const RESOURCE_CATEGORIES = ['Articles', 'Tutorials', 'FAQs', 'Product Guides'] as const;

export const MIN_PASSWORD_LENGTH = 6;

export const MIN_MESSAGE_LENGTH = 10;

export const YEARLY_DISCOUNT_PERCENT = 20;

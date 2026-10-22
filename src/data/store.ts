import { apiClient } from '../api/client';
import { currentUser, getUsers } from '../auth/auth';
import {
  mockKpis,
  mockActivities,
  mockChartData,
  mockFeatureModules,
  mockResources,
  mockContactSubmissions,
  mockNotifications,
  mockTestimonials,
  mockPricingTiers,
  mockSubscriptions,
} from './mockData';
import type {
  KPI,
  Activity,
  ChartDataPoint,
  FeatureModule,
  Resource,
  Bookmark,
  ContactSubmission,
  AppNotification,
  Testimonial,
  PricingTier,
  Subscription,
  SubscriptionPlanName,
  BillingCycle,
  User,
} from '../types';

function uid(): string {
  return crypto.randomUUID();
}

function currentUserId(): string {
  return currentUser()?.userId ?? 'guest';
}

// ---------------------------------------------------------------------------
// KPIs (read-only dataset)
// MOCK: stands in for GET /home/kpis
function localGetKpis(): KPI[] {
  return mockKpis;
}

export const USE_MOCK_KPIS = true;

export async function getKpis(): Promise<KPI[]> {
  if (USE_MOCK_KPIS) return localGetKpis();
  const res = await apiClient.get('/api/v1/home/kpis');
  return res.data;
}

// ---------------------------------------------------------------------------
// Activities (read-only dataset)
// MOCK: stands in for GET /home/activities
function localGetActivities(): Activity[] {
  return mockActivities;
}

export const USE_MOCK_ACTIVITIES = true;

export async function getActivities(): Promise<Activity[]> {
  if (USE_MOCK_ACTIVITIES) return localGetActivities();
  const res = await apiClient.get('/api/v1/home/activities');
  return res.data;
}

// ---------------------------------------------------------------------------
// Chart data (read-only dataset)
// MOCK: stands in for GET /dashboard/analytics
function localGetChartData(filter: 'daily' | 'weekly' | 'monthly'): ChartDataPoint[] {
  // MOCK: the same weekly series is reused for all filters, scaled slightly,
  // since there is no real backend driving distinct time-range aggregates.
  const multiplier = filter === 'daily' ? 0.3 : filter === 'monthly' ? 4.2 : 1;
  return mockChartData.map((point) => ({
    ...point,
    revenue: Math.round(point.revenue * multiplier),
    activeUsers: Math.round(point.activeUsers * multiplier),
    completedTasks: Math.round(point.completedTasks * multiplier),
  }));
}

export const USE_MOCK_CHART_DATA = true;

export async function getChartData(filter: 'daily' | 'weekly' | 'monthly'): Promise<ChartDataPoint[]> {
  if (USE_MOCK_CHART_DATA) return localGetChartData(filter);
  const res = await apiClient.get('/api/v1/dashboard/analytics', { params: { filter } });
  return res.data;
}

// ---------------------------------------------------------------------------
// Feature modules (read-only dataset)
// MOCK: stands in for GET /features
function localGetFeatureModules(): FeatureModule[] {
  return mockFeatureModules;
}

export const USE_MOCK_FEATURES = true;

export async function getFeatureModules(): Promise<FeatureModule[]> {
  if (USE_MOCK_FEATURES) return localGetFeatureModules();
  const res = await apiClient.get('/api/v1/features');
  return res.data;
}

// ---------------------------------------------------------------------------
// Pricing tiers (read-only dataset)
// MOCK: stands in for GET /pricing/plans
function localGetPricingTiers(): PricingTier[] {
  return mockPricingTiers;
}

export const USE_MOCK_PRICING = true;

export async function getPricingTiers(): Promise<PricingTier[]> {
  if (USE_MOCK_PRICING) return localGetPricingTiers();
  const res = await apiClient.get('/api/v1/pricing/plans');
  return res.data;
}

// ---------------------------------------------------------------------------
// Subscriptions (selectable plan, persisted)
const SUBSCRIPTIONS_KEY = 'subscriptions';

// MOCK: seeds subscriptions from mockData on first load, persisted after.
function loadSubscriptions(): Subscription[] {
  const raw = localStorage.getItem(SUBSCRIPTIONS_KEY);
  if (raw) return JSON.parse(raw);
  localStorage.setItem(SUBSCRIPTIONS_KEY, JSON.stringify(mockSubscriptions));
  return mockSubscriptions;
}

function localGetCurrentSubscription(): Subscription | undefined {
  return loadSubscriptions().find((subscription) => subscription.userId === currentUserId());
}

function localSelectSubscription(plan: SubscriptionPlanName, billingCycle: BillingCycle, price: number, features: string[]): Subscription {
  const all = loadSubscriptions().filter((subscription) => subscription.userId !== currentUserId());
  const subscription: Subscription = {
    id: uid(),
    userId: currentUserId(),
    plan,
    billingCycle,
    price,
    features,
    startDate: new Date().toISOString(),
    renewalDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    status: 'active',
  };
  all.push(subscription);
  localStorage.setItem(SUBSCRIPTIONS_KEY, JSON.stringify(all));
  return subscription;
}

export const USE_MOCK_SUBSCRIPTION = true;

export async function getCurrentSubscription(): Promise<Subscription | undefined> {
  if (USE_MOCK_SUBSCRIPTION) return localGetCurrentSubscription();
  const res = await apiClient.get('/api/v1/subscription/current');
  return res.data;
}

export async function selectSubscription(
  plan: SubscriptionPlanName,
  billingCycle: BillingCycle,
  price: number,
  features: string[],
): Promise<Subscription> {
  if (USE_MOCK_SUBSCRIPTION) return localSelectSubscription(plan, billingCycle, price, features);
  const res = await apiClient.post('/api/v1/subscription/select', { plan, billingCycle, price, features });
  return res.data;
}

// ---------------------------------------------------------------------------
// Resources (read-only catalog)
// MOCK: stands in for GET /resources and GET /resources/:id
function localGetResources(): Resource[] {
  return mockResources;
}

function localGetResource(id: string): Resource | undefined {
  return mockResources.find((resource) => resource.id === id);
}

export const USE_MOCK_RESOURCES = true;

export async function getResources(): Promise<Resource[]> {
  if (USE_MOCK_RESOURCES) return localGetResources();
  const res = await apiClient.get('/api/v1/resources');
  return res.data;
}

export async function getResource(id: string): Promise<Resource | undefined> {
  if (USE_MOCK_RESOURCES) return localGetResource(id);
  const res = await apiClient.get(`/api/v1/resources/${id}`);
  return res.data;
}

// ---------------------------------------------------------------------------
// Bookmarks (user creatable)
const BOOKMARKS_KEY = 'bookmarks';

// MOCK: bookmarks are stored per-browser, seeded empty.
function loadBookmarks(): Bookmark[] {
  const raw = localStorage.getItem(BOOKMARKS_KEY);
  if (raw) return JSON.parse(raw);
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify([]));
  return [];
}

function localGetBookmarks(): Bookmark[] {
  return loadBookmarks().filter((bookmark) => bookmark.userId === currentUserId());
}

function localAddBookmark(resourceId: string): Bookmark {
  const all = loadBookmarks();
  const bookmark: Bookmark = {
    id: uid(),
    userId: currentUserId(),
    resourceId,
    createdAt: new Date().toISOString(),
  };
  all.unshift(bookmark);
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(all));
  return bookmark;
}

function localRemoveBookmark(resourceId: string): void {
  const all = loadBookmarks().filter(
    (bookmark) => !(bookmark.resourceId === resourceId && bookmark.userId === currentUserId()),
  );
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(all));
}

export const USE_MOCK_BOOKMARKS = true;

export async function getBookmarks(): Promise<Bookmark[]> {
  if (USE_MOCK_BOOKMARKS) return localGetBookmarks();
  const res = await apiClient.get('/api/v1/resources/bookmarks');
  return res.data;
}

export async function addBookmark(resourceId: string): Promise<Bookmark> {
  if (USE_MOCK_BOOKMARKS) return localAddBookmark(resourceId);
  const res = await apiClient.post(`/api/v1/resources/${resourceId}/bookmark`);
  return res.data;
}

export async function removeBookmark(resourceId: string): Promise<void> {
  if (USE_MOCK_BOOKMARKS) {
    localRemoveBookmark(resourceId);
    return;
  }
  await apiClient.delete(`/api/v1/resources/${resourceId}/bookmark`);
}

// ---------------------------------------------------------------------------
// Contact submissions (user creatable)
const CONTACT_SUBMISSIONS_KEY = 'contact_submissions';

// MOCK: seeds one sample submission, persists new ones after.
function loadContactSubmissions(): ContactSubmission[] {
  const raw = localStorage.getItem(CONTACT_SUBMISSIONS_KEY);
  if (raw) return JSON.parse(raw);
  localStorage.setItem(CONTACT_SUBMISSIONS_KEY, JSON.stringify(mockContactSubmissions));
  return mockContactSubmissions;
}

function localGetContactSubmissions(): ContactSubmission[] {
  return loadContactSubmissions();
}

function localCreateContactSubmission(
  input: Omit<ContactSubmission, 'id' | 'submittedAt' | 'status'>,
): ContactSubmission {
  const all = loadContactSubmissions();
  const submission: ContactSubmission = {
    ...input,
    id: uid(),
    submittedAt: new Date().toISOString(),
    status: 'new',
  };
  all.unshift(submission);
  localStorage.setItem(CONTACT_SUBMISSIONS_KEY, JSON.stringify(all));
  return submission;
}

export const USE_MOCK_CONTACT = true;

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  if (USE_MOCK_CONTACT) return localGetContactSubmissions();
  const res = await apiClient.get('/api/v1/contact');
  return res.data;
}

export async function createContactSubmission(
  input: Omit<ContactSubmission, 'id' | 'submittedAt' | 'status'>,
): Promise<ContactSubmission> {
  if (USE_MOCK_CONTACT) return localCreateContactSubmission(input);
  const res = await apiClient.post('/api/v1/contact', input);
  return res.data;
}

// ---------------------------------------------------------------------------
// Notifications (read/update/dismiss)
const NOTIFICATIONS_KEY = 'notifications';

// MOCK: seeds notifications from mockData on first load.
function loadNotifications(): AppNotification[] {
  const raw = localStorage.getItem(NOTIFICATIONS_KEY);
  if (raw) return JSON.parse(raw);
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(mockNotifications));
  return mockNotifications;
}

function saveNotifications(notifications: AppNotification[]): void {
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
}

function localGetNotifications(): AppNotification[] {
  return loadNotifications().filter((notification) => !notification.dismissedAt);
}

function localMarkNotificationRead(id: string): void {
  const all = loadNotifications().map((notification) =>
    notification.id === id ? { ...notification, read: true } : notification,
  );
  saveNotifications(all);
}

function localDismissNotification(id: string): void {
  const all = loadNotifications().map((notification) =>
    notification.id === id ? { ...notification, dismissedAt: new Date().toISOString() } : notification,
  );
  saveNotifications(all);
}

function localMarkAllNotificationsRead(): void {
  const all = loadNotifications().map((notification) => ({ ...notification, read: true }));
  saveNotifications(all);
}

export const USE_MOCK_NOTIFICATIONS = true;

export async function getNotifications(): Promise<AppNotification[]> {
  if (USE_MOCK_NOTIFICATIONS) return localGetNotifications();
  const res = await apiClient.get('/api/v1/notifications');
  return res.data;
}

export async function markNotificationRead(id: string): Promise<void> {
  if (USE_MOCK_NOTIFICATIONS) {
    localMarkNotificationRead(id);
    return;
  }
  await apiClient.put(`/api/v1/notifications/${id}/read`);
}

export async function dismissNotification(id: string): Promise<void> {
  if (USE_MOCK_NOTIFICATIONS) {
    localDismissNotification(id);
    return;
  }
  await apiClient.delete(`/api/v1/notifications/${id}`);
}

export async function markAllNotificationsRead(): Promise<void> {
  if (USE_MOCK_NOTIFICATIONS) {
    localMarkAllNotificationsRead();
    return;
  }
  await apiClient.post('/api/v1/notifications/read-all');
}

// ---------------------------------------------------------------------------
// Testimonials (read-only dataset)
// MOCK: stands in for GET /testimonials
function localGetTestimonials(): Testimonial[] {
  return mockTestimonials;
}

export const USE_MOCK_TESTIMONIALS = true;

export async function getTestimonials(): Promise<Testimonial[]> {
  if (USE_MOCK_TESTIMONIALS) return localGetTestimonials();
  const res = await apiClient.get('/api/v1/testimonials');
  return res.data;
}

// ---------------------------------------------------------------------------
// Profile (update)
const PROFILE_UPDATES_KEY = 'profile_updates';

// MOCK: profile edits are stored as an overrides map keyed by userId,
// merged on top of the seeded/signed-up user record.
function loadProfileUpdates(): Record<string, Partial<User>> {
  const raw = localStorage.getItem(PROFILE_UPDATES_KEY);
  return raw ? JSON.parse(raw) : {};
}

function saveProfileUpdates(updates: Record<string, Partial<User>>): void {
  localStorage.setItem(PROFILE_UPDATES_KEY, JSON.stringify(updates));
}

function localGetProfile(): User | undefined {
  const token = currentUser();
  if (!token) return undefined;
  const base = getUsers().find((user) => user.id === token.userId);
  if (!base) return undefined;
  const overrides = loadProfileUpdates()[token.userId] ?? {};
  return { ...base, ...overrides };
}

function localUpdateProfile(patch: Partial<User>): User | undefined {
  const token = currentUser();
  if (!token) return undefined;
  const updates = loadProfileUpdates();
  updates[token.userId] = { ...updates[token.userId], ...patch, updatedAt: new Date().toISOString() };
  saveProfileUpdates(updates);
  return localGetProfile();
}

function localClearApplicationData(): void {
  [
    SUBSCRIPTIONS_KEY,
    BOOKMARKS_KEY,
    CONTACT_SUBMISSIONS_KEY,
    NOTIFICATIONS_KEY,
    PROFILE_UPDATES_KEY,
  ].forEach((key) => localStorage.removeItem(key));
}

export const USE_MOCK_PROFILE = true;

export async function getProfile(): Promise<User | undefined> {
  if (USE_MOCK_PROFILE) return localGetProfile();
  const res = await apiClient.get('/api/v1/profile');
  return res.data;
}

export async function updateProfile(patch: Partial<User>): Promise<User | undefined> {
  if (USE_MOCK_PROFILE) return localUpdateProfile(patch);
  const res = await apiClient.put('/api/v1/profile', patch);
  return res.data;
}

export async function clearApplicationData(): Promise<void> {
  if (USE_MOCK_PROFILE) {
    localClearApplicationData();
    return;
  }
  await apiClient.delete('/api/v1/profile/data');
}

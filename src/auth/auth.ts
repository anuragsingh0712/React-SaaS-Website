import { mockUsers } from '../data/mockData';
import { apiClient } from '../api/client';
import type { AuthToken, User, UserRole } from '../types';

const APP_USERS_KEY = 'app_users';
const AUTH_TOKEN_KEY = 'auth_token';

function getStoredAppUsers(): User[] {
  const raw = localStorage.getItem(APP_USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function getUsers(): User[] {
  return [...mockUsers, ...getStoredAppUsers()];
}

// MOCK: simulates a backend login lookup against seeded + signed-up users.
function localLogin(email: string, password: string): boolean {
  const user = getUsers().find((candidate) => candidate.email === email && candidate.password === password);
  if (!user) {
    return false;
  }
  const token: AuthToken = { email: user.email, userId: user.id, role: user.role };
  localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(token));
  return true;
}

// MOCK: simulates a backend signup creating a new local-only user record.
function localSignup(name: string, email: string, password: string): User {
  const existing = getUsers().find((candidate) => candidate.email === email);
  if (existing) {
    throw new Error('An account with this email already exists.');
  }
  const [firstName, ...rest] = name.trim().split(' ');
  const newUser: User = {
    id: crypto.randomUUID(),
    email,
    password,
    firstName: firstName || name,
    lastName: rest.join(' '),
    company: '',
    role: 'user',
    themePreference: 'light',
    notificationsEnabled: true,
    subscriptionPlan: 'Starter',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const appUsers = getStoredAppUsers();
  appUsers.push(newUser);
  localStorage.setItem(APP_USERS_KEY, JSON.stringify(appUsers));
  const token: AuthToken = { email: newUser.email, userId: newUser.id, role: newUser.role };
  localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(token));
  return newUser;
}

function localLogout(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

// TODO(USE_MOCK): verify path + response shape against the real
// backend's OpenAPI schema before flipping this to false.
export const USE_MOCK = true;

export async function login(email: string, password: string): Promise<boolean> {
  if (USE_MOCK) {
    return localLogin(email, password);
  }
  const res = await apiClient.post('/api/v1/auth/login', { email, password });
  localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(res.data));
  return true;
}

export async function signup(name: string, email: string, password: string): Promise<User> {
  if (USE_MOCK) {
    return localSignup(name, email, password);
  }
  const res = await apiClient.post('/api/v1/auth/signup', { name, email, password });
  localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(res.data));
  return res.data;
}

export async function logout(): Promise<void> {
  if (USE_MOCK) {
    localLogout();
    return;
  }
  await apiClient.post('/api/v1/auth/logout');
  localLogout();
}

export function isAuthenticated(): boolean {
  return localStorage.getItem(AUTH_TOKEN_KEY) !== null;
}

export function currentUser(): AuthToken | null {
  const raw = localStorage.getItem(AUTH_TOKEN_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function currentRole(): UserRole | null {
  return currentUser()?.role ?? null;
}

export function currentFullUser(): User | undefined {
  const token = currentUser();
  if (!token) return undefined;
  return getUsers().find((user) => user.id === token.userId);
}

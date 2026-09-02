import { User } from '../types';

const STORAGE_USERS_KEY = 'plant_pathology_users_v1';
const STORAGE_CURRENT_USER_KEY = 'plant_pathology_session_v1';

// Pre-seeded default demo user for immediate evaluation
const DEFAULT_DEMO_USER: User & { passwordHash: string } = {
  id: 'usr-demo-001',
  email: 'demo@pathology.org',
  name: 'Dr. Evelyn Reed (Pathologist)',
  createdAt: '2026-01-15T08:30:00.000Z',
  passwordHash: 'password123'
};

function getStoredUsers(): (User & { passwordHash: string })[] {
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    if (!raw) {
      const initial = [DEFAULT_DEMO_USER];
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return [DEFAULT_DEMO_USER];
  }
}

function saveUsers(users: (User & { passwordHash: string })[]) {
  try {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to persist users to localStorage', err);
  }
}

export const authService = {
  getCurrentUser(): User | null {
    try {
      const raw = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  async login(email: string, password: string): Promise<User> {
    // Artificial small delay for realistic UX
    await new Promise((resolve) => setTimeout(resolve, 350));

    const cleanEmail = email.trim().toLowerCase();
    const users = getStoredUsers();
    const match = users.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.passwordHash === password
    );

    if (!match) {
      throw new Error('Invalid email or password. Please check your credentials.');
    }

    const sessionUser: User = {
      id: match.id,
      email: match.email,
      name: match.name,
      createdAt: match.createdAt
    };

    localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(sessionUser));
    return sessionUser;
  },

  async register(email: string, password: string, name?: string): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      throw new Error('Please provide a valid email address (e.g., user@domain.com).');
    }

    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters in length.');
    }

    const users = getStoredUsers();
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      throw new Error('An account with this email address already exists. Please log in.');
    }

    const newUser = {
      id: 'usr-' + Math.random().toString(36).substring(2, 9),
      email: cleanEmail,
      name: name?.trim() || cleanEmail.split('@')[0],
      createdAt: new Date().toISOString(),
      passwordHash: password
    };

    users.push(newUser);
    saveUsers(users);

    const sessionUser: User = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      createdAt: newUser.createdAt
    };

    localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(sessionUser));
    return sessionUser;
  },

  logout(): void {
    localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
  }
};

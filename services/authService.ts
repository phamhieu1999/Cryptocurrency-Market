import { User } from '../types';

const MOCK_USER: User = {
  id: 'u_12345',
  email: 'user@example.com',
  name: 'Crypto Investor',
  avatar: 'https://ui-avatars.com/api/?name=Crypto+Investor&background=0D8ABC&color=fff'
};

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock validation: Allow any email/password for demo, except 'error'
        if (password === 'error') {
          reject(new Error('Invalid credentials'));
        } else {
          const user = { ...MOCK_USER, email };
          localStorage.setItem('currentUser', JSON.stringify(user));
          resolve(user);
        }
      }, 800); // Simulate network delay
    });
  },

  register: async (name: string, email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email.includes('error')) {
          reject(new Error('Email already exists'));
        } else {
          const newUser: User = {
            id: `u_${Date.now()}`,
            email,
            name,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff`
          };
          localStorage.setItem('currentUser', JSON.stringify(newUser));
          resolve(newUser);
        }
      }, 1000);
    });
  },

  requestPasswordReset: async (email: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!email.includes('@')) {
           reject(new Error('Invalid email address'));
        } else {
           // Simulate success
           resolve();
        }
      }, 1000);
    });
  },

  logout: async (): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.removeItem('currentUser');
        resolve();
      }, 300);
    });
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null;
  }
};
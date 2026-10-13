'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from './types';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isDemoMode: boolean;
  switchRole: (newRole: UserRole) => void;
  setDemoMode: (enabled: boolean) => void;
  loginAsDemoUser: (role: UserRole) => void;
  login: (email: string, role: UserRole) => void;
  logout: () => void;
}

const DEMO_JOB_SEEKER: User = {
  id: 'user-demo-seeker',
  name: 'Alex Rivera',
  email: 'alex.rivera@example.com',
  role: 'job_seeker',
  isDemo: true,
  title: 'Senior Full-Stack Engineer',
  avatar: 'AR',
};

const DEMO_RECRUITER: User = {
  id: 'user-demo-recruiter',
  name: 'Sarah Jenkins',
  email: 'sarah.jenkins@talentpartners.com',
  role: 'recruiter',
  isDemo: true,
  title: 'Lead Technical Recruiter',
  company: 'TalentPartners Global',
  avatar: 'SJ',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(DEMO_JOB_SEEKER);
  const [role, setRole] = useState<UserRole>('job_seeker');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);

  useEffect(() => {
    // Check localStorage for saved session if any
    const savedUser = localStorage.getItem('sra_user');
    const savedRole = localStorage.getItem('sra_role') as UserRole | null;
    const savedDemo = localStorage.getItem('sra_demo');

    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setRole(parsed.role || 'job_seeker');
        setIsDemoMode(savedDemo !== 'false');
      } catch {
        setUser(DEMO_JOB_SEEKER);
      }
    } else if (savedRole) {
      setRole(savedRole);
      setUser(savedRole === 'recruiter' ? DEMO_RECRUITER : DEMO_JOB_SEEKER);
    }
  }, []);

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
    localStorage.setItem('sra_role', newRole);
    if (newRole === 'recruiter') {
      const u = { ...DEMO_RECRUITER };
      setUser(u);
      localStorage.setItem('sra_user', JSON.stringify(u));
    } else {
      const u = { ...DEMO_JOB_SEEKER };
      setUser(u);
      localStorage.setItem('sra_user', JSON.stringify(u));
    }
  };

  const loginAsDemoUser = (demoRole: UserRole) => {
    setIsDemoMode(true);
    localStorage.setItem('sra_demo', 'true');
    switchRole(demoRole);
  };

  const login = (email: string, userRole: UserRole) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0],
      email,
      role: userRole,
      isDemo: false,
      avatar: email.slice(0, 2).toUpperCase(),
    };
    setUser(newUser);
    setRole(userRole);
    setIsDemoMode(false);
    localStorage.setItem('sra_user', JSON.stringify(newUser));
    localStorage.setItem('sra_role', userRole);
    localStorage.setItem('sra_demo', 'false');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sra_user');
  };

  const setDemoMode = (enabled: boolean) => {
    setIsDemoMode(enabled);
    localStorage.setItem('sra_demo', enabled ? 'true' : 'false');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isDemoMode,
        switchRole,
        setDemoMode,
        loginAsDemoUser,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

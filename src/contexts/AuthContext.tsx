import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  company?: string;
  role: 'student' | 'company_admin';
  createdAt: string;
}

interface StoredUser extends User {
  password: string;
}

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; company?: string; role: 'student' | 'company_admin' }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = 'voice3_users';
const CURRENT_USER_KEY = 'voice3_current_user';

function seedDemoData() {
  try {
    const existing = localStorage.getItem(USERS_KEY);
    const users: StoredUser[] = existing ? JSON.parse(existing) : [];
    if (users.length === 0) {
      const demoUsers: StoredUser[] = [
        { id: 'demo-student', name: 'João Silva', email: 'demo@voice3.pt', password: 'demo123', role: 'student', company: 'Tech Corp', createdAt: '2026-01-01' },
        { id: 'demo-company', name: 'Admin Empresa', email: 'empresa@voice3.pt', password: 'empresa123', role: 'company_admin', company: 'Tech Corp Portugal', createdAt: '2026-01-01' },
      ];
      localStorage.setItem(USERS_KEY, JSON.stringify(demoUsers));

      localStorage.setItem('voice3_company_students_demo-company', JSON.stringify([
        { id: 'cs1', name: 'Ana Costa', email: 'ana@empresa.pt', pack: 'Pro', completedSessions: 7, totalSessions: 10, status: 'Ativa', teacherStatus: 'Marcada' },
        { id: 'cs2', name: 'Pedro Lopes', email: 'pedro@empresa.pt', pack: 'Advanced', completedSessions: 12, totalSessions: 15, status: 'Ativo', teacherStatus: 'Concluída' },
        { id: 'cs3', name: 'Maria Silva', email: 'maria@empresa.pt', pack: 'Starter', completedSessions: 2, totalSessions: 4, status: 'Ativa', teacherStatus: 'Por marcar' },
        { id: 'cs4', name: 'João Mendes', email: 'joao@empresa.pt', pack: 'Pro', completedSessions: 4, totalSessions: 10, status: 'Ativo', teacherStatus: 'Marcada' },
        { id: 'cs5', name: 'Sofia Nunes', email: 'sofia@empresa.pt', pack: 'Pro', completedSessions: 0, totalSessions: 10, status: 'Nova', teacherStatus: '—' },
      ]));

      localStorage.setItem('voice3_sessions_progress_demo-student', JSON.stringify({
        1: { completed: true, score: 92, completedAt: '2026-01-10T10:00:00Z' },
        2: { completed: true, score: 88, completedAt: '2026-01-15T14:00:00Z' },
      }));

      localStorage.setItem('voice3_chat_history_demo-student', JSON.stringify([
        { role: 'bot', text: 'Olá! 👋 Sou o assistente Voice³. Como posso ajudar?', timestamp: '2026-01-10T10:00:00Z' },
      ]));

      localStorage.setItem('voice3_bookings_demo-student', JSON.stringify([
        { id: 'b1', date: '2026-02-20', time: '18:00', duration: '45 min', topic: 'Introdução e avaliação inicial', notes: 'Nível B1 confirmado. Foco em fluência oral.', status: 'past' },
      ]));
    }
  } catch (e) {
    console.error('Error seeding demo data', e);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    seedDemoData();
    try {
      const stored = localStorage.getItem(CURRENT_USER_KEY);
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    } catch (e) {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const stored = localStorage.getItem(USERS_KEY);
      const users: StoredUser[] = stored ? JSON.parse(stored) : [];
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      if (!user) throw new Error('Email ou password incorretos.');
      const { password: _, ...userWithoutPwd } = user;
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPwd));
      setCurrentUser(userWithoutPwd);
    } catch (e) {
      throw e;
    }
  };

  const register = async (data: { name: string; email: string; password: string; company?: string; role: 'student' | 'company_admin' }) => {
    try {
      const stored = localStorage.getItem(USERS_KEY);
      const users: StoredUser[] = stored ? JSON.parse(stored) : [];
      if (users.find(u => u.email.toLowerCase() === data.email.toLowerCase())) {
        throw new Error('Este email já está registado.');
      }
      const newUser: StoredUser = {
        id: `user-${Date.now()}`,
        name: data.name,
        email: data.email,
        password: data.password,
        company: data.company,
        role: data.role,
        createdAt: new Date().toISOString().split('T')[0],
      };
      users.push(newUser);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      const { password: _, ...userWithoutPwd } = newUser;
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPwd));
      setCurrentUser(userWithoutPwd);
    } catch (e) {
      throw e;
    }
  };

  const logout = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    setCurrentUser(null);
  };

  const updateProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updated));
    // also update in users array
    try {
      const stored = localStorage.getItem(USERS_KEY);
      const users: StoredUser[] = stored ? JSON.parse(stored) : [];
      const idx = users.findIndex(u => u.id === currentUser.id);
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...data };
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated: !!currentUser, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;

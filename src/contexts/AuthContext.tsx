import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  company?: string;
  role: 'student' | 'company_admin' | 'professor' | 'admin';
  createdAt: string;
  pack?: string;
  packDetails?: { name: string; sessions: number; teacherLessons: number; price: number };
  timezone?: string;
}

interface StoredUser extends User {
  password: string;
}

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; company?: string; role: 'student' | 'company_admin' | 'professor' | 'admin'; pack?: string; packDetails?: { name: string; sessions: number; teacherLessons: number; price: number } }) => Promise<void>;
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
        { id: 'demo-professor', name: 'Prof. Ana Ferreira', email: 'professor@voice3.pt', password: 'prof123', role: 'professor', company: 'VOICE³', createdAt: '2026-01-01' },
      ];
      localStorage.setItem(USERS_KEY, JSON.stringify(demoUsers));

      localStorage.setItem('voice3_company_students_demo-company', JSON.stringify([
        { id: 'cs1', name: 'Ana Costa', email: 'ana@empresa.pt', pack: 'Pro', completedSessions: 7, totalSessions: 10, status: 'Ativa', teacherStatus: 'Marcada' },
        { id: 'cs2', name: 'Pedro Lopes', email: 'pedro@empresa.pt', pack: 'Advanced', completedSessions: 12, totalSessions: 15, status: 'Ativo', teacherStatus: 'Concluída' },
        { id: 'cs3', name: 'Maria Silva', email: 'maria@empresa.pt', pack: 'Starter', completedSessions: 2, totalSessions: 4, status: 'Ativa', teacherStatus: 'Por marcar' },
        { id: 'cs4', name: 'João Mendes', email: 'joao@empresa.pt', pack: 'Pro', completedSessions: 4, totalSessions: 10, status: 'Ativo', teacherStatus: 'Marcada' },
        { id: 'cs5', name: 'Sofia Nunes', email: 'sofia@empresa.pt', pack: 'Pro', completedSessions: 0, totalSessions: 10, status: 'Nova', teacherStatus: '—' },
      ]));

      // Demo students assigned to professor (including demo student João Silva)
      localStorage.setItem('voice3_professor_students_demo-professor', JSON.stringify([
        { id: 'demo-student', name: 'João Silva', email: 'demo@voice3.pt', pack: 'Pro', completedChapters: 2, totalChapters: 10, nextSession: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], level: 'B2', teachingStyle: 'Intensive' },
        { id: 'cs1', name: 'Ana Costa', email: 'ana@empresa.pt', pack: 'Pro', completedChapters: 3, totalChapters: 10, nextSession: '2026-03-15', level: 'B2', teachingStyle: 'Balanced' },
        { id: 'cs2', name: 'Pedro Lopes', email: 'pedro@empresa.pt', pack: 'Advanced', completedChapters: 6, totalChapters: 10, nextSession: '2026-03-18', level: 'C1', teachingStyle: 'Rigorous' },
        { id: 'cs3', name: 'Maria Silva', email: 'maria@empresa.pt', pack: 'Starter', completedChapters: 1, totalChapters: 10, nextSession: null, level: 'B1', teachingStyle: 'Soft' },
        { id: 'cs4', name: 'João Mendes', email: 'joao@empresa.pt', pack: 'Pro', completedChapters: 2, totalChapters: 10, nextSession: '2026-03-20', level: 'B2', teachingStyle: 'Intensive' },
        { id: 'cs5', name: 'Sofia Nunes', email: 'sofia@empresa.pt', pack: 'Pro', completedChapters: 0, totalChapters: 10, nextSession: null, level: null, teachingStyle: null },
      ]));

      localStorage.setItem('voice3_sessions_progress_demo-student', JSON.stringify({
        1: { completed: true, score: 92, completedAt: '2026-01-10T10:00:00Z' },
        2: { completed: true, score: 88, completedAt: '2026-01-15T14:00:00Z' },
      }));

      // Chapter-level progress for demo student (ch1 completed, ch2 in progress)
      localStorage.setItem('voice3_chapter_progress_demo-student', JSON.stringify({
        ch1: { status: 'completed', completedAt: '2026-01-05T10:00:00Z' },
        ch2: { status: 'in_progress', startedAt: '2026-01-06T10:00:00Z' },
      }));

      // Session progress for demo student using chapter-session IDs
      localStorage.setItem('voice3_session_progress_demo-student', JSON.stringify({
        'ch1-s1': { status: 'completed', score: 100, completedAt: '2026-01-05T10:00:00Z' },
        'ch2-s1': { status: 'completed', score: 92, completedAt: '2026-01-10T10:00:00Z' },
        'ch2-s2': { status: 'completed', score: 88, completedAt: '2026-01-15T14:00:00Z' },
      }));

      // AI evaluation for demo student (diagnostic completed)
      localStorage.setItem('voice3_ai_evaluation_demo-student', JSON.stringify({
        level: 'B2',
        teachingStyle: 'Intensive',
        weakPoints: { 'Filler Words': 7, 'Structuring Ideas': 6, 'Confidence': 5, 'Vocabulary Range': 4, 'Pronunciation': 3 },
        strengths: ['Written Communication', 'Technical Vocabulary', 'Grammar Accuracy'],
        professorFocusPoints: ['Structured responses using PREP Framework', 'Reduce filler words and hesitations', 'Pacing control and strategic pauses'],
        suggestedDrills: ['PREP Framework Drill', 'Filler Word Elimination', '3-Point Message Builder'],
      }));
      localStorage.setItem('voice3_diagnostic_completed_demo-student', JSON.stringify({
        completedAt: '2026-01-05T10:00:00Z',
        level: 'B2',
        teachingStyle: 'Intensive',
      }));

      localStorage.setItem('voice3_chat_history_demo-student', JSON.stringify([
        { role: 'bot', text: 'Olá! 👋 Sou o assistente Voice³. Como posso ajudar?', timestamp: '2026-01-10T10:00:00Z' },
      ]));

      localStorage.setItem('voice3_bookings_demo-student', JSON.stringify([
        { id: 'b1', date: '2026-02-20', time: '18:00', duration: '45 min', topic: 'Introdução e avaliação inicial', notes: 'Nível B1 confirmado. Foco em fluência oral.', status: 'past' },
      ]));

      // Professor assignment for demo student
      localStorage.setItem('voice3_professor_assignment_demo-student', JSON.stringify({
        name: 'Sandra Stuttaford',
        title: 'Executive English Coach',
        professorId: 'demo-professor',
      }));

      // Assignments from professor to demo student
      localStorage.setItem('voice3_student_assignments_demo-student', JSON.stringify([
        {
          id: 'a1',
          title: 'Record yourself in a mock board meeting',
          description: 'Use the PREP framework. Record 2 minutes. Submit the transcript.',
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'pending',
        },
      ]));
    }
  } catch (e) {
    console.error('Error seeding demo data', e);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    seedDemoData();
    try {
      const stored = localStorage.getItem(CURRENT_USER_KEY);
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    } catch (e) {
      localStorage.removeItem(CURRENT_USER_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const stored = localStorage.getItem(USERS_KEY);
    const users: StoredUser[] = stored ? JSON.parse(stored) : [];
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) throw new Error('Email ou password incorretos.');
    const { password: _, ...userWithoutPwd } = user;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPwd));
    setCurrentUser(userWithoutPwd);
  };

  const register = async (data: { name: string; email: string; password: string; company?: string; role: 'student' | 'company_admin' | 'professor' | 'admin'; pack?: string; packDetails?: { name: string; sessions: number; teacherLessons: number; price: number } }) => {
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
      pack: data.pack,
      packDetails: data.packDetails,
    };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    const { password: _, ...userWithoutPwd } = newUser;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPwd));
    setCurrentUser(userWithoutPwd);
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
    <AuthContext.Provider value={{ currentUser, isAuthenticated: !!currentUser, isLoading, login, register, logout, updateProfile }}>
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

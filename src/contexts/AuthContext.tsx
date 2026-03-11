import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Session } from '@supabase/supabase-js';

interface User {
  id: string; name: string; email: string; company?: string;
  role: 'student' | 'company_admin' | 'professor' | 'admin';
  createdAt: string; pack?: string; timezone?: string;
}
interface AuthContextType {
  currentUser: User | null; isAuthenticated: boolean; isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; company?: string; role: 'student' | 'company_admin' | 'professor' | 'admin'; pack?: string; packDetails?: any; }) => Promise<void>;
  logout: () => void; updateProfile: (data: Partial<User>) => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function fetchUserProfile(userId: string, email: string): Promise<User | null> {
  try {
    const [{ data: roleData }, { data: profile }] = await Promise.all([
      supabase.from('user_roles').select('role').eq('user_id', userId).maybeSingle(),
      supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
    ]);
    const rawRole = (roleData?.role as string) || 'student';
    let role: User['role'] = 'student';
    if (rawRole === 'professor') role = 'professor';
    else if (rawRole === 'admin') role = 'admin';
    else if (rawRole === 'company_admin') role = 'company_admin';
    return { id: userId, name: profile?.name || email.split('@')[0] || 'User', email: profile?.email || email, company: profile?.company || undefined, role, createdAt: profile?.created_at || new Date().toISOString(), pack: profile?.pack || undefined, timezone: profile?.timezone || 'Europe/Lisbon' };
  } catch (e) { console.error('Error fetching user profile', e); return null; }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) setCurrentUser(await fetchUserProfile(session.user.id, session.user.email || ''));
      setIsLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event: string, session: Session | null) => {
      if (session?.user) setCurrentUser(await fetchUserProfile(session.user.id, session.user.email || ''));
      else setCurrentUser(null);
      setIsLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error('Email ou password incorretos.');
  };
  const register = async (data: any) => {
    const { data: authData, error } = await supabase.auth.signUp({ email: data.email, password: data.password, options: { data: { name: data.name } } });
    if (error) throw new Error(error.message);
    if (authData.user) {
      await Promise.all([
        supabase.from('profiles').upsert({ id: authData.user.id, name: data.name, email: data.email, company: data.company || null, pack: data.pack || null, timezone: 'Europe/Lisbon' }),
        supabase.from('user_roles').upsert({ user_id: authData.user.id, role: (data.role === 'company_admin' ? 'student' : data.role) as any }),
      ]);
    }
  };
  const logout = async () => { await supabase.auth.signOut(); setCurrentUser(null); };
  const updateProfile = async (data: Partial<User>) => {
    if (!currentUser) return;
    setCurrentUser({ ...currentUser, ...data });
    await supabase.from('profiles').update({ name: data.name, company: data.company, pack: data.pack, timezone: data.timezone }).eq('id', currentUser.id);
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

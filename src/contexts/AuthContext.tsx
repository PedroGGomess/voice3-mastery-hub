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
  register: (data: { name: string; email: string; password: string; company?: string; role: 'student' | 'company_admin' | 'professor' | 'admin'; pack?: string; packDetails?: any; }) => Promise<{ userId: string; email: string; hasSession: boolean }>;
  logout: () => void; updateProfile: (data: Partial<User>) => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Quick user object from session data (no DB calls)
function quickUserFromSession(session: Session): User {
  const meta = session.user.user_metadata || {};
  return {
    id: session.user.id,
    name: meta.name || meta.full_name || session.user.email?.split('@')[0] || 'User',
    email: session.user.email || '',
    role: 'student', // default, will be enriched
    createdAt: session.user.created_at || new Date().toISOString(),
  };
}

// Full profile fetch (runs in background to enrich role/company/pack)
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
    return {
      id: userId,
      name: profile?.name || email.split('@')[0] || 'User',
      email: profile?.email || email,
      company: profile?.company || undefined,
      role,
      createdAt: profile?.created_at || new Date().toISOString(),
      pack: profile?.pack || undefined,
      timezone: profile?.timezone || 'Europe/Lisbon',
    };
  } catch (e) {
    console.error('Error fetching user profile', e);
    return { id: userId, name: email.split('@')[0] || 'User', email, role: 'student', createdAt: new Date().toISOString() };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        // Set a quick user immediately so the app can redirect
        setCurrentUser(quickUserFromSession(session));
        setIsLoading(false);
        clearTimeout(timeout);
        // Then enrich with full profile in background
        const fullUser = await fetchUserProfile(session.user.id, session.user.email || '');
        if (fullUser) setCurrentUser(fullUser);
      } else {
        setIsLoading(false);
        clearTimeout(timeout);
      }
    }).catch(() => {
      setIsLoading(false);
      clearTimeout(timeout);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event: string, session: Session | null) => {
      if (session?.user) {
        // Set quick user immediately for fast redirect
        setCurrentUser(quickUserFromSession(session));
        setIsLoading(false);
        // Enrich in background
        const fullUser = await fetchUserProfile(session.user.id, session.user.email || '');
        if (fullUser) setCurrentUser(fullUser);
      } else {
        setCurrentUser(null);
      }
      setIsLoading(false);
    });
    return () => { subscription.unsubscribe(); clearTimeout(timeout); };
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error('Invalid email or password.');
  };
  const register = async (data: any) => {
    const { data: authData, error } = await supabase.auth.signUp({ email: data.email, password: data.password, options: { data: { name: data.name } } });
    if (error) throw new Error(error.message);
    if (!authData.user) throw new Error('Could not create account.');

    // The handle_new_user trigger creates profile + role automatically.
    // Fire-and-forget upserts for extra fields — don't await to avoid auth lock deadlock.
    if (authData.session) {
      supabase.from('profiles').update({ company: data.company || null, pack: data.pack || null, timezone: 'Europe/Lisbon' }).eq('id', authData.user.id).then(() => {});
    }

    return {
      userId: authData.user.id,
      email: authData.user.email || data.email,
      hasSession: !!authData.session,
    };
  };
  const logout = async () => {
    setCurrentUser(null);
    try {
      await supabase.auth.signOut();
    } catch (_e) {
      // signOut can fail if session is already expired — that's fine
    }
  };
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

-- Chapters table
CREATE TABLE IF NOT EXISTS public.chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number INTEGER UNIQUE NOT NULL,
  title TEXT NOT NULL,
  is_diagnostic BOOLEAN DEFAULT false,
  total_sessions INTEGER DEFAULT 5,
  description TEXT
);

-- Sessions table
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID REFERENCES public.chapters(id),
  number INTEGER NOT NULL,
  title TEXT NOT NULL,
  session_type TEXT,
  duration_minutes INTEGER DEFAULT 25
);

-- Student session progress (score + phases + AI feedback)
CREATE TABLE IF NOT EXISTS public.student_session_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.sessions(id),
  status TEXT DEFAULT 'not_started',
  phase_completed TEXT,
  drill_score INTEGER,
  simulation_submission TEXT,
  simulation_feedback TEXT,
  ai_feedback TEXT,
  score INTEGER,
  completed_at TIMESTAMPTZ,
  last_updated TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, session_id)
);

-- Student chapter progress
CREATE TABLE IF NOT EXISTS public.student_chapter_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES public.chapters(id),
  status TEXT DEFAULT 'locked',
  completed_at TIMESTAMPTZ,
  UNIQUE(student_id, chapter_id)
);

-- AI chat history
CREATE TABLE IF NOT EXISTS public.ai_chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  feature TEXT DEFAULT 'chat',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Toolkit results
CREATE TABLE IF NOT EXISTS public.toolkit_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_type TEXT NOT NULL,
  input_context JSONB,
  ai_response TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Leaderboard points
CREATE TABLE IF NOT EXISTS public.leaderboard_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id),
  points INTEGER NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add role and company_id columns to profiles if not already present
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_id UUID;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- RLS
ALTER TABLE public.student_session_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_chapter_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.toolkit_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard_points ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own_session_progress" ON public.student_session_progress FOR ALL USING (auth.uid() = student_id);
CREATE POLICY "own_chapter_progress" ON public.student_chapter_progress FOR ALL USING (auth.uid() = student_id);
CREATE POLICY "own_chat" ON public.ai_chat_history FOR ALL USING (auth.uid() = student_id);
CREATE POLICY "own_toolkit" ON public.toolkit_results FOR ALL USING (auth.uid() = student_id);
CREATE POLICY "own_points" ON public.leaderboard_points FOR ALL USING (auth.uid() = student_id);

-- Award points function
CREATE OR REPLACE FUNCTION public.award_points(p_student_id UUID, p_points INTEGER, p_reason TEXT)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO public.leaderboard_points (student_id, points, reason) VALUES (p_student_id, p_points, p_reason);
END; $$;

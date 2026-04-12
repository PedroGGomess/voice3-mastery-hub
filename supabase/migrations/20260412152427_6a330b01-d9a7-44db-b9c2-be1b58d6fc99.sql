-- AI Session Reports: detailed per-session AI evaluation
CREATE TABLE public.ai_session_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  session_title TEXT NOT NULL,
  session_type TEXT DEFAULT 'ai_practice',
  grammar_score INTEGER DEFAULT 0,
  vocabulary_score INTEGER DEFAULT 0,
  fluency_score INTEGER DEFAULT 0,
  confidence_score INTEGER DEFAULT 0,
  overall_score INTEGER DEFAULT 0,
  strengths JSONB DEFAULT '[]'::jsonb,
  weaknesses JSONB DEFAULT '[]'::jsonb,
  learning_style_detected TEXT DEFAULT 'balanced',
  recommendations JSONB DEFAULT '[]'::jsonb,
  professor_prep_notes TEXT,
  next_session_suggestions JSONB DEFAULT '[]'::jsonb,
  raw_conversation JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_session_reports ENABLE ROW LEVEL SECURITY;

-- Student can view own reports
CREATE POLICY "Students can view own session reports"
ON public.ai_session_reports FOR SELECT
USING (auth.uid() = student_id);

-- Professors can view reports of their assigned students
CREATE POLICY "Professors can view student session reports"
ON public.ai_session_reports FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM student_professor_assignments
    WHERE student_professor_assignments.professor_id = auth.uid()
    AND student_professor_assignments.student_id = ai_session_reports.student_id
  )
);

-- Service role and admins can manage all
CREATE POLICY "Admins can manage session reports"
ON public.ai_session_reports FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Allow edge function (service role) to insert
CREATE POLICY "Service role can insert session reports"
ON public.ai_session_reports FOR INSERT
WITH CHECK (true);

-- Student Learning Profiles: accumulated learning preferences
CREATE TABLE public.student_learning_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL UNIQUE,
  preferred_learning_style TEXT DEFAULT 'balanced',
  strong_areas JSONB DEFAULT '[]'::jsonb,
  weak_areas JSONB DEFAULT '[]'::jsonb,
  progress_velocity TEXT DEFAULT 'normal',
  total_sessions INTEGER DEFAULT 0,
  avg_score NUMERIC(5,2) DEFAULT 0,
  communication_tone TEXT,
  best_response_format TEXT DEFAULT 'text',
  last_session_at TIMESTAMP WITH TIME ZONE,
  ai_teaching_notes TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.student_learning_profiles ENABLE ROW LEVEL SECURITY;

-- Student can view own profile
CREATE POLICY "Students can view own learning profile"
ON public.student_learning_profiles FOR SELECT
USING (auth.uid() = student_id);

-- Professors can view profiles of their assigned students
CREATE POLICY "Professors can view student learning profiles"
ON public.student_learning_profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM student_professor_assignments
    WHERE student_professor_assignments.professor_id = auth.uid()
    AND student_professor_assignments.student_id = student_learning_profiles.student_id
  )
);

-- Admins can manage all
CREATE POLICY "Admins can manage learning profiles"
ON public.student_learning_profiles FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Service role can upsert
CREATE POLICY "Service role can manage learning profiles"
ON public.student_learning_profiles FOR ALL
USING (true)
WITH CHECK (true);

-- Index for fast lookups
CREATE INDEX idx_ai_session_reports_student ON public.ai_session_reports(student_id);
CREATE INDEX idx_ai_session_reports_created ON public.ai_session_reports(created_at DESC);
CREATE INDEX idx_student_learning_profiles_student ON public.student_learning_profiles(student_id);
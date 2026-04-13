-- ============================================================
-- Student Progress Persistence Tables
-- All student learning data is permanently stored here
-- ============================================================

-- 1. Programme / Chapter / Session Progress
CREATE TABLE IF NOT EXISTS student_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chapter_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  session_type TEXT NOT NULL DEFAULT 'briefing',
  status TEXT NOT NULL DEFAULT 'started' CHECK (status IN ('started', 'in_progress', 'completed')),
  score INTEGER CHECK (score >= 0 AND score <= 100),
  time_spent_seconds INTEGER DEFAULT 0,
  attempts INTEGER DEFAULT 1,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, chapter_id, session_id)
);

-- 2. Error Bank — permanent record of student errors & corrections
CREATE TABLE IF NOT EXISTS student_error_bank (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  error_text TEXT NOT NULL,
  correction TEXT NOT NULL,
  explanation TEXT,
  error_type TEXT NOT NULL DEFAULT 'grammar' CHECK (error_type IN ('grammar', 'vocabulary', 'tone', 'structure', 'pronunciation')),
  source_chapter TEXT,
  source_session TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'mastered')),
  review_count INTEGER DEFAULT 0,
  last_reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Articulation Vault — saved effective phrases
CREATE TABLE IF NOT EXISTS student_vault (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phrase TEXT NOT NULL,
  context TEXT,
  why_effective TEXT,
  category TEXT DEFAULT 'general',
  source_chapter TEXT,
  source_session TEXT,
  is_starred BOOLEAN DEFAULT false,
  times_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Voice DNA History — periodic voice metric snapshots
CREATE TABLE IF NOT EXISTS student_voice_dna (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  clarity_index NUMERIC(5,2),
  words_per_min NUMERIC(5,2),
  active_tone NUMERIC(5,2),
  vocab_range NUMERIC(5,2),
  overall_score NUMERIC(5,2),
  source_session TEXT,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Intake Responses — onboarding answers
CREATE TABLE IF NOT EXISTS student_intake (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  layer TEXT NOT NULL CHECK (layer IN ('essentials', 'context', 'deep_dive')),
  question_key TEXT NOT NULL,
  answer JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, question_key)
);

-- ============================================================
-- Indexes for fast lookups
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_student_progress_user ON student_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_chapter ON student_progress(user_id, chapter_id);
CREATE INDEX IF NOT EXISTS idx_student_error_bank_user ON student_error_bank(user_id);
CREATE INDEX IF NOT EXISTS idx_student_vault_user ON student_vault(user_id);
CREATE INDEX IF NOT EXISTS idx_student_voice_dna_user ON student_voice_dna(user_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_student_intake_user ON student_intake(user_id);

-- ============================================================
-- RLS Policies — students can only see their own data
-- ============================================================
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_error_bank ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_vault ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_voice_dna ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_intake ENABLE ROW LEVEL SECURITY;

-- student_progress policies
CREATE POLICY "Users can view own progress" ON student_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON student_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON student_progress FOR UPDATE USING (auth.uid() = user_id);

-- student_error_bank policies
CREATE POLICY "Users can view own errors" ON student_error_bank FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own errors" ON student_error_bank FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own errors" ON student_error_bank FOR UPDATE USING (auth.uid() = user_id);

-- student_vault policies
CREATE POLICY "Users can view own vault" ON student_vault FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own vault" ON student_vault FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own vault" ON student_vault FOR UPDATE USING (auth.uid() = user_id);

-- student_voice_dna policies
CREATE POLICY "Users can view own voice dna" ON student_voice_dna FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own voice dna" ON student_voice_dna FOR INSERT WITH CHECK (auth.uid() = user_id);

-- student_intake policies
CREATE POLICY "Users can view own intake" ON student_intake FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own intake" ON student_intake FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own intake" ON student_intake FOR UPDATE USING (auth.uid() = user_id);

-- Professors & admins can read student data
CREATE POLICY "Admins can view all progress" ON student_progress FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('professor', 'admin'))
);
CREATE POLICY "Admins can view all errors" ON student_error_bank FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('professor', 'admin'))
);
CREATE POLICY "Admins can view all vault" ON student_vault FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('professor', 'admin'))
);
CREATE POLICY "Admins can view all voice dna" ON student_voice_dna FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('professor', 'admin'))
);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_student_progress_updated_at
  BEFORE UPDATE ON student_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

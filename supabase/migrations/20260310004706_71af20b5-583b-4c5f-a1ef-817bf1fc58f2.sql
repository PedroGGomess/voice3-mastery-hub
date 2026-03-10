
-- Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  company TEXT,
  pack TEXT,
  timezone TEXT DEFAULT 'Europe/Lisbon',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- User roles table (following best practices - separate from profiles)
CREATE TYPE public.app_role AS ENUM ('student', 'professor', 'company_admin', 'admin');

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- AI Evaluations
CREATE TABLE IF NOT EXISTS public.ai_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  level TEXT,
  teaching_style TEXT,
  weak_points JSONB,
  recommended_path JSONB,
  ai_conclusions TEXT,
  professor_focus_points JSONB,
  suggested_drills JSONB,
  raw_responses JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(student_id)
);

ALTER TABLE public.ai_evaluations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students read own evaluations" ON public.ai_evaluations FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students insert own evaluations" ON public.ai_evaluations FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Student-Professor Assignments (relationship)
CREATE TABLE IF NOT EXISTS public.student_professor_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  professor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pack TEXT,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(student_id, professor_id)
);

ALTER TABLE public.student_professor_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Professors read own assignments" ON public.student_professor_assignments FOR SELECT USING (auth.uid() = professor_id);
CREATE POLICY "Students read own assignments" ON public.student_professor_assignments FOR SELECT USING (auth.uid() = student_id);

-- Professor reads assigned student evaluations
CREATE POLICY "Professors read assigned student evaluations" ON public.ai_evaluations FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.student_professor_assignments WHERE professor_id = auth.uid() AND student_id = ai_evaluations.student_id));

-- Professor Availability
CREATE TABLE IF NOT EXISTS public.professor_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  slot_duration_minutes INTEGER DEFAULT 45,
  buffer_minutes INTEGER DEFAULT 0,
  timezone TEXT DEFAULT 'Europe/Lisbon',
  is_active BOOLEAN DEFAULT true
);

ALTER TABLE public.professor_availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read professor availability" ON public.professor_availability FOR SELECT TO authenticated USING (true);
CREATE POLICY "Professors manage own availability" ON public.professor_availability FOR ALL USING (auth.uid() = professor_id);

-- Bookings
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  booked_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed','cancelled','rescheduled','completed')),
  cancellation_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(professor_id, booked_date, start_time)
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students read own bookings" ON public.bookings FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Professors read own bookings" ON public.bookings FOR SELECT USING (auth.uid() = professor_id);
CREATE POLICY "Students can insert bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Professors can update bookings" ON public.bookings FOR UPDATE USING (auth.uid() = professor_id);

-- Professor Notes
CREATE TABLE IF NOT EXISTS public.professor_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  private_notes TEXT,
  action_plan TEXT,
  next_session_focus JSONB DEFAULT '[]',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(professor_id, student_id)
);

ALTER TABLE public.professor_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Professors manage own notes" ON public.professor_notes FOR ALL USING (auth.uid() = professor_id);

-- Assignments (from professor to student)
CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  assignment_type TEXT CHECK (assignment_type IN ('ai_drill','writing','voice_recording','redo_session')),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','in_progress','completed')),
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students read own assignments" ON public.assignments FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Professors manage own assignments" ON public.assignments FOR ALL USING (auth.uid() = professor_id);

-- Book session RPC (anti double-booking)
CREATE OR REPLACE FUNCTION public.book_professor_session(
  p_professor_id UUID, p_student_id UUID,
  p_date DATE, p_start_time TIME, p_end_time TIME
) RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_existing UUID;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext(p_professor_id::text || p_date::text || p_start_time::text));
  SELECT id INTO v_existing FROM public.bookings
  WHERE professor_id = p_professor_id AND booked_date = p_date
    AND start_time = p_start_time AND status = 'confirmed';
  IF v_existing IS NOT NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Slot already booked');
  END IF;
  INSERT INTO public.bookings (professor_id, student_id, booked_date, start_time, end_time)
  VALUES (p_professor_id, p_student_id, p_date, p_start_time, p_end_time);
  RETURN jsonb_build_object('success', true);
END; $$;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', ''));
  -- Default role is student
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student');
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Storage bucket for diagnostic audio
INSERT INTO storage.buckets (id, name, public) VALUES ('diagnostic-audio', 'diagnostic-audio', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Students upload own diagnostic audio" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'diagnostic-audio' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Students read own diagnostic audio" ON storage.objects FOR SELECT
  USING (bucket_id = 'diagnostic-audio' AND (storage.foldername(name))[1] = auth.uid()::text);


CREATE OR REPLACE FUNCTION public.book_professor_session(
  p_professor_id UUID, p_student_id UUID,
  p_date DATE, p_start_time TIME, p_end_time TIME
) RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
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

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', ''));
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student');
  RETURN NEW;
END;
$$;

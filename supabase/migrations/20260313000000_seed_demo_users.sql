-- Seed demo users for testing/development
-- These match the demo accounts shown in the login page:
--   demo@voice3.pt      / demo123      (student)
--   professor@voice3.pt / prof123      (professor)
--   empresa@voice3.pt   / empresa123   (company_admin)
--   admin@voice3.pt     / admin123     (admin)

DO $$
DECLARE
  demo_id      UUID := 'bc3a8501-b9dd-48c0-98b9-d0e196b2ce62';
  prof_id      UUID := '5c36230e-bff6-45c4-b8f2-7bb75a401c03';
  empresa_id   UUID := '0d21a501-f4b4-4e37-9fd8-788c5ac1d91c';
  admin_id     UUID := '1e665b38-b2ae-494a-b0fd-d175434e1b72';
BEGIN

  -- Insert into auth.users (only if not already present)
  INSERT INTO auth.users (
    instance_id, id, aud, role,
    email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin
  ) VALUES
  (
    '00000000-0000-0000-0000-000000000000', demo_id, 'authenticated', 'authenticated',
    'demo@voice3.pt', '$2b$10$wkdCqzHDUKieZEmy7uZe7uwMhZ6aMyO7fE2upzrI2.S2Lhigo2nmm',
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{"name":"Demo Student"}',
    false
  ),
  (
    '00000000-0000-0000-0000-000000000000', prof_id, 'authenticated', 'authenticated',
    'professor@voice3.pt', '$2b$10$DxSKBumzdAIEILHGTnfE4.QSfvjFoNEgPBMeEKbHdZJqOyR2njKrO',
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{"name":"Demo Professor"}',
    false
  ),
  (
    '00000000-0000-0000-0000-000000000000', empresa_id, 'authenticated', 'authenticated',
    'empresa@voice3.pt', '$2b$10$y6SmVKwDsWS3ws20iLcBtuHKciB5FvSjMih2fbRNKlzw8ftyKDRYm',
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{"name":"Demo Company"}',
    false
  ),
  (
    '00000000-0000-0000-0000-000000000000', admin_id, 'authenticated', 'authenticated',
    'admin@voice3.pt', '$2b$10$p1RX8ooRGq/h3uy9RxpNOOm4EiednITdRkfmlZq2wxylEfGKFuDgG',
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{"name":"Demo Admin"}',
    false
  )
  ON CONFLICT DO NOTHING;

  -- Upsert profiles
  INSERT INTO public.profiles (id, email, name, timezone) VALUES
    (demo_id,    'demo@voice3.pt',      'Demo Student',  'Europe/Lisbon'),
    (prof_id,    'professor@voice3.pt', 'Demo Professor','Europe/Lisbon'),
    (empresa_id, 'empresa@voice3.pt',   'Demo Company',  'Europe/Lisbon'),
    (admin_id,   'admin@voice3.pt',     'Demo Admin',    'Europe/Lisbon')
  ON CONFLICT (id) DO NOTHING;

  -- Ensure correct roles: for non-student accounts, remove the trigger-created
  -- default 'student' role before inserting the intended role.
  DELETE FROM public.user_roles
    WHERE (user_id = prof_id    AND role = 'student')
       OR (user_id = empresa_id AND role = 'student')
       OR (user_id = admin_id   AND role = 'student');
  INSERT INTO public.user_roles (user_id, role) VALUES
    (demo_id,    'student'),
    (prof_id,    'professor'),
    (empresa_id, 'company_admin'),
    (admin_id,   'admin')
  ON CONFLICT (user_id, role) DO NOTHING;

END $$;

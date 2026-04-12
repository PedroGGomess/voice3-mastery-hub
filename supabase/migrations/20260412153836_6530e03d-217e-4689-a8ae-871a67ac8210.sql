-- Create profile for ana@voice3.pt (professor)
INSERT INTO public.profiles (id, email, name, timezone)
VALUES ('ce451bcb-b918-4e1f-bf72-c6d096d9f5c7', 'ana@voice3.pt', 'Ana Silva', 'Europe/Lisbon')
ON CONFLICT (id) DO NOTHING;

-- Assign professor role
INSERT INTO public.user_roles (user_id, role)
VALUES ('ce451bcb-b918-4e1f-bf72-c6d096d9f5c7', 'professor')
ON CONFLICT (user_id, role) DO NOTHING;
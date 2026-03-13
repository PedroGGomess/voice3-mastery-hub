-- Reset demo user password to 'demo123'
-- Using Supabase's built-in password update
UPDATE auth.users 
SET encrypted_password = crypt('demo123', gen_salt('bf'))
WHERE email = 'demo@voice3.pt';
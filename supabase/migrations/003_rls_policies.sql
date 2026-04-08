-- Enable RLS on both tables
alter table hera_conversations enable row level security;
alter table hera_usage enable row level security;

-- Service role (used by Edge Functions and dashboard backend) bypasses RLS automatically.
-- Anon role gets NO access — all data flows through service role on server side.

-- Block anon from reading/writing conversations
create policy "No anon access to conversations"
  on hera_conversations
  for all
  to anon
  using (false);

-- Block anon from reading/writing usage
create policy "No anon access to usage"
  on hera_usage
  for all
  to anon
  using (false);

-- Authenticated users can read conversations for their brand (or all if admin)
create policy "Authenticated users read own brand conversations"
  on hera_conversations
  for select
  to authenticated
  using (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'brand' = brand
    or (auth.jwt() ->> 'user_metadata')::jsonb ->> 'brand' is null
    or (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
  );

-- Authenticated users can update conversations for their brand
create policy "Authenticated users update own brand conversations"
  on hera_conversations
  for update
  to authenticated
  using (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'brand' = brand
    or (auth.jwt() ->> 'user_metadata')::jsonb ->> 'brand' is null
    or (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
  );

-- Authenticated users can read usage for their brand
create policy "Authenticated users read own brand usage"
  on hera_usage
  for select
  to authenticated
  using (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'brand' = brand
    or (auth.jwt() ->> 'user_metadata')::jsonb ->> 'brand' is null
    or (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
  );

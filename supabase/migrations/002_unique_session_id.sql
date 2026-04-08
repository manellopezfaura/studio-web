-- Add unique constraint on session_id for proper upsert behavior
alter table hera_conversations
  add constraint hera_conversations_session_id_key unique (session_id);

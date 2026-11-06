create extension if not exists pgcrypto;
create extension if not exists btree_gist;

do $$ begin
  create type public.booking_status as enum ('PENDING', 'CONFIRMED', 'REJECTED', 'RESCHEDULED', 'CANCELLED', 'COMPLETED', 'NO_SHOW');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.approval_mode as enum ('AUTO_CONFIRM', 'MANUAL_APPROVAL');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.video_mode as enum ('GOOGLE_MEET', 'MANUAL');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.override_kind as enum ('BLOCKED', 'VACATION', 'CUSTOM');
exception when duplicate_object then null; end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.meeting_types (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null,
  duration_minutes integer not null check (duration_minutes between 15 and 180),
  min_duration_minutes integer not null check (min_duration_minutes between 15 and 180),
  max_duration_minutes integer not null check (max_duration_minutes between min_duration_minutes and 180),
  approval_mode public.approval_mode not null default 'MANUAL_APPROVAL',
  video_mode public.video_mode not null default 'GOOGLE_MEET',
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.availability_rules (
  id uuid primary key default gen_random_uuid(),
  weekday smallint not null check (weekday between 0 and 6),
  start_local time not null,
  end_local time not null,
  timezone text not null default 'Asia/Kolkata',
  slot_interval_minutes integer not null default 30 check (slot_interval_minutes between 5 and 180),
  buffer_before_minutes integer not null default 15 check (buffer_before_minutes between 0 and 180),
  buffer_after_minutes integer not null default 15 check (buffer_after_minutes between 0 and 180),
  active boolean not null default true,
  check (end_local > start_local)
);

create table if not exists public.availability_overrides (
  id uuid primary key default gen_random_uuid(),
  kind public.override_kind not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  reason text not null default '',
  created_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create table if not exists public.meeting_bookings (
  id uuid primary key default gen_random_uuid(),
  booking_reference text not null unique default ('AB-' || upper(substr(encode(gen_random_bytes(5), 'hex'), 1, 10))),
  meeting_type_id uuid not null references public.meeting_types(id),
  visitor_name text not null check (length(visitor_name) between 2 and 120),
  visitor_email text not null check (length(visitor_email) between 5 and 320),
  visitor_company text not null check (length(visitor_company) between 2 and 160),
  visitor_role text not null check (length(visitor_role) between 2 and 160),
  visitor_phone text,
  visitor_linkedin text,
  meeting_purpose text not null check (length(meeting_purpose) between 2 and 160),
  additional_message text not null default '' check (length(additional_message) <= 5000),
  start_time_utc timestamptz not null,
  end_time_utc timestamptz not null,
  buffered_start_utc timestamptz not null,
  buffered_end_utc timestamptz not null,
  visitor_timezone text not null,
  meeting_timezone text not null,
  duration_minutes integer not null check (duration_minutes between 15 and 180),
  status public.booking_status not null default 'PENDING',
  approval_mode public.approval_mode not null,
  google_calendar_event_id text,
  google_meet_link text,
  reschedule_token_hash text unique,
  reschedule_token_expires_at timestamptz,
  cancel_token_hash text unique,
  cancel_token_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_time_utc > start_time_utc),
  check (buffered_end_utc > buffered_start_utc)
);

alter table public.meeting_bookings drop constraint if exists meeting_bookings_no_overlap;
alter table public.meeting_bookings add constraint meeting_bookings_no_overlap exclude using gist (
  tstzrange(buffered_start_utc, buffered_end_utc, '[)') with &&
) where (status in ('PENDING', 'CONFIRMED', 'RESCHEDULED'));

create table if not exists public.booking_reservations (
  id uuid primary key default gen_random_uuid(),
  reservation_token_hash text not null unique,
  meeting_type_id uuid not null references public.meeting_types(id),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  buffered_start_utc timestamptz not null,
  buffered_end_utc timestamptz not null,
  visitor_timezone text not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

alter table public.booking_reservations drop constraint if exists booking_reservations_no_overlap;
alter table public.booking_reservations add constraint booking_reservations_no_overlap exclude using gist (
  tstzrange(buffered_start_utc, buffered_end_utc, '[)') with &&
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(name) between 2 and 120),
  email text not null check (length(email) between 5 and 320),
  company text not null check (length(company) between 2 and 160),
  subject text not null check (length(subject) between 2 and 160),
  message text not null check (length(message) between 10 and 5000),
  status text not null default 'NEW' check (status in ('NEW', 'READ', 'ARCHIVED')),
  is_priority boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.calendar_connections (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'google',
  calendar_id text not null,
  timezone text not null default 'Asia/Kolkata',
  active boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.meeting_reminders (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.meeting_bookings(id) on delete cascade,
  reminder_kind text not null check (reminder_kind in ('24_HOURS', '1_HOUR')),
  scheduled_for timestamptz not null,
  sent_at timestamptz,
  unique (booking_id, reminder_kind)
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  target_type text not null,
  target_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.rate_limits (
  key_hash text not null,
  action text not null,
  window_started_at timestamptz not null,
  attempts integer not null default 0,
  primary key (key_hash, action, window_started_at)
);

create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
drop trigger if exists meeting_types_updated_at on public.meeting_types;
create trigger meeting_types_updated_at before update on public.meeting_types for each row execute function public.set_updated_at();
drop trigger if exists meeting_bookings_updated_at on public.meeting_bookings;
create trigger meeting_bookings_updated_at before update on public.meeting_bookings for each row execute function public.set_updated_at();
drop trigger if exists contact_messages_updated_at on public.contact_messages;
create trigger contact_messages_updated_at before update on public.contact_messages for each row execute function public.set_updated_at();

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.profiles where id = auth.uid() and is_admin = true);
$$;

create or replace function public.reserve_booking_slot(
  p_token_hash text,
  p_meeting_type_id uuid,
  p_starts_at timestamptz,
  p_ends_at timestamptz,
  p_buffered_start timestamptz,
  p_buffered_end timestamptz,
  p_visitor_timezone text,
  p_expires_at timestamptz
) returns jsonb language plpgsql security definer set search_path = public as $$
declare reservation_id uuid;
begin
  perform pg_advisory_xact_lock(hashtextextended('portfolio-booking', 0));
  delete from public.booking_reservations where expires_at <= now();
  if exists (select 1 from public.booking_reservations where expires_at > now() and tstzrange(buffered_start_utc, buffered_end_utc, '[)') && tstzrange(p_buffered_start, p_buffered_end, '[)')) then
    raise exception 'SLOT_UNAVAILABLE';
  end if;
  if exists (select 1 from public.meeting_bookings where status in ('PENDING', 'CONFIRMED', 'RESCHEDULED') and tstzrange(buffered_start_utc, buffered_end_utc, '[)') && tstzrange(p_buffered_start, p_buffered_end, '[)')) then
    raise exception 'SLOT_UNAVAILABLE';
  end if;
  insert into public.booking_reservations(reservation_token_hash, meeting_type_id, starts_at, ends_at, buffered_start_utc, buffered_end_utc, visitor_timezone, expires_at)
  values (p_token_hash, p_meeting_type_id, p_starts_at, p_ends_at, p_buffered_start, p_buffered_end, p_visitor_timezone, p_expires_at)
  returning id into reservation_id;
  return jsonb_build_object('id', reservation_id, 'expires_at', p_expires_at);
exception when exclusion_violation then
  raise exception 'SLOT_UNAVAILABLE';
end;
$$;

create or replace function public.consume_booking_reservation(
  p_token_hash text,
  p_meeting_type_id uuid,
  p_visitor_name text,
  p_visitor_email text,
  p_visitor_company text,
  p_visitor_role text,
  p_visitor_phone text,
  p_visitor_linkedin text,
  p_meeting_purpose text,
  p_additional_message text,
  p_visitor_timezone text,
  p_duration_minutes integer,
  p_approval_mode public.approval_mode,
  p_reschedule_token_hash text,
  p_cancel_token_hash text
) returns public.meeting_bookings language plpgsql security definer set search_path = public as $$
declare r public.booking_reservations; b public.meeting_bookings;
begin
  perform pg_advisory_xact_lock(hashtextextended('portfolio-booking', 0));
  delete from public.booking_reservations where expires_at <= now();
  select * into r from public.booking_reservations where reservation_token_hash = p_token_hash for update;
  if r.id is null or r.expires_at <= now() or r.meeting_type_id <> p_meeting_type_id then raise exception 'RESERVATION_EXPIRED'; end if;
  insert into public.meeting_bookings(meeting_type_id, visitor_name, visitor_email, visitor_company, visitor_role, visitor_phone, visitor_linkedin, meeting_purpose, additional_message, start_time_utc, end_time_utc, buffered_start_utc, buffered_end_utc, visitor_timezone, meeting_timezone, duration_minutes, status, approval_mode, reschedule_token_hash, reschedule_token_expires_at, cancel_token_hash, cancel_token_expires_at)
  values (p_meeting_type_id, p_visitor_name, lower(p_visitor_email), p_visitor_company, p_visitor_role, p_visitor_phone, p_visitor_linkedin, p_meeting_purpose, p_additional_message, r.starts_at, r.ends_at, r.buffered_start_utc, r.buffered_end_utc, p_visitor_timezone, p_visitor_timezone, p_duration_minutes, case when p_approval_mode = 'AUTO_CONFIRM' then 'CONFIRMED' else 'PENDING' end, p_approval_mode, p_reschedule_token_hash, now() + interval '30 days', p_cancel_token_hash, now() + interval '30 days') returning * into b;
  delete from public.booking_reservations where id = r.id;
  return b;
exception when exclusion_violation then raise exception 'SLOT_UNAVAILABLE';
end;
$$;

insert into public.meeting_types(slug, name, description, duration_minutes, min_duration_minutes, max_duration_minutes, approval_mode, video_mode, sort_order)
values
('job-interview', 'Job Interview', 'Professional interview for cybersecurity, DFIR, SOC, incident response, or security engineering roles.', 45, 45, 45, 'AUTO_CONFIRM', 'GOOGLE_MEET', 1),
('recruiter-discussion', 'Recruiter Discussion', 'Discuss job opportunities, roles, hiring requirements, and professional background.', 30, 30, 30, 'AUTO_CONFIRM', 'GOOGLE_MEET', 2),
('technical-interview', 'Technical Interview', 'Technical discussion regarding DFIR, incident response, SOC operations, SIEM engineering, or threat detection.', 60, 60, 60, 'MANUAL_APPROVAL', 'GOOGLE_MEET', 3),
('cybersecurity-consultation', 'Cybersecurity Consultation', 'Professional discussion regarding cybersecurity operations, SIEM, detection engineering, DFIR, automation, or security architecture.', 60, 60, 60, 'MANUAL_APPROVAL', 'GOOGLE_MEET', 4),
('quick-introduction', 'Quick Introduction', 'Short introductory conversation.', 15, 15, 15, 'AUTO_CONFIRM', 'GOOGLE_MEET', 5),
('custom-meeting', 'Custom Meeting', 'For other professional discussions.', 30, 15, 90, 'MANUAL_APPROVAL', 'MANUAL', 6)
on conflict (slug) do nothing;

insert into public.availability_rules(weekday, start_local, end_local, timezone, slot_interval_minutes, buffer_before_minutes, buffer_after_minutes)
select weekday, '10:00'::time, '19:00'::time, 'Asia/Kolkata', 30, 15, 15 from generate_series(1, 5) as weekday
where not exists (select 1 from public.availability_rules);

alter table public.profiles enable row level security;
alter table public.meeting_types enable row level security;
alter table public.availability_rules enable row level security;
alter table public.availability_overrides enable row level security;
alter table public.meeting_bookings enable row level security;
alter table public.booking_reservations enable row level security;
alter table public.contact_messages enable row level security;
alter table public.calendar_connections enable row level security;
alter table public.meeting_reminders enable row level security;
alter table public.audit_logs enable row level security;
alter table public.rate_limits enable row level security;

create policy profiles_admin_all on public.profiles for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy meeting_types_admin_all on public.meeting_types for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy availability_rules_admin_all on public.availability_rules for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy availability_overrides_admin_all on public.availability_overrides for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy meeting_bookings_admin_all on public.meeting_bookings for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy booking_reservations_admin_all on public.booking_reservations for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy contact_messages_admin_all on public.contact_messages for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy calendar_connections_admin_all on public.calendar_connections for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy meeting_reminders_admin_all on public.meeting_reminders for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy audit_logs_admin_all on public.audit_logs for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy rate_limits_admin_all on public.rate_limits for all to authenticated using (public.is_admin()) with check (public.is_admin());

grant execute on function public.reserve_booking_slot(text, uuid, timestamptz, timestamptz, timestamptz, timestamptz, text, timestamptz) to anon, authenticated;
grant execute on function public.consume_booking_reservation(text, uuid, text, text, text, text, text, text, text, text, text, integer, public.approval_mode, text, text) to anon, authenticated;

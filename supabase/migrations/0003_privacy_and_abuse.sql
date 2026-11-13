-- Data protection and abuse limits.

-- Consent: nobody gets a profile without accepting the terms and privacy policy.
alter table public.profiles add column if not exists accepted_terms_at timestamptz;
update public.profiles set accepted_terms_at = created_at where accepted_terms_at is null;
alter table public.profiles alter column accepted_terms_at set not null;
grant insert (accepted_terms_at) on public.profiles to authenticated;

-- Chat flood limit: 20 messages a minute per person.
create or replace function public.limit_message_rate() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from messages
       where sender = new.sender and created_at > now() - interval '1 minute') >= 20 then
    raise exception 'slow_down';
  end if;
  return new;
end $$;

drop trigger if exists messages_rate on public.messages;
create trigger messages_rate before insert on public.messages
for each row execute function public.limit_message_rate();

-- Report limit: 10 a day per person, so the reports list cannot be flooded.
create or replace function public.report_user(p_user uuid, p_reason text, p_details text default '')
returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'not_signed_in'; end if;
  if p_user = auth.uid() then raise exception 'cannot_report_self'; end if;
  if (select count(*) from reports
       where reporter = auth.uid() and created_at > now() - interval '1 day') >= 10 then
    raise exception 'slow_down';
  end if;
  insert into reports (reporter, reported, reason, details)
  values (auth.uid(), p_user, p_reason, coalesce(p_details, ''));
end $$;

-- Everything Tukate holds about the signed-in person, in one file.
-- Supports the right of access under Kenya's Data Protection Act.
create or replace function public.export_my_data() returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare me uuid := auth.uid();
begin
  if me is null then raise exception 'not_signed_in'; end if;
  return jsonb_build_object(
    'exported_at', now(),
    'profile', (select to_jsonb(p) from profiles p where p.id = me),
    'swipes_i_made', coalesce((select jsonb_agg(jsonb_build_object(
        'direction', s.direction, 'at', s.created_at) order by s.created_at)
        from swipes s where s.swiper = me), '[]'::jsonb),
    'matches', coalesce((select jsonb_agg(jsonb_build_object(
        'match_id', m.id, 'matched_at', m.created_at) order by m.created_at)
        from matches m where me in (m.user_a, m.user_b)), '[]'::jsonb),
    'messages_i_sent', coalesce((select jsonb_agg(jsonb_build_object(
        'match_id', g.match_id, 'body', g.body, 'at', g.created_at) order by g.created_at)
        from messages g where g.sender = me), '[]'::jsonb),
    'people_i_blocked', (select count(*) from blocks b where b.blocker = me),
    'reports_i_made', coalesce((select jsonb_agg(jsonb_build_object(
        'reason', r.reason, 'details', r.details, 'at', r.created_at) order by r.created_at)
        from reports r where r.reporter = me), '[]'::jsonb)
  );
end $$;

revoke all on function public.export_my_data() from public, anon;
grant execute on function public.export_my_data() to authenticated;
revoke all on function public.limit_message_rate() from public, anon, authenticated;

-- Enquiries from the website's "For venues" form. Written only by the website's
-- server; nobody using the app can read or write this table.
create table if not exists public.venue_enquiries (
  id bigint generated always as identity primary key,
  venue text not null check (char_length(venue) between 1 and 120),
  area text not null check (char_length(area) between 1 and 80),
  contact text not null check (char_length(contact) between 1 and 120),
  phone text not null check (char_length(phone) between 9 and 20),
  notes text not null default '' check (char_length(notes) <= 1000),
  created_at timestamptz not null default now()
);
alter table public.venue_enquiries enable row level security;
revoke all on public.venue_enquiries from anon, authenticated;

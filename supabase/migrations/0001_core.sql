-- Tukate core schema.
-- Rules that matter are enforced here, in the database, not in the app:
--   * 18+ only
--   * free accounts get 3 swipes a day and no filters
--   * people only ever see the safe parts of someone else's profile
--   * only the payment system can make an account Plus

-- ---------------------------------------------------------------- lists
create table if not exists public.areas (
  name text primary key,
  lat double precision not null,
  lng double precision not null
);

insert into public.areas (name, lat, lng) values
  ('Kilimani', -1.2921, 36.7856),
  ('Westlands', -1.2676, 36.8108),
  ('Kileleshwa', -1.2797, 36.7806),
  ('CBD', -1.2864, 36.8172),
  ('Lavington', -1.2789, 36.7689),
  ('Karen', -1.3197, 36.7073),
  ('South B', -1.3106, 36.8361),
  ('South C', -1.3186, 36.8262),
  ('Langata', -1.3378, 36.7594),
  ('Ngong Road', -1.3003, 36.7741),
  ('Parklands', -1.2620, 36.8176),
  ('Roysambu', -1.2186, 36.8869)
on conflict (name) do nothing;

-- ------------------------------------------------------------- profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 30),
  birth_date date not null,
  base text not null references public.areas (name),
  kinywaji text not null check (char_length(kinywaji) between 2 and 40),
  drink_type text not null check (drink_type in
    ('beer', 'cider', 'whisky', 'vodka', 'gin', 'rum', 'wine', 'cocktails', 'no_alcohol')),
  drinking_type text not null check (drinking_type in ('one_or_two', 'social', 'all_night')),
  party_style text not null check (party_style in
    ('quiet_local', 'rooftop', 'nyama_choma', 'live_music', 'club', 'house_party')),
  bio text not null default '' check (char_length(bio) <= 160),
  photo_path text,
  lat double precision,
  lng double precision,
  located_at timestamptz,
  plan text not null default 'free' check (plan in ('free', 'plus')),
  plan_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint adults_only check (birth_date <= (created_at at time zone 'Africa/Nairobi')::date - interval '18 years')
);

create table if not exists public.swipes (
  swiper uuid not null references public.profiles (id) on delete cascade,
  target uuid not null references public.profiles (id) on delete cascade,
  direction text not null check (direction in ('pass', 'cheers', 'super')),
  created_at timestamptz not null default now(),
  primary key (swiper, target),
  check (swiper <> target)
);
create index if not exists swipes_swiper_day on public.swipes (swiper, created_at);
create index if not exists swipes_target on public.swipes (target, direction);

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  user_a uuid not null references public.profiles (id) on delete cascade,
  user_b uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_a, user_b),
  check (user_a < user_b)
);
create index if not exists matches_b on public.matches (user_b);

create table if not exists public.messages (
  id bigint generated always as identity primary key,
  match_id uuid not null references public.matches (id) on delete cascade,
  sender uuid not null references public.profiles (id) on delete cascade,
  body text not null check (char_length(body) between 1 and 1000),
  created_at timestamptz not null default now()
);
create index if not exists messages_match on public.messages (match_id, created_at);

create table if not exists public.blocks (
  blocker uuid not null references public.profiles (id) on delete cascade,
  blocked uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker, blocked),
  check (blocker <> blocked)
);

create table if not exists public.reports (
  id bigint generated always as identity primary key,
  reporter uuid not null references public.profiles (id) on delete cascade,
  reported uuid not null references public.profiles (id) on delete cascade,
  reason text not null check (reason in ('harassment', 'fake_profile', 'underage', 'unsafe_meetup', 'other')),
  details text not null default '' check (char_length(details) <= 1000),
  created_at timestamptz not null default now()
);

-- -------------------------------------------------------------- helpers
create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists profiles_touch on public.profiles;
create trigger profiles_touch before update on public.profiles
for each row execute function public.touch_updated_at();

create or replace function public.nairobi_day_start() returns timestamptz
language sql stable as $$
  select date_trunc('day', now() at time zone 'Africa/Nairobi') at time zone 'Africa/Nairobi'
$$;

create or replace function public.is_plus(p_user uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from profiles
    where id = p_user and plan = 'plus' and (plan_until is null or plan_until > now())
  )
$$;

create or replace function public.distance_m(lat1 double precision, lng1 double precision,
                                             lat2 double precision, lng2 double precision)
returns double precision language sql immutable as $$
  select 2 * 6371000 * asin(sqrt(
    power(sin(radians(lat2 - lat1) / 2), 2) +
    cos(radians(lat1)) * cos(radians(lat2)) * power(sin(radians(lng2 - lng1) / 2), 2)
  ))
$$;

-- Free swipes allowed per day. Change here if the offer changes.
create or replace function public.free_swipes_per_day() returns int
language sql immutable as $$ select 3 $$;

-- How many swipes the signed-in person has left today. NULL means no limit (Plus).
create or replace function public.swipes_left() returns int
language plpgsql stable security definer set search_path = public as $$
declare
  used int;
begin
  if auth.uid() is null then raise exception 'not_signed_in'; end if;
  if is_plus(auth.uid()) then return null; end if;
  select count(*) into used from swipes
   where swiper = auth.uid() and created_at >= nairobi_day_start();
  return greatest(0, free_swipes_per_day() - used);
end $$;

-- ------------------------------------------------------------- the deck
-- People to swipe on: nearby first, never yourself, never anyone you have
-- already swiped on, and never anyone blocked in either direction.
-- Filters are a Plus feature and are refused for free accounts.
create or replace function public.get_deck(
  p_limit int default 20,
  p_same_drink boolean default false,
  p_drinking_type text default null,
  p_party_style text default null
) returns table (
  id uuid, display_name text, age int, base text, kinywaji text, drink_type text,
  drinking_type text, party_style text, bio text, photo_path text,
  distance_m int, liked_you boolean
)
language plpgsql stable security definer set search_path = public as $$
declare
  me profiles%rowtype;
  my_lat double precision;
  my_lng double precision;
begin
  if auth.uid() is null then raise exception 'not_signed_in'; end if;
  select * into me from profiles p where p.id = auth.uid();
  if not found then raise exception 'no_profile'; end if;

  if (p_same_drink or p_drinking_type is not null or p_party_style is not null)
     and not is_plus(me.id) then
    raise exception 'plus_required';
  end if;

  -- Use the phone's last location if we have one, otherwise the middle of their Base.
  select coalesce(me.lat, a.lat), coalesce(me.lng, a.lng) into my_lat, my_lng
    from areas a where a.name = me.base;

  return query
  select p.id, p.display_name,
         extract(year from age((now() at time zone 'Africa/Nairobi')::date, p.birth_date))::int,
         p.base, p.kinywaji, p.drink_type, p.drinking_type, p.party_style, p.bio, p.photo_path,
         -- rounded to the nearest 100 m so nobody can be pinpointed
         (round(distance_m(my_lat, my_lng, coalesce(p.lat, a.lat), coalesce(p.lng, a.lng)) / 100) * 100)::int,
         exists (select 1 from swipes s
                  where s.swiper = p.id and s.target = me.id and s.direction = 'super')
    from profiles p
    join areas a on a.name = p.base
   where p.id <> me.id
     and not exists (select 1 from swipes s where s.swiper = me.id and s.target = p.id)
     and not exists (select 1 from blocks b
                      where (b.blocker = me.id and b.blocked = p.id)
                         or (b.blocker = p.id and b.blocked = me.id))
     and (not p_same_drink or p.drink_type = me.drink_type)
     and (p_drinking_type is null or p.drinking_type = p_drinking_type)
     and (p_party_style is null or p.party_style = p_party_style)
   order by distance_m(my_lat, my_lng, coalesce(p.lat, a.lat), coalesce(p.lng, a.lng))
   limit least(greatest(p_limit, 1), 50);
end $$;

-- ---------------------------------------------------------------- swipe
-- Records a swipe. Enforces the daily limit for free accounts and creates
-- the match when both people have said yes.
create or replace function public.swipe(p_target uuid, p_direction text)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  me uuid := auth.uid();
  remaining int;
  new_match uuid;
  a uuid;
  b uuid;
begin
  if me is null then raise exception 'not_signed_in'; end if;
  if p_direction not in ('pass', 'cheers', 'super') then raise exception 'bad_direction'; end if;
  if p_target = me then raise exception 'cannot_swipe_self'; end if;
  if not exists (select 1 from profiles where id = me) then raise exception 'no_profile'; end if;
  if not exists (select 1 from profiles where id = p_target) then raise exception 'no_such_person'; end if;
  if exists (select 1 from blocks
              where (blocker = me and blocked = p_target) or (blocker = p_target and blocked = me)) then
    raise exception 'no_such_person';
  end if;

  -- One at a time per person, so two fast taps cannot both slip under the limit.
  perform pg_advisory_xact_lock(hashtextextended(me::text, 0));

  remaining := swipes_left();
  if remaining is not null and remaining <= 0 then raise exception 'daily_limit'; end if;

  insert into swipes (swiper, target, direction) values (me, p_target, p_direction);

  if p_direction in ('cheers', 'super') and exists (
       select 1 from swipes
        where swiper = p_target and target = me and direction in ('cheers', 'super')) then
    a := least(me, p_target);
    b := greatest(me, p_target);
    insert into matches (user_a, user_b) values (a, b)
      on conflict (user_a, user_b) do nothing
      returning id into new_match;
    if new_match is null then
      select id into new_match from matches where user_a = a and user_b = b;
    end if;
  end if;

  return jsonb_build_object(
    'matched', new_match is not null,
    'match_id', new_match,
    'swipes_left', case when remaining is null then null else remaining - 1 end
  );
exception
  when unique_violation then raise exception 'already_swiped';
end $$;

-- -------------------------------------------------------------- matches
create or replace function public.get_matches()
returns table (
  match_id uuid, matched_at timestamptz, other_id uuid, display_name text, age int, base text,
  kinywaji text, photo_path text, last_message text, last_message_at timestamptz, last_sender uuid
)
language sql stable security definer set search_path = public as $$
  select m.id, m.created_at, p.id, p.display_name,
         extract(year from age((now() at time zone 'Africa/Nairobi')::date, p.birth_date))::int,
         p.base, p.kinywaji, p.photo_path, lm.body, lm.created_at, lm.sender
    from matches m
    join profiles p on p.id = case when m.user_a = auth.uid() then m.user_b else m.user_a end
    left join lateral (
      select body, created_at, sender from messages
       where match_id = m.id order by created_at desc limit 1
    ) lm on true
   where auth.uid() in (m.user_a, m.user_b)
   order by coalesce(lm.created_at, m.created_at) desc
$$;

-- Block someone: ends the match (and its chat) and hides each from the other.
create or replace function public.block_user(p_user uuid) returns void
language plpgsql security definer set search_path = public as $$
declare me uuid := auth.uid();
begin
  if me is null then raise exception 'not_signed_in'; end if;
  if p_user = me then raise exception 'cannot_block_self'; end if;
  insert into blocks (blocker, blocked) values (me, p_user) on conflict do nothing;
  delete from matches where user_a = least(me, p_user) and user_b = greatest(me, p_user);
end $$;

create or replace function public.report_user(p_user uuid, p_reason text, p_details text default '')
returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'not_signed_in'; end if;
  insert into reports (reporter, reported, reason, details)
  values (auth.uid(), p_user, p_reason, coalesce(p_details, ''));
end $$;

-- Delete my account and everything attached to it.
create or replace function public.delete_my_account() returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'not_signed_in'; end if;
  delete from auth.users where id = auth.uid();
end $$;

-- ------------------------------------------------------ row level security
alter table public.areas enable row level security;
alter table public.profiles enable row level security;
alter table public.swipes enable row level security;
alter table public.matches enable row level security;
alter table public.messages enable row level security;
alter table public.blocks enable row level security;
alter table public.reports enable row level security;

drop policy if exists areas_read on public.areas;
create policy areas_read on public.areas for select to anon, authenticated using (true);

-- You can read and edit only your own profile row. Other people's profiles
-- reach you through get_deck / get_matches, which leave out the private parts.
drop policy if exists profiles_own_select on public.profiles;
create policy profiles_own_select on public.profiles for select to authenticated
  using (id = auth.uid());
drop policy if exists profiles_own_insert on public.profiles;
create policy profiles_own_insert on public.profiles for insert to authenticated
  with check (id = auth.uid() and plan = 'free' and plan_until is null);
drop policy if exists profiles_own_update on public.profiles;
create policy profiles_own_update on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists swipes_own_select on public.swipes;
create policy swipes_own_select on public.swipes for select to authenticated
  using (swiper = auth.uid());

drop policy if exists matches_member_select on public.matches;
create policy matches_member_select on public.matches for select to authenticated
  using (auth.uid() in (user_a, user_b));

drop policy if exists messages_member_select on public.messages;
create policy messages_member_select on public.messages for select to authenticated
  using (exists (select 1 from public.matches m
                  where m.id = match_id and auth.uid() in (m.user_a, m.user_b)));
drop policy if exists messages_member_insert on public.messages;
create policy messages_member_insert on public.messages for insert to authenticated
  with check (sender = auth.uid() and exists (
    select 1 from public.matches m where m.id = match_id and auth.uid() in (m.user_a, m.user_b)));

drop policy if exists blocks_own_select on public.blocks;
create policy blocks_own_select on public.blocks for select to authenticated
  using (blocker = auth.uid());

-- ------------------------------------------------------------ privileges
-- Start from nothing, then hand out exactly what the app needs.
revoke all on public.areas, public.profiles, public.swipes, public.matches,
              public.messages, public.blocks, public.reports from anon, authenticated;

grant select on public.areas to anon, authenticated;
grant select on public.profiles, public.swipes, public.matches, public.messages, public.blocks to authenticated;
grant insert (id, display_name, birth_date, base, kinywaji, drink_type, drinking_type, party_style, bio, photo_path, lat, lng, located_at)
  on public.profiles to authenticated;
-- Not editable by the user: birth_date (age), plan and plan_until (payment only).
grant update (display_name, base, kinywaji, drink_type, drinking_type, party_style, bio, photo_path, lat, lng, located_at)
  on public.profiles to authenticated;
grant insert (match_id, sender, body) on public.messages to authenticated;

revoke all on function public.swipes_left(), public.get_deck(int, boolean, text, text),
  public.swipe(uuid, text), public.get_matches(), public.block_user(uuid),
  public.report_user(uuid, text, text), public.delete_my_account(), public.is_plus(uuid) from public, anon;
grant execute on function public.swipes_left(), public.get_deck(int, boolean, text, text),
  public.swipe(uuid, text), public.get_matches(), public.block_user(uuid),
  public.report_user(uuid, text, text), public.delete_my_account() to authenticated;

-- Live chat and live matches (only exists on Supabase, skipped elsewhere).
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    begin
      alter publication supabase_realtime add table public.messages;
    exception when duplicate_object then null;
    end;
    begin
      alter publication supabase_realtime add table public.matches;
    exception when duplicate_object then null;
    end;
  end if;
end $$;

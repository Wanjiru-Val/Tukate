-- Tests for the rules in 0001_core.sql. Each check raises an error if it fails.
\set ON_ERROR_STOP on

create or replace function pg_temp.expect_error(p_sql text, p_message text, p_label text) returns void
language plpgsql as $$
begin
  begin
    execute p_sql;
  exception when others then
    if sqlerrm like '%' || p_message || '%' then
      raise notice 'ok   %', p_label;
      return;
    end if;
    raise exception 'FAIL % : expected "%", got "%"', p_label, p_message, sqlerrm;
  end;
  raise exception 'FAIL % : expected "%", but it succeeded', p_label, p_message;
end $$;

create or replace function pg_temp.check_true(p_ok boolean, p_label text) returns void
language plpgsql as $$
begin
  if p_ok is not true then raise exception 'FAIL %', p_label; end if;
  raise notice 'ok   %', p_label;
end $$;

-- six people
insert into auth.users (id) values
  ('00000000-0000-0000-0000-000000000001'), ('00000000-0000-0000-0000-000000000002'),
  ('00000000-0000-0000-0000-000000000003'), ('00000000-0000-0000-0000-000000000004'),
  ('00000000-0000-0000-0000-000000000005'), ('00000000-0000-0000-0000-000000000006');

create or replace function pg_temp.login(n int) returns void language plpgsql as $$
begin
  perform set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-00000000000' || n, false);
end $$;

set role authenticated;

-- 1: Val, whisky, Kilimani
select pg_temp.login(1);
insert into profiles (id, display_name, birth_date, base, kinywaji, drink_type, drinking_type, party_style)
values (auth.uid(), 'Val', '1998-03-01', 'Kilimani', 'Whisky, no ice', 'whisky', 'social', 'rooftop');

select pg_temp.expect_error($$
  insert into profiles (id, display_name, birth_date, base, kinywaji, drink_type, drinking_type, party_style)
  values ('00000000-0000-0000-0000-000000000002', 'Imposter', '1990-01-01', 'CBD', 'Beer', 'beer', 'social', 'club')
$$, 'row-level security', 'cannot create a profile for someone else');

select pg_temp.login(2);
select pg_temp.expect_error($$
  insert into profiles (id, display_name, birth_date, base, kinywaji, drink_type, drinking_type, party_style)
  values (auth.uid(), 'Kid', (current_date - interval '17 years')::date, 'CBD', 'Soda', 'no_alcohol', 'one_or_two', 'quiet_local')
$$, 'adults_only', 'under 18 is refused');
select pg_temp.expect_error($$
  insert into profiles (id, display_name, birth_date, base, kinywaji, drink_type, drinking_type, party_style, plan)
  values (auth.uid(), 'Freeloader', '1995-01-01', 'CBD', 'Beer', 'beer', 'social', 'club', 'plus')
$$, 'permission denied', 'cannot sign up straight to Plus');
insert into profiles (id, display_name, birth_date, base, kinywaji, drink_type, drinking_type, party_style)
values (auth.uid(), 'Otieno', '1996-06-10', 'Westlands', 'Lager, baridi', 'beer', 'all_night', 'club');

select pg_temp.login(3);
insert into profiles (id, display_name, birth_date, base, kinywaji, drink_type, drinking_type, party_style, lat, lng)
values (auth.uid(), 'Wanjiku', '2000-01-15', 'Kilimani', 'Single malt', 'whisky', 'social', 'rooftop', -1.2925, 36.7860);
select pg_temp.login(4);
insert into profiles (id, display_name, birth_date, base, kinywaji, drink_type, drinking_type, party_style)
values (auth.uid(), 'Amina', '2001-09-09', 'South B', 'Dawa', 'cocktails', 'one_or_two', 'live_music');
select pg_temp.login(5);
insert into profiles (id, display_name, birth_date, base, kinywaji, drink_type, drinking_type, party_style)
values (auth.uid(), 'Brayo', '1994-12-01', 'Kileleshwa', 'Whisky and coke', 'whisky', 'all_night', 'house_party');
select pg_temp.login(6);
insert into profiles (id, display_name, birth_date, base, kinywaji, drink_type, drinking_type, party_style)
values (auth.uid(), 'Shiko', '1999-05-05', 'Karen', 'Gin and tonic', 'gin', 'social', 'nyama_choma');

-- privacy
select pg_temp.login(1);
select pg_temp.check_true((select count(*) from profiles) = 1, 'can only read my own profile row');
select pg_temp.expect_error($$ update profiles set plan = 'plus' where id = auth.uid() $$,
  'permission denied', 'cannot upgrade myself to Plus');
select pg_temp.expect_error($$ update profiles set birth_date = '1980-01-01' where id = auth.uid() $$,
  'permission denied', 'cannot change my birth date');
update profiles set bio = 'Arsenal, sadly' where id = auth.uid();
select pg_temp.check_true((select bio from profiles) = 'Arsenal, sadly', 'can edit my own bio');
select pg_temp.expect_error($$ insert into swipes (swiper, target, direction)
  values (auth.uid(), '00000000-0000-0000-0000-000000000002', 'cheers') $$,
  'permission denied', 'cannot write swipes directly, only through swipe()');

-- deck
select pg_temp.check_true((select count(*) from get_deck()) = 5, 'deck shows the five other people');
select pg_temp.check_true((select display_name from get_deck() limit 1) = 'Wanjiku', 'nearest person comes first');
select pg_temp.check_true((select distance_m % 100 from get_deck() limit 1) = 0, 'distance is rounded to 100 m');
select pg_temp.check_true((select age from get_deck() where display_name = 'Wanjiku') >= 18, 'deck gives age, not birth date');
select pg_temp.expect_error($$ select * from get_deck(20, true) $$, 'plus_required', 'free account cannot filter by same drink');
select pg_temp.expect_error($$ select * from get_deck(20, false, 'social') $$, 'plus_required', 'free account cannot filter by drinking type');
select pg_temp.expect_error($$ select * from get_deck(20, false, null, 'rooftop') $$, 'plus_required', 'free account cannot filter by party style');

-- daily limit
select pg_temp.check_true(swipes_left() = 3, 'free account starts the day with 3 swipes');
select pg_temp.check_true((swipe('00000000-0000-0000-0000-000000000003', 'cheers') ->> 'matched') = 'false', 'one-sided cheers is not a match');
select pg_temp.expect_error($$ select swipe('00000000-0000-0000-0000-000000000003', 'pass') $$, 'already_swiped', 'cannot swipe the same person twice');
select swipe('00000000-0000-0000-0000-000000000002', 'pass');
select pg_temp.check_true((swipe('00000000-0000-0000-0000-000000000004', 'super') ->> 'swipes_left') = '0', 'third swipe leaves 0');
select pg_temp.expect_error($$ select swipe('00000000-0000-0000-0000-000000000005', 'cheers') $$, 'daily_limit', 'fourth swipe of the day is refused');
select pg_temp.check_true((select count(*) from get_deck()) = 2, 'swiped people leave the deck');
select pg_temp.expect_error($$ select swipe(auth.uid(), 'cheers') $$, 'cannot_swipe_self', 'cannot swipe on myself');

-- match
select pg_temp.login(3);
select pg_temp.check_true((swipe('00000000-0000-0000-0000-000000000001', 'cheers') ->> 'matched') = 'true', 'mutual cheers makes a match');
select pg_temp.check_true((select count(*) from get_matches()) = 1, 'Wanjiku sees the match');
select pg_temp.check_true((select display_name from get_matches()) = 'Val', 'match shows the other person');
insert into messages (match_id, sender, body) select match_id, auth.uid(), 'Form ni gani?' from get_matches();
select pg_temp.expect_error($$ insert into messages (match_id, sender, body)
  select match_id, '00000000-0000-0000-0000-000000000001', 'forged' from get_matches() $$,
  'row-level security', 'cannot send a message as someone else');

select pg_temp.login(1);
select pg_temp.check_true((select last_message from get_matches()) = 'Form ni gani?', 'Val sees the message');
select pg_temp.login(4);
select pg_temp.check_true((select liked_you from get_deck() where display_name = 'Val'), 'Amina sees that Val super liked her');

-- outsiders
select pg_temp.login(2);
select pg_temp.check_true((select count(*) from messages) = 0, 'someone outside the match cannot read the chat');
select pg_temp.check_true((select count(*) from matches) = 0, 'someone outside the match cannot see it');
select pg_temp.expect_error($$ insert into messages (match_id, sender, body)
  select id, auth.uid(), 'hi' from (select id from matches) m
  union all select '11111111-1111-1111-1111-111111111111'::uuid, auth.uid(), 'hi' $$,
  'row-level security', 'cannot post into a chat I am not part of');

-- Plus (granted by the payment system, i.e. not by the user)
reset role;
update profiles set plan = 'plus', plan_until = now() + interval '30 days'
 where id = '00000000-0000-0000-0000-000000000005';
update profiles set plan = 'plus', plan_until = now() - interval '1 day'
 where id = '00000000-0000-0000-0000-000000000006';
set role authenticated;

select pg_temp.login(5);
select pg_temp.check_true(swipes_left() is null, 'Plus has no daily limit');
select pg_temp.check_true((select count(*) from get_deck(20, true)) = 2, 'Plus: same-drink filter returns the two other whisky drinkers');
select pg_temp.check_true((select count(*) from get_deck(20, false, 'social', 'rooftop')) = 2, 'Plus: drinking type and party style filters work together');
select swipe('00000000-0000-0000-0000-000000000001', 'pass');
select swipe('00000000-0000-0000-0000-000000000002', 'pass');
select swipe('00000000-0000-0000-0000-000000000003', 'pass');
select swipe('00000000-0000-0000-0000-000000000004', 'pass');
select pg_temp.check_true((select count(*) from swipes) = 4, 'Plus can swipe past three in a day');

select pg_temp.login(6);
select pg_temp.check_true(swipes_left() = 3, 'expired Plus falls back to the free limit');
select pg_temp.expect_error($$ select * from get_deck(20, true) $$, 'plus_required', 'expired Plus loses the filters');

-- block and report
select pg_temp.login(1);
select report_user('00000000-0000-0000-0000-000000000003', 'other', 'testing');
select block_user('00000000-0000-0000-0000-000000000003');
select pg_temp.check_true((select count(*) from get_matches()) = 0, 'blocking ends the match');
select pg_temp.login(3);
select pg_temp.check_true((select count(*) from get_matches()) = 0, 'the blocked person loses the match too');
select pg_temp.check_true((select count(*) from messages) = 0, 'the chat goes with the match');
select pg_temp.check_true(not exists (select 1 from get_deck() where display_name = 'Val'), 'blocked people never reappear in the deck');
select pg_temp.expect_error($$ select * from reports $$, 'permission denied', 'users cannot read reports');

-- signed out
reset role;
set role anon;
select set_config('request.jwt.claim.sub', '', false);
select pg_temp.expect_error($$ select * from profiles $$, 'permission denied', 'signed-out visitors cannot read profiles');
select pg_temp.expect_error($$ select * from get_deck() $$, 'permission denied', 'signed-out visitors cannot load a deck');
select pg_temp.check_true((select count(*) from areas) = 12, 'signed-out visitors can read the list of areas');
reset role;

-- account deletion removes everything
set role authenticated;
select pg_temp.login(2);
select delete_my_account();
reset role;
select pg_temp.check_true(not exists (select 1 from profiles where display_name = 'Otieno'), 'deleting an account removes the profile');
select pg_temp.check_true(not exists (select 1 from swipes where target = '00000000-0000-0000-0000-000000000002'), 'and the swipes on it');
\echo ALL RULES PASSED

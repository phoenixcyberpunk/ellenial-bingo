-- Bingo live links (Ellen, 19 Nov 2026): a short link that opens the bingo in the browser, so players pick a
-- card and tap their squares. Kept only until the link ends (1 day, 2 days or 1 week), then deleted.
-- Stored: the bingo itself (the same base64url line the PDF carries), its title and size for the chat preview,
-- and how many people took each card number. Never names, accounts or anyone's marks (those stay on the phone).
-- Only Bingo's own server function (api/live.js) can call these: every call must carry the shared secret,
-- which lives in ellenial_bingo.live_secret and in the Vercel project's environment, never in the code.

create table if not exists ellenial_bingo.live_links (
  code text primary key check (code ~ '^[2-9a-hjkmnp-z]{5}$'),
  payload text not null check (length(payload) between 10 and 16000 and payload ~ '^[A-Za-z0-9_-]+$'),
  title text not null check (length(title) between 1 and 60),
  size smallint not null check (size in (3, 5)),
  cards smallint not null check (cards between 2 and 30),
  taken smallint[] not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);
create index if not exists live_links_expires on ellenial_bingo.live_links (expires_at);

-- Spam brake: a one-way scrambled fingerprint of the connection (made by api/live.js, changes every day),
-- kept at most an hour.
create table if not exists ellenial_bingo.live_rate (
  key text not null check (length(key) <= 80),
  at timestamptz not null default now()
);
create index if not exists live_rate_key_at on ellenial_bingo.live_rate (key, at);

create table if not exists ellenial_bingo.live_secret (
  id smallint primary key default 1 check (id = 1),
  token text not null check (length(token) >= 32)
);

alter table ellenial_bingo.live_links enable row level security;
alter table ellenial_bingo.live_rate enable row level security;
alter table ellenial_bingo.live_secret enable row level security;
revoke all on ellenial_bingo.live_links, ellenial_bingo.live_rate, ellenial_bingo.live_secret from public, anon, authenticated;

create or replace function ellenial_bingo.live_check(p_secret text)
returns void language plpgsql security definer set search_path to '' as $$
begin
  if p_secret is null or not exists (select 1 from ellenial_bingo.live_secret s where s.token = p_secret) then
    raise exception 'forbidden' using errcode = '42501';
  end if;
end $$;

-- true if allowed (and counts this one), false if the key is over its limit in the window
create or replace function ellenial_bingo.live_rate_ok(p_key text, p_limit int, p_window interval)
returns boolean language plpgsql security definer set search_path to '' as $$
begin
  if (select count(*) from ellenial_bingo.live_rate r where r.key = p_key and r.at > now() - p_window) >= p_limit then
    return false;
  end if;
  insert into ellenial_bingo.live_rate (key) values (p_key);
  return true;
end $$;

create or replace function public.bingo_live_create(p_secret text, p_ip text, p_payload text, p_title text, p_size int, p_cards int, p_hours int)
returns json language plpgsql security definer set search_path to '' as $$
declare
  v_code text; v_exp timestamptz; v_try int := 0;
  v_abc constant text := '23456789abcdefghjkmnpqrstuvwxyz';
  v_bytes bytea;
begin
  perform ellenial_bingo.live_check(p_secret);
  if p_hours not in (24, 48, 168) then raise exception 'bad hours' using errcode = '22023'; end if;
  if not ellenial_bingo.live_rate_ok('c:' || left(coalesce(p_ip, '?'), 64), 10, interval '1 hour')
     or not ellenial_bingo.live_rate_ok('c:all', 600, interval '1 hour') then
    return json_build_object('error', 'busy');
  end if;
  v_exp := now() + make_interval(hours => p_hours);
  loop
    v_try := v_try + 1;
    v_bytes := extensions.gen_random_bytes(5);
    v_code := '';
    for i in 0..4 loop
      v_code := v_code || substr(v_abc, (get_byte(v_bytes, i) % 31) + 1, 1);
    end loop;
    begin
      insert into ellenial_bingo.live_links (code, payload, title, size, cards, taken, expires_at)
      values (v_code, p_payload, p_title, p_size, p_cards, array_fill(0::smallint, array[p_cards]), v_exp);
      exit;
    exception when unique_violation then
      if v_try >= 8 then raise; end if;
    end;
  end loop;
  return json_build_object('code', v_code, 'expires', v_exp);
end $$;

create or replace function public.bingo_live_get(p_secret text, p_code text)
returns json language plpgsql security definer set search_path to '' as $$
declare v ellenial_bingo.live_links;
begin
  perform ellenial_bingo.live_check(p_secret);
  select * into v from ellenial_bingo.live_links l where l.code = p_code and l.expires_at > now();
  if not found then return null; end if;
  return json_build_object('payload', v.payload, 'title', v.title, 'size', v.size, 'expires', v.expires_at, 'taken', v.taken);
end $$;

create or replace function public.bingo_live_claim(p_secret text, p_ip text, p_code text, p_card int)
returns json language plpgsql security definer set search_path to '' as $$
declare v_taken smallint[];
begin
  perform ellenial_bingo.live_check(p_secret);
  if not ellenial_bingo.live_rate_ok('k:' || left(coalesce(p_ip, '?'), 64), 60, interval '1 hour') then
    return json_build_object('error', 'busy');
  end if;
  update ellenial_bingo.live_links l
     set taken[p_card] = least(l.taken[p_card] + 1, 99)
   where l.code = p_code and l.expires_at > now() and p_card between 1 and l.cards
  returning l.taken into v_taken;
  if v_taken is null then return null; end if;
  return json_build_object('taken', v_taken);
end $$;

revoke all on function ellenial_bingo.live_check(text) from public, anon, authenticated;
revoke all on function ellenial_bingo.live_rate_ok(text, int, interval) from public, anon, authenticated;
revoke all on function public.bingo_live_create(text, text, text, text, int, int, int) from public, authenticated;
revoke all on function public.bingo_live_get(text, text) from public, authenticated;
revoke all on function public.bingo_live_claim(text, text, text, int) from public, authenticated;
grant execute on function public.bingo_live_create(text, text, text, text, int, int, int) to anon;
grant execute on function public.bingo_live_get(text, text) to anon;
grant execute on function public.bingo_live_claim(text, text, text, int) to anon;

-- Hourly: ended links and old spam-brake rows are deleted for good.
select cron.schedule('bingo-live-cleanup', '29 * * * *', $$
  delete from ellenial_bingo.live_links where expires_at < now();
  delete from ellenial_bingo.live_rate where at < now() - interval '1 hour';
$$);

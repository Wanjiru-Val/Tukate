-- Profile photos are private. Only signed-in members can view them, through
-- short-lived links, and you can only write into your own folder (<your user id>/...).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('photos', 'photos', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = false;

drop policy if exists photos_member_select on storage.objects;
create policy photos_member_select on storage.objects for select to authenticated
  using (bucket_id = 'photos');
drop policy if exists photos_own_insert on storage.objects;
create policy photos_own_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists photos_own_update on storage.objects;
create policy photos_own_update on storage.objects for update to authenticated
  using (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists photos_own_delete on storage.objects;
create policy photos_own_delete on storage.objects for delete to authenticated
  using (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);

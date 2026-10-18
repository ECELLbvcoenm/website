-- Read-only check after migration 003. Inspect the complete JSON result in SQL Editor.
-- has_*_privilege reports effective rights, including grants through other roles.
with api_roles(role_name) as (
  values ('anon'::text), ('authenticated'::text), ('service_role'::text)
), target_relations(object_name) as (
  values ('public.members'::text), ('public.public_members'::text),
         ('public.applications'::text), ('app_private.submission_attempts'::text)
), rights as (
  select t.object_name, r.role_name,
         pg_catalog.has_table_privilege(r.role_name, t.object_name, 'SELECT') as can_select,
         pg_catalog.has_table_privilege(r.role_name, t.object_name, 'INSERT') as can_insert,
         pg_catalog.has_table_privilege(r.role_name, t.object_name, 'UPDATE') as can_update,
         pg_catalog.has_table_privilege(r.role_name, t.object_name, 'DELETE') as can_delete,
         pg_catalog.has_table_privilege(r.role_name, t.object_name, 'TRUNCATE') as can_truncate,
         pg_catalog.has_table_privilege(r.role_name, t.object_name, 'REFERENCES') as can_reference,
         pg_catalog.has_table_privilege(r.role_name, t.object_name, 'TRIGGER') as can_trigger,
         pg_catalog.has_any_column_privilege(r.role_name, t.object_name, 'SELECT') as can_select_column,
         pg_catalog.has_any_column_privilege(r.role_name, t.object_name, 'INSERT') as can_insert_column,
         pg_catalog.has_any_column_privilege(r.role_name, t.object_name, 'UPDATE') as can_update_column,
         pg_catalog.has_any_column_privilege(r.role_name, t.object_name, 'REFERENCES') as can_reference_column
  from target_relations t cross join api_roles r
)
select
  (select coalesce(jsonb_agg(to_jsonb(rights) order by object_name, role_name), '[]'::jsonb)
   from rights) as effective_relation_privileges,
  (select coalesce(jsonb_object_agg(role_name,
     pg_catalog.has_function_privilege(role_name,
       'public.submit_application(text,text,text,text,text,text,text)', 'EXECUTE')),
     '{}'::jsonb) from api_roles) as effective_submission_rpc_execute,
  (select not (can_select or can_insert or can_update or can_delete or can_truncate or
               can_reference or can_trigger or can_select_column or can_insert_column or
               can_update_column or can_reference_column)
   from rights where object_name='public.applications' and role_name='service_role')
    as service_role_has_no_direct_applications_access;

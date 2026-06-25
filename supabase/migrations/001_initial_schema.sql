create extension if not exists "pgcrypto";

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  slug text not null unique,
  descricao text,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  descricao text,
  categoria uuid references public.categories(id) on delete set null,
  imagem text,
  galeria text[] not null default '{}',
  preco numeric(12, 2),
  preco_antigo numeric(12, 2),
  desconto integer,
  mercado_livre_link text,
  shopee_link text,
  ativo boolean not null default true,
  destaque boolean not null default false,
  slug text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.clicks (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete set null,
  marketplace text not null check (marketplace in ('mercado_livre', 'shopee')),
  destination_url text not null,
  user_agent text,
  referrer text,
  created_at timestamptz not null default now()
);

create table if not exists public.featured_products (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  position integer not null default 0,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  unique (product_id)
);

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

create index if not exists products_categoria_idx on public.products(categoria);
create index if not exists products_slug_idx on public.products(slug);
create index if not exists products_active_created_idx on public.products(ativo, created_at desc);
create index if not exists products_featured_idx on public.products(destaque) where ativo = true;
create index if not exists categories_slug_idx on public.categories(slug);
create index if not exists clicks_product_created_idx on public.clicks(product_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_categories_updated_at on public.categories;
create trigger set_categories_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.clicks enable row level security;
alter table public.featured_products enable row level security;
alter table public.admin_users enable row level security;

drop policy if exists "Public can read active categories" on public.categories;
create policy "Public can read active categories"
on public.categories for select
using (ativo = true or public.is_admin());

drop policy if exists "Admins manage categories" on public.categories;
create policy "Admins manage categories"
on public.categories for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products"
on public.products for select
using (ativo = true or public.is_admin());

drop policy if exists "Admins manage products" on public.products;
create policy "Admins manage products"
on public.products for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Anyone can register marketplace clicks" on public.clicks;
create policy "Anyone can register marketplace clicks"
on public.clicks for insert
with check (marketplace in ('mercado_livre', 'shopee'));

drop policy if exists "Admins read clicks" on public.clicks;
create policy "Admins read clicks"
on public.clicks for select
using (public.is_admin());

drop policy if exists "Public can read featured products" on public.featured_products;
create policy "Public can read featured products"
on public.featured_products for select
using (true);

drop policy if exists "Admins manage featured products" on public.featured_products;
create policy "Admins manage featured products"
on public.featured_products for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can read own admin row" on public.admin_users;
create policy "Admins can read own admin row"
on public.admin_users for select
using (user_id = auth.uid() or public.is_admin());

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can read product images" on storage.objects;
create policy "Public can read product images"
on storage.objects for select
using (bucket_id = 'product-images');

drop policy if exists "Admins can upload product images" on storage.objects;
create policy "Admins can upload product images"
on storage.objects for insert
with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "Admins can update product images" on storage.objects;
create policy "Admins can update product images"
on storage.objects for update
using (bucket_id = 'product-images' and public.is_admin())
with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "Admins can delete product images" on storage.objects;
create policy "Admins can delete product images"
on storage.objects for delete
using (bucket_id = 'product-images' and public.is_admin());

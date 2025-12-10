-- Execute este script no SQL Editor do Supabase para criar as tabelas necessárias

-- 1. Tabela de Contas (Accounts)
create table if not exists public.accounts (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  password text not null,
  purchase_date timestamp with time zone,
  expiry_date timestamp with time zone,
  cost numeric,
  status text default 'available',
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone
);

-- 2. Tabela de Clientes (Clients)
create table if not exists public.clients (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text,
  whatsapp text,
  password_hash text,
  tag text default 'novo',
  notes text,
  auth_token text,
  token_expires timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone,
  constraint clients_email_key unique (email),
  constraint clients_whatsapp_key unique (whatsapp)
);

-- 3. Tabela de Vendas (Sales)
create table if not exists public.sales (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references public.clients(id),
  account_id uuid references public.accounts(id),
  sale_price numeric,
  cost numeric,
  profit numeric,
  payment_method text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. Permissões (RLS)
-- Habilitar RLS
alter table public.accounts enable row level security;
alter table public.clients enable row level security;
alter table public.sales enable row level security;

-- Criar políticas de acesso (Públicas para facilitar)
-- Em produção idealmente você restringiria isso, mas para começar vamos liberar o acesso API
create policy "Acesso total a accounts" on public.accounts for all using (true) with check (true);
create policy "Acesso total a clients" on public.clients for all using (true) with check (true);
create policy "Acesso total a sales" on public.sales for all using (true) with check (true);

-- Schema do Supabase para GamePass Manager
-- Execute este SQL no SQL Editor do Supabase

-- Tabela de Contas (Accounts)
CREATE TABLE IF NOT EXISTS accounts (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  purchase_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  cost DECIMAL(10, 2) DEFAULT 35.00,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'sold', 'expiring', 'expired', 'pending_renewal')),
  notes TEXT DEFAULT '',
  -- Campos usados pelo app/n8n (Denormalização)
  client_id BIGINT REFERENCES clients(id),
  sold_date TIMESTAMPTZ,
  renewal_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Clientes (Clients)
CREATE TABLE IF NOT EXISTS clients (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT DEFAULT '',
  whatsapp TEXT DEFAULT '',
  password_hash TEXT,
  auth_token TEXT,
  token_expires TIMESTAMPTZ,
  tag TEXT DEFAULT 'novo' CHECK (tag IN ('novo', 'recorrente', 'vip')),
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Vendas (Sales)
CREATE TABLE IF NOT EXISTS sales (
  id BIGSERIAL PRIMARY KEY,
  client_id BIGINT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  account_id BIGINT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  sale_price DECIMAL(10, 2) NOT NULL,
  cost DECIMAL(10, 2) NOT NULL,
  profit DECIMAL(10, 2) NOT NULL,
  payment_method TEXT DEFAULT 'pix',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_accounts_status ON accounts(status);
CREATE INDEX IF NOT EXISTS idx_accounts_expiry_date ON accounts(expiry_date);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_whatsapp ON clients(whatsapp);
CREATE INDEX IF NOT EXISTS idx_clients_auth_token ON clients(auth_token);
CREATE INDEX IF NOT EXISTS idx_sales_client_id ON sales(client_id);
CREATE INDEX IF NOT EXISTS idx_sales_account_id ON sales(account_id);
CREATE INDEX IF NOT EXISTS idx_sales_created_at ON sales(created_at);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at
CREATE TRIGGER update_accounts_updated_at
  BEFORE UPDATE ON accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS) - Desabilitado por padrão para facilitar
-- Você pode habilitar depois se quiser mais segurança
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (permitir tudo - ajuste conforme necessário)
CREATE POLICY "Allow all on accounts" ON accounts FOR ALL USING (true);
CREATE POLICY "Allow all on clients" ON clients FOR ALL USING (true);
CREATE POLICY "Allow all on sales" ON sales FOR ALL USING (true);



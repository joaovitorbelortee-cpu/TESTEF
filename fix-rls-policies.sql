-- Execute este script no SQL Editor do Supabase para corrigir as políticas de RLS
-- Isso permitirá que o portal faça cadastros de clientes

-- Primeiro, remover políticas antigas
DROP POLICY IF EXISTS "Allow all on clients" ON clients;
DROP POLICY IF EXISTS "Allow all on accounts" ON accounts;
DROP POLICY IF EXISTS "Allow all on sales" ON sales;

-- Criar políticas corretas para clients (portal precisa inserir)
CREATE POLICY "Allow select on clients" ON clients FOR SELECT USING (true);
CREATE POLICY "Allow insert on clients" ON clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update on clients" ON clients FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete on clients" ON clients FOR DELETE USING (true);

-- Criar políticas corretas para accounts
CREATE POLICY "Allow select on accounts" ON accounts FOR SELECT USING (true);
CREATE POLICY "Allow insert on accounts" ON accounts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update on accounts" ON accounts FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete on accounts" ON accounts FOR DELETE USING (true);

-- Criar políticas corretas para sales
CREATE POLICY "Allow select on sales" ON sales FOR SELECT USING (true);
CREATE POLICY "Allow insert on sales" ON sales FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update on sales" ON sales FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete on sales" ON sales FOR DELETE USING (true);

-- Garantir que as tabelas têm RLS habilitado
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

-- Verificar se as políticas foram criadas
SELECT schemaname, tablename, policyname, cmd, qual FROM pg_policies WHERE tablename IN ('accounts', 'clients', 'sales');

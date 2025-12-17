-- ============================================
-- FIX: Permitir Upsert na tabela users
-- Execute este SQL no SQL Editor do Supabase
-- ============================================

-- 1. Primeiro, verifique se a tabela users existe e sua estrutura
-- (Execute isso primeiro para ver as colunas)
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'users' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Criar função de upsert para users
-- Esta função insere um novo usuário OU atualiza se o email já existir
CREATE OR REPLACE FUNCTION upsert_portal_user(
  p_email TEXT,
  p_name TEXT DEFAULT NULL,
  p_password_hash TEXT DEFAULT NULL,
  p_client_id BIGINT DEFAULT NULL
)
RETURNS TABLE(
  id BIGINT,
  email TEXT,
  name TEXT,
  is_new BOOLEAN
) AS $$
DECLARE
  v_id BIGINT;
  v_is_new BOOLEAN := false;
BEGIN
  -- Tentar inserir, se falhar por email duplicado, atualizar
  INSERT INTO users (email, name, password_hash, client_id, created_at, updated_at)
  VALUES (p_email, p_name, p_password_hash, p_client_id, NOW(), NOW())
  ON CONFLICT (email) 
  DO UPDATE SET 
    name = COALESCE(EXCLUDED.name, users.name),
    password_hash = COALESCE(EXCLUDED.password_hash, users.password_hash),
    client_id = COALESCE(EXCLUDED.client_id, users.client_id),
    updated_at = NOW()
  RETURNING users.id INTO v_id;
  
  -- Verificar se foi insert ou update
  GET DIAGNOSTICS v_is_new = ROW_COUNT;
  
  RETURN QUERY 
  SELECT u.id, u.email, u.name, (v_is_new AND xmax = 0)::BOOLEAN
  FROM users u 
  WHERE u.id = v_id;
END;
$$ LANGUAGE plpgsql;

-- 3. Alternativa simples: Use esta query diretamente no n8n
-- Substitua os valores $1, $2, $3 pelos campos do seu workflow
/*
INSERT INTO users (email, name, password_hash, created_at, updated_at)
VALUES ($email, $name, $password_hash, NOW(), NOW())
ON CONFLICT (email) 
DO UPDATE SET 
  name = COALESCE(EXCLUDED.name, users.name),
  password_hash = COALESCE(EXCLUDED.password_hash, users.password_hash),
  updated_at = NOW()
RETURNING id, email, name;
*/

-- ============================================
-- INSTRUÇÕES PARA O N8N:
-- ============================================
-- Opção A: No nó Supabase do n8n, mude de "Insert" para "Upsert"
--          e configure "Conflict Column" como "email"
--
-- Opção B: Use um nó "Postgres" ou "Execute Query" com a query:
--          INSERT INTO users (email, name, ...) 
--          VALUES ({{ $json.email }}, {{ $json.name }}, ...)
--          ON CONFLICT (email) 
--          DO UPDATE SET name = EXCLUDED.name, updated_at = NOW()
--          RETURNING *;
-- ============================================

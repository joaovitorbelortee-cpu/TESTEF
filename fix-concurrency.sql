-- Função para buscar e reservar uma conta atomicamente (evita race conditions)
-- Substitui a lógica de buscar -> verificar -> atualizar no código
CREATE OR REPLACE FUNCTION get_and_assign_account(p_client_id BIGINT)
RETURNS TABLE (
  id BIGINT,
  email TEXT,
  password TEXT,
  expiry_date DATE,
  status TEXT
) AS $$
DECLARE
  account_record RECORD;
BEGIN
  -- Tenta encontrar uma conta disponível e travá-la
  SELECT a.id, a.email, a.password, a.expiry_date, a.status
  INTO account_record
  FROM accounts a
  WHERE a.status = 'available'
  ORDER BY a.created_at ASC -- Vende as mais antigas primeiro (FIFO) ou remova para aleatório
  LIMIT 1
  FOR UPDATE SKIP LOCKED; -- Pula linhas travadas por outras transações

  IF FOUND THEN
    -- Atualiza a conta encontrada para vendida e vincula ao cliente
    UPDATE accounts
    SET status = 'sold',
        client_id = p_client_id,
        sold_date = NOW(),
        updated_at = NOW()
    WHERE accounts.id = account_record.id;

    -- Retorna os dados da conta atualizados
    RETURN QUERY SELECT 
      account_record.id, 
      account_record.email, 
      account_record.password, 
      account_record.expiry_date, 
      'sold'::text;
  ELSE
    -- Retorna vazio se não achar conta
  END IF;
END;
$$ LANGUAGE plpgsql;

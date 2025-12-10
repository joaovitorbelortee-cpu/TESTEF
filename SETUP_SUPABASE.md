# 🚀 Guia de Configuração do Supabase

## 📋 Passo a Passo

### 1. Criar Projeto no Supabase

1. Acesse: https://supabase.com
2. Faça login ou crie uma conta
3. Clique em "New Project"
4. Preencha:
   - **Name:** GamePass Manager
   - **Database Password:** (anote essa senha!)
   - **Region:** Escolha a mais próxima (ex: South America)
5. Clique em "Create new project"
6. Aguarde a criação (pode levar alguns minutos)

---

### 2. Obter Credenciais

1. No painel do projeto, vá em **Settings** → **API**
2. Copie as seguintes informações:
   - **Project URL** (SUPABASE_URL)
   - **anon public** key (SUPABASE_ANON_KEY)

---

### 3. Criar Tabelas no Banco

1. No painel do Supabase, vá em **SQL Editor**
2. Clique em **New Query**
3. Copie e cole todo o conteúdo do arquivo `supabase-schema.sql`
4. Clique em **Run** (ou pressione Ctrl+Enter)
5. Aguarde a confirmação de sucesso

---

### 4. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Supabase
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

**⚠️ IMPORTANTE:** 
- NUNCA commite o arquivo `.env` no Git
- O arquivo `.env` já está no `.gitignore`

---

### 5. Instalar Dependências

```bash
npm install
```

---

### 6. Atualizar o Código

O código já está preparado! Basta:

1. O sistema detecta automaticamente se o Supabase está configurado
2. Se as variáveis de ambiente estiverem definidas, usa Supabase
3. Caso contrário, usa o banco JSON local (fallback)

---

### 7. Migrar Dados Existentes (Opcional)

Se você já tem dados no `server/data.json`, você pode migrar:

1. Execute o script de migração (será criado se necessário)
2. Ou importe manualmente via SQL Editor do Supabase

---

## 🔧 Verificação

Para verificar se está funcionando:

1. Inicie o servidor: `npm run dev:server`
2. Você deve ver no console:
   - ✅ `Banco de dados Supabase conectado!`
   - 🔗 `URL: https://seu-projeto.supabase.co`

Se aparecer:
- ⚠️ `Supabase não configurado. Usando banco JSON local.`
  
Significa que as variáveis de ambiente não estão configuradas.

---

## 📝 Estrutura das Tabelas

### `accounts`
- Contas GamePass (disponíveis, vendidas, expiradas)

### `clients`
- Clientes cadastrados
- Autenticação do portal

### `sales`
- Vendas realizadas
- Relaciona clientes com contas

---

## 🔒 Segurança

Por padrão, as políticas RLS estão configuradas para permitir tudo.

**Para produção, recomendo:**
1. Criar políticas mais restritivas
2. Usar Service Role Key apenas no servidor
3. Habilitar autenticação adequada

---

## 🐛 Troubleshooting

### Erro: "relation does not exist"
- Execute o SQL do `supabase-schema.sql` novamente

### Erro: "permission denied"
- Verifique as políticas RLS no Supabase
- Ou desabilite temporariamente RLS para testes

### Dados não aparecem
- Verifique se as variáveis de ambiente estão corretas
- Reinicie o servidor após configurar `.env`

---

**Pronto! Seu projeto está conectado ao Supabase! 🎉**



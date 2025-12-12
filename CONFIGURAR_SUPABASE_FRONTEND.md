# 🔧 Configurar Supabase no Frontend

## 📋 Passo a Passo

Após substituir as chamadas de API por chamadas diretas ao Supabase, você precisa configurar as variáveis de ambiente no Netlify.

---

## 1️⃣ Obter Credenciais do Supabase

1. Acesse seu projeto no Supabase: https://supabase.com
2. Vá em **Settings** → **API**
3. Copie:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

---

## 2️⃣ Configurar no Netlify

1. No Netlify, vá em seu site
2. **Site settings** → **Environment variables**
3. Adicione as seguintes variáveis:

```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

**⚠️ IMPORTANTE:**
- Use o prefixo `VITE_` (obrigatório para Vite/React)
- Substitua pelos valores reais do seu Supabase

---

## 3️⃣ Fazer Novo Deploy

Após adicionar as variáveis:

1. Vá em **Deploys**
2. Clique em **"Trigger deploy"** → **"Clear cache and deploy site"**
3. Aguarde o deploy

---

## 4️⃣ Verificar

1. Acesse seu site no Netlify
2. Abra o Console do navegador (F12)
3. Você deve ver:
   - ✅ Se configurado: Nenhum erro
   - ❌ Se não configurado: "⚠️ Variáveis do Supabase não configuradas"

---

## 🔒 Segurança

### Por que usar `anon` key no frontend?

A chave `anon` (anônima) é segura para usar no frontend porque:
- O Supabase usa Row Level Security (RLS) para proteger os dados
- As políticas RLS controlam o que cada usuário pode ver/fazer
- Mesmo que alguém veja a chave, não pode acessar dados sem permissão

### Configurar RLS (Recomendado para Produção)

No Supabase, você pode criar políticas mais restritivas:

```sql
-- Exemplo: Permitir apenas leitura para usuários autenticados
CREATE POLICY "Users can read accounts" 
ON accounts FOR SELECT 
USING (auth.role() = 'authenticated');
```

---

## 🐛 Troubleshooting

### Erro: "Supabase não configurado"

**Causa**: Variáveis de ambiente não configuradas

**Solução**:
1. Verifique se as variáveis estão no Netlify
2. Certifique-se de usar o prefixo `VITE_`
3. Faça novo deploy após adicionar

### Erro: "relation does not exist"

**Causa**: Tabelas não criadas no Supabase

**Solução**:
1. Execute o SQL do arquivo `supabase-schema.sql` no Supabase
2. Verifique se as tabelas foram criadas

### Erro: "permission denied"

**Causa**: Políticas RLS muito restritivas

**Solução**:
1. No Supabase, vá em **Authentication** → **Policies**
2. Verifique as políticas da tabela `accounts`
3. Ajuste conforme necessário

---

## 📝 Resumo

| Variável | Valor | Onde Configurar |
|----------|-------|-----------------|
| `VITE_SUPABASE_URL` | URL do projeto Supabase | Netlify → Environment Variables |
| `VITE_SUPABASE_ANON_KEY` | Chave anon do Supabase | Netlify → Environment Variables |

---

**Pronto! Frontend conectado diretamente ao Supabase! ✅**







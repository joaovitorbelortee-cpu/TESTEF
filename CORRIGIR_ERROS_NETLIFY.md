# 🔧 Corrigir Erros no Netlify

## ❌ Erros Encontrados

1. **"Unexpected token '<', "<!DOCTYPE "... is not valid JSON"**
   - **Causa**: API retornando HTML ao invés de JSON
   - **Solução**: Configurar `VITE_API_URL` no Netlify

2. **"Erro ao carregar contas. Verifique a configuração do Supabase."**
   - **Causa**: Variáveis do Supabase não configuradas
   - **Solução**: Configurar `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` no Netlify

---

## ✅ Solução: Configurar Variáveis no Netlify

### Passo 1: Acessar Configurações

1. Acesse: https://app.netlify.com
2. Selecione seu site: `assinalivebrmanager`
3. Vá em **Site settings** → **Environment variables**

### Passo 2: Adicionar Variáveis

Clique em **Add variable** e adicione uma por uma:

#### Variável 1:
```
Key: VITE_SUPABASE_URL
Value: [SUA_URL_DO_SUPABASE]
```

#### Variável 2:
```
Key: VITE_SUPABASE_ANON_KEY
Value: [SUA_PUBLISHABLE_KEY]
```

#### Variável 3:
```
Key: VITE_API_URL
Value: [SUA_URL_DO_BACKEND]/api
```

**⚠️ IMPORTANTE:**
- Use exatamente esses nomes (com `VITE_` no início)
- Copie os valores exatamente como estão acima
- Marque todas como **"All scopes"** (Production, Deploy previews, Branch deploys)

### Passo 3: Fazer Novo Deploy

1. Vá em **Deploys**
2. Clique nos **3 pontinhos** (⋯) ao lado do último deploy
3. Selecione **"Trigger deploy"** → **"Clear cache and deploy site"**
4. Aguarde o deploy (2-3 minutos)

---

## 🧪 Verificar se Funcionou

Após o deploy:

1. Acesse seu site no Netlify
2. Abra o Console do navegador (F12)
3. Você deve ver:
   ```
   🔧 API Base URL: [SUA_URL_DO_BACKEND]/api
   🔧 VITE_API_URL configurado: Sim
   🔧 Supabase URL configurada: Sim
   🔧 Supabase Key configurada: Sim
   ```

4. Se ainda der erro, verifique:
   - ✅ Variáveis estão salvas no Netlify
   - ✅ Deploy foi feito após adicionar variáveis
   - ✅ Backend está rodando no Vercel
   - ✅ Tabelas foram criadas no Supabase

---

## 📋 Checklist Rápido

- [ ] `VITE_SUPABASE_URL` configurado no Netlify
- [ ] `VITE_SUPABASE_ANON_KEY` configurado no Netlify
- [ ] `VITE_API_URL` configurado no Netlify
- [ ] Novo deploy feito após configurar variáveis
- [ ] Backend funcionando no Vercel
- [ ] Tabelas criadas no Supabase

---

## 🔍 Se Ainda Der Erro

### Erro: "Tabelas não encontradas"

**Solução:**
1. Acesse: https://supabase.com
2. Vá em **SQL Editor**
3. Execute o SQL do arquivo `supabase-schema.sql`
4. Aguarde confirmação

### Erro: "API retornou HTML"

**Solução:**
1. Verifique se `VITE_API_URL` está correto
2. Teste a URL do backend diretamente no navegador:
   ```
   [SUA_URL_DO_BACKEND]/api/health
   ```
3. Deve retornar JSON, não HTML

---

**Configure essas variáveis e faça novo deploy! 🚀**



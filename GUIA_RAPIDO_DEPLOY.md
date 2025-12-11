# ⚡ Guia Rápido: Resolver Erro 404 no Netlify

## 🎯 Problema

- ✅ Frontend no Netlify (funcionando)
- ❌ Backend não está rodando (erro 404)
- ❌ Banco de dados não configurado

## 🚀 Solução em 3 Passos

---

### 1️⃣ CRIAR BANCO DE DADOS (Supabase) - 5 minutos

1. Acesse: https://supabase.com
2. **New Project** → Nome: `gamepass-manager`
3. Aguarde criação (2-3 min)
4. Vá em **Settings** → **API**
5. Copie:
   - **Project URL** → `SUPABASE_URL`
   - **anon public key** → `SUPABASE_ANON_KEY`
6. Vá em **SQL Editor** → **New Query**
7. Abra `supabase-schema.sql` do projeto
8. Copie TODO o conteúdo e cole
9. Clique **Run** ✅

**Pronto! Banco criado!**

---

### 2️⃣ DEPLOY DO BACKEND (Vercel) - 5 minutos

1. Acesse: https://vercel.com
2. Login com GitHub
3. **Add New** → **Project**
4. Selecione repositório `gamepass-manager`
5. **Configure Project:**
   - Root Directory: `/` (deixe vazio)
   - Framework: Other
   - Build Command: (deixe vazio)
   - Output Directory: (deixe vazio)
6. **Environment Variables** → Adicione:
   ```
   SUPABASE_URL=https://seu-projeto.supabase.co
   SUPABASE_ANON_KEY=sua-chave-anon
   ```
7. Clique **Deploy**
8. Aguarde (2-3 min)
9. **Copie a URL**: `https://seu-projeto.vercel.app` ⭐

**Anote essa URL!**

---

### 3️⃣ CONECTAR FRONTEND AO BACKEND (Netlify) - 2 minutos

1. No Netlify, vá em seu site
2. **Site settings** → **Environment variables**
3. Clique **Add variable**
4. Adicione:
   ```
   VITE_API_URL=https://seu-projeto.vercel.app/api
   ```
   (Substitua pela URL do seu backend do Vercel!)
5. **Deploys** → **Trigger deploy** → **Clear cache and deploy site**
6. Aguarde deploy

**Pronto! ✅**

---

## 🧪 Testar

### Teste 1: Backend
Acesse: `https://seu-backend.vercel.app/api/health`

Deve aparecer:
```json
{"status":"ok","message":"GamePass Manager API rodando!"}
```

### Teste 2: Frontend
Acesse seu site no Netlify → Dashboard deve carregar! ✅

---

## 📝 Resumo das URLs

- **Frontend**: `https://seu-site.netlify.app`
- **Backend**: `https://seu-backend.vercel.app`
- **Banco**: Supabase (interno)

---

## 🐛 Problemas?

### Erro 404 continua?
- Verifique se `VITE_API_URL` está correto no Netlify
- Teste se o backend funciona: `/api/health`
- Faça novo deploy no Netlify

### Backend não inicia?
- Verifique variáveis de ambiente no Vercel
- Veja os logs de build no Vercel

### Banco não conecta?
- Verifique `SUPABASE_URL` e `SUPABASE_ANON_KEY` no Vercel
- Verifique se as tabelas foram criadas no Supabase

---

**Pronto! Sistema completo funcionando! 🎉**





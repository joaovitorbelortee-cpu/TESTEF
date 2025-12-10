# 🔑 Configurar Chaves do Supabase

## ✅ Suas Chaves Configuradas

**URL do Projeto:**
```
[SUA_URL_DO_SUPABASE]
```

**Anon Key (para Frontend e Backend):**
```
[SUA_ANON_KEY]
```

**Publishable Key (Alternativa para Frontend - pode usar no lugar da Anon Key):**
```
[SUA_PUBLISHABLE_KEY]
```

**Service Role Key (APENAS Backend - NUNCA no frontend!):**
```
[SUA_SERVICE_ROLE_KEY]
```

---

## 🚨 IMPORTANTE: Segurança

### ⚠️ Service Role Key
- **NUNCA** use no frontend
- **NUNCA** commite no Git
- **APENAS** no backend (Vercel/Railway)
- Tem acesso total ao banco (bypassa RLS)

### ✅ Anon Key e Publishable Key
- **Pode** usar no frontend (ambas são equivalentes)
- **Pode** usar no backend
- Respeita Row Level Security (RLS)
- São seguras para expor publicamente
- **Recomendação**: Use a **Publishable Key** no frontend (mais simples)

---

## 📋 Configuração por Ambiente

### 1️⃣ Desenvolvimento Local

Crie um arquivo `.env` na raiz do projeto:

```env
# Backend
SUPABASE_URL=[SUA_URL_DO_SUPABASE]
SUPABASE_ANON_KEY=[SUA_ANON_KEY]

# Frontend (com prefixo VITE_)
# Use a Publishable Key no frontend (mais simples)
VITE_SUPABASE_URL=[SUA_URL_DO_SUPABASE]
VITE_SUPABASE_ANON_KEY=[SUA_PUBLISHABLE_KEY]
```

---

### 2️⃣ Netlify (Frontend)

1. Acesse: https://app.netlify.com
2. Vá em seu site → **Site settings** → **Environment variables**
3. Adicione:

```
VITE_SUPABASE_URL = [SUA_URL_DO_SUPABASE]
VITE_SUPABASE_ANON_KEY = [SUA_PUBLISHABLE_KEY]
```

**Nota:** Você pode usar a Publishable Key (mais simples) ou a Anon Key (JWT). Ambas funcionam no frontend.

4. **Deploys** → **Trigger deploy** → **Clear cache and deploy site**

---

### 3️⃣ Vercel (Backend)

1. Acesse: https://vercel.com
2. Vá em seu projeto → **Settings** → **Environment Variables**
3. Adicione:

```
SUPABASE_URL = [SUA_URL_DO_SUPABASE]
SUPABASE_ANON_KEY = [SUA_ANON_KEY]
```

**Opcional (para operações administrativas):**
```
SUPABASE_SERVICE_ROLE_KEY = [SUA_SERVICE_ROLE_KEY]
```

4. Faça novo deploy

---

## 🧪 Testar Conexão

### Teste Local

1. Inicie o servidor:
```bash
npm run dev:server
```

2. Você deve ver no console:
```
✅ Banco de dados Supabase conectado!
🔗 URL: [SUA_URL_DO_SUPABASE]
```

### Teste Frontend

1. Inicie o frontend:
```bash
npm run dev
```

2. Abra o Console do navegador (F12)
3. Não deve aparecer erro de "Supabase não configurado"

---

## ✅ Checklist

- [ ] Arquivo `.env` criado localmente
- [ ] Variáveis configuradas no Netlify (Frontend)
- [ ] Variáveis configuradas no Vercel (Backend)
- [ ] Tabelas criadas no Supabase (execute `supabase-schema.sql`)
- [ ] Teste local funcionando
- [ ] Deploy feito no Netlify
- [ ] Deploy feito no Vercel

---

## 🔒 Segurança Final

✅ **NUNCA** commite o arquivo `.env`  
✅ **NUNCA** use Service Role Key no frontend  
✅ **SEMPRE** use Anon Key no frontend  
✅ O arquivo `.env` já está no `.gitignore`  

---

**Pronto! Suas chaves estão configuradas! 🎉**


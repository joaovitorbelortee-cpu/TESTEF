# 🔑 Credenciais do Supabase

## ✅ Suas Chaves

**URL do Projeto:**
```
[SUA_URL_DO_SUPABASE]
```

**Anon Key (JWT - para Frontend e Backend):**
```
[SUA_ANON_KEY]
```

**Publishable Key (Recomendado para Frontend - mais simples):**
```
[SUA_PUBLISHABLE_KEY]
```

**Service Role Key (APENAS Backend - NUNCA no frontend!):**
```
[SUA_SERVICE_ROLE_KEY]
```

---

## ⚠️ IMPORTANTE: Segurança

- **Service Role Key**: NUNCA use no frontend! Apenas no backend.
- **Anon Key**: Pode usar no frontend e backend.

---

## 📋 Onde Configurar

### 1. Netlify (Frontend)

**Site settings** → **Environment variables**:

```
VITE_SUPABASE_URL = [SUA_URL_DO_SUPABASE]
VITE_SUPABASE_ANON_KEY = [SUA_PUBLISHABLE_KEY]
```

💡 **Dica:** Use a Publishable Key no frontend (mais simples que a Anon Key JWT)

### 2. Vercel (Backend)

**Settings** → **Environment Variables**:

```
SUPABASE_URL = [SUA_URL_DO_SUPABASE]
SUPABASE_ANON_KEY = [SUA_ANON_KEY]
```

### 3. Local (.env)

Crie um arquivo `.env` na raiz:

```env
SUPABASE_URL=[SUA_URL_DO_SUPABASE]
SUPABASE_ANON_KEY=[SUA_ANON_KEY]

VITE_SUPABASE_URL=[SUA_URL_DO_SUPABASE]
VITE_SUPABASE_ANON_KEY=[SUA_PUBLISHABLE_KEY]
```

---

**Pronto! Configure essas variáveis e faça deploy! 🚀**


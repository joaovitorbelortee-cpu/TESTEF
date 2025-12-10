# 🔑 Credenciais do Supabase

## ✅ Suas Chaves

**URL do Projeto:**
```
https://cpzxslaufhomqxksyrwt.supabase.co
```

**Anon Key (JWT - para Frontend e Backend):**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwenhzbGF1ZmhvbXF4a3N5cnd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzMzQwNTUsImV4cCI6MjA4MDkxMDA1NX0.TDFb2CTXl6rocaRUbCNplaQ1d_zRrMmqhfQ1ncAiYmk
```

**Publishable Key (Recomendado para Frontend - mais simples):**
```
sb_publishable_fHaiFGOVYvIy8iP-P6vNNg_2uFoQnAi
```

**Service Role Key (APENAS Backend - NUNCA no frontend!):**
```
sb_secret_48MaezSonAxYplSHLJ7DZg_bz2XT0E0
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
VITE_SUPABASE_URL = https://cpzxslaufhomqxksyrwt.supabase.co
VITE_SUPABASE_ANON_KEY = sb_publishable_fHaiFGOVYvIy8iP-P6vNNg_2uFoQnAi
```

💡 **Dica:** Use a Publishable Key no frontend (mais simples que a Anon Key JWT)

### 2. Vercel (Backend)

**Settings** → **Environment Variables**:

```
SUPABASE_URL = https://cpzxslaufhomqxksyrwt.supabase.co
SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwenhzbGF1ZmhvbXF4a3N5cnd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzMzQwNTUsImV4cCI6MjA4MDkxMDA1NX0.TDFb2CTXl6rocaRUbCNplaQ1d_zRrMmqhfQ1ncAiYmk
```

### 3. Local (.env)

Crie um arquivo `.env` na raiz:

```env
SUPABASE_URL=https://cpzxslaufhomqxksyrwt.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwenhzbGF1ZmhvbXF4a3N5cnd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzMzQwNTUsImV4cCI6MjA4MDkxMDA1NX0.TDFb2CTXl6rocaRUbCNplaQ1d_zRrMmqhfQ1ncAiYmk

VITE_SUPABASE_URL=https://cpzxslaufhomqxksyrwt.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_fHaiFGOVYvIy8iP-P6vNNg_2uFoQnAi
```

---

**Pronto! Configure essas variáveis e faça deploy! 🚀**


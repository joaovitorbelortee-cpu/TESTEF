# 🔑 Chaves do Supabase - Configuração Final

## ✅ Suas Credenciais

**URL do Projeto:**
```
https://cpzxslaufhomqxksyrwt.supabase.co
```

**Chaves Disponíveis:**

1. **Publishable Key** (⭐ Recomendado para Frontend)
   ```
   sb_publishable_fHaiFGOVYvIy8iP-P6vNNg_2uFoQnAi
   ```

2. **Anon Key** (JWT - Alternativa)
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwenhzbGF1ZmhvbXF4a3N5cnd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzMzQwNTUsImV4cCI6MjA4MDkxMDA1NX0.TDFb2CTXl6rocaRUbCNplaQ1d_zRrMmqhfQ1ncAiYmk
   ```

3. **Service Role Key** (⚠️ APENAS Backend)
   ```
   sb_secret_48MaezSonAxYplSHLJ7DZg_bz2XT0E0
   ```

---

## 🎯 Qual Usar Onde?

### Frontend (Netlify)
✅ **Use:** `sb_publishable_fHaiFGOVYvIy8iP-P6vNNg_2uFoQnAi`  
💡 Mais simples e direto

### Backend (Vercel)
✅ **Use:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (Anon Key)  
✅ **Ou:** `sb_publishable_fHaiFGOVYvIy8iP-P6vNNg_2uFoQnAi` (Publishable Key)  
⚠️ **Opcional:** `sb_secret_48MaezSonAxYplSHLJ7DZg_bz2XT0E0` (Service Role - apenas para operações admin)

---

## 📋 Configuração Rápida

### Netlify (Frontend)

```
VITE_SUPABASE_URL = https://cpzxslaufhomqxksyrwt.supabase.co
VITE_SUPABASE_ANON_KEY = sb_publishable_fHaiFGOVYvIy8iP-P6vNNg_2uFoQnAi
```

### Vercel (Backend)

```
SUPABASE_URL = https://cpzxslaufhomqxksyrwt.supabase.co
SUPABASE_ANON_KEY = sb_publishable_fHaiFGOVYvIy8iP-P6vNNg_2uFoQnAi
```

### Local (.env)

```env
SUPABASE_URL=https://cpzxslaufhomqxksyrwt.supabase.co
SUPABASE_ANON_KEY=sb_publishable_fHaiFGOVYvIy8iP-P6vNNg_2uFoQnAi

VITE_SUPABASE_URL=https://cpzxslaufhomqxksyrwt.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_fHaiFGOVYvIy8iP-P6vNNg_2uFoQnAi
```

---

## 🔒 Segurança

| Chave | Onde Usar | Segurança |
|-------|-----------|-----------|
| **Publishable** | Frontend ✅ Backend ✅ | Segura (respeita RLS) |
| **Anon Key** | Frontend ✅ Backend ✅ | Segura (respeita RLS) |
| **Service Role** | Backend ⚠️ | **NUNCA no frontend!** (bypassa RLS) |

---

## ✅ Pronto!

Configure essas variáveis e faça deploy! 🚀


# 🔑 Chaves do Supabase - Configuração Final

## ✅ Suas Credenciais

**URL do Projeto:**
```
[SUA_URL_DO_SUPABASE]
```

**Chaves Disponíveis:**

1. **Publishable Key** (⭐ Recomendado para Frontend)
   ```
   [SUA_PUBLISHABLE_KEY]
   ```

2. **Anon Key** (JWT - Alternativa)
   ```
   [SUA_ANON_KEY]
   ```

3. **Service Role Key** (⚠️ APENAS Backend)
   ```
   [SUA_SERVICE_ROLE_KEY]
   ```

---

## 🎯 Qual Usar Onde?

### Frontend (Netlify)
✅ **Use:** `[SUA_PUBLISHABLE_KEY]`  
💡 Mais simples e direto

### Backend (Vercel)
✅ **Use:** `[SUA_ANON_KEY]` (Anon Key)  
✅ **Ou:** `[SUA_PUBLISHABLE_KEY]` (Publishable Key)  
⚠️ **Opcional:** `[SUA_SERVICE_ROLE_KEY]` (Service Role - apenas para operações admin)

---

## 📋 Configuração Rápida

### Netlify (Frontend)

```
VITE_SUPABASE_URL = [SUA_URL_DO_SUPABASE]
VITE_SUPABASE_ANON_KEY = [SUA_PUBLISHABLE_KEY]
```

### Vercel (Backend)

```
SUPABASE_URL = [SUA_URL_DO_SUPABASE]
SUPABASE_ANON_KEY = [SUA_PUBLISHABLE_KEY]
```

### Local (.env)

```env
SUPABASE_URL=[SUA_URL_DO_SUPABASE]
SUPABASE_ANON_KEY=[SUA_PUBLISHABLE_KEY]

VITE_SUPABASE_URL=[SUA_URL_DO_SUPABASE]
VITE_SUPABASE_ANON_KEY=[SUA_PUBLISHABLE_KEY]
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



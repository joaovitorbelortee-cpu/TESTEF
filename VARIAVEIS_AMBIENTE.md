# 🔧 Variáveis de Ambiente - Guia Completo

## 📋 Diferença entre Frontend e Backend

### Backend (Node.js/Express)
- **Não precisa de prefixo**
- Usa: `process.env.SUPABASE_URL`
- Configurado no Vercel/Railway

### Frontend (Vite/React)
- **Precisa de prefixo `VITE_`**
- Usa: `import.meta.env.VITE_API_URL`
- Configurado no Netlify

---

## 🔧 Configuração Atual do Projeto

### Backend (`server/supabase.js`)

```javascript
// ✅ CORRETO - Backend não precisa de prefixo
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
```

**Variáveis no Vercel:**
```
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-chave-anon
```

---

### Frontend (`utils/apiConfig.ts`)

```typescript
// ✅ CORRETO - Frontend usa VITE_
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
```

**Variável no Netlify:**
```
VITE_API_URL=https://seu-backend.vercel.app/api
```

---

## ⚠️ Atenção: Prefixos

### ❌ ERRADO (Next.js - não é nosso caso)
```javascript
// Isso é para Next.js, não para Vite!
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
```

### ✅ CORRETO (Vite/React - Frontend)
```javascript
// Para variáveis acessíveis no frontend
const apiUrl = import.meta.env.VITE_API_URL;
```

### ✅ CORRETO (Node.js - Backend)
```javascript
// Para variáveis no backend
const supabaseUrl = process.env.SUPABASE_URL;
```

---

## 📝 Onde Configurar

### Vercel (Backend)
1. Vá em **Settings** → **Environment Variables**
2. Adicione:
   ```
   SUPABASE_URL=https://seu-projeto.supabase.co
   SUPABASE_ANON_KEY=sua-chave-anon
   ```

### Netlify (Frontend)
1. Vá em **Site settings** → **Environment variables**
2. Adicione:
   ```
   VITE_API_URL=https://seu-backend.vercel.app/api
   ```

---

## 🧪 Testar Variáveis

### Backend (Node.js)
```javascript
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
```

### Frontend (Vite)
```javascript
console.log('API URL:', import.meta.env.VITE_API_URL);
```

---

## 📚 Resumo

| Ambiente | Prefixo | Exemplo |
|----------|---------|---------|
| **Backend (Node.js)** | Nenhum | `process.env.SUPABASE_URL` |
| **Frontend (Vite)** | `VITE_` | `import.meta.env.VITE_API_URL` |
| **Next.js** | `NEXT_PUBLIC_` | `process.env.NEXT_PUBLIC_SUPABASE_URL` |

---

**Nossa configuração está correta! ✅**





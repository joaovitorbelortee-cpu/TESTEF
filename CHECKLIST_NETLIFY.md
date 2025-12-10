# ✅ Checklist: Deploy no Netlify

## 📋 Verificação do Código

### ✅ Configuração Básica

- [x] **netlify.toml** - Configurado corretamente
  - Build command: `npm run build` ✅
  - Publish directory: `dist` ✅
  - Redirects para SPA configurados ✅
  - Headers de segurança configurados ✅

- [x] **package.json** - Scripts corretos
  - `build`: `vite build` ✅
  - Dependências instaladas ✅

- [x] **vite.config.ts** - Configuração correta
  - Output directory: `dist` ✅
  - SPA mode configurado ✅

- [x] **index.html** - Entry point correto ✅

---

### ✅ Variáveis de Ambiente Necessárias

**Configure no Netlify → Environment Variables:**

```
VITE_SUPABASE_URL = [SUA_URL_DO_SUPABASE]
VITE_SUPABASE_ANON_KEY = [SUA_PUBLISHABLE_KEY]
VITE_API_URL = [SUA_URL_DO_BACKEND]/api
```

**⚠️ IMPORTANTE:**
- Use o prefixo `VITE_` (obrigatório para Vite)
- Substitua `VITE_API_URL` pela URL real do seu backend no Vercel

---

### ✅ Código Verificado

- [x] **lib/supabaseClient.ts** - Cliente Supabase configurado ✅
- [x] **utils/apiConfig.ts** - Configuração de API dinâmica ✅
- [x] **components/AccountsManager.tsx** - Usa Supabase diretamente ✅
- [x] **.gitignore** - Arquivos sensíveis ignorados ✅

---

## 🚀 Passos para Deploy

### 1. Preparar Variáveis de Ambiente

No Netlify, adicione:
1. Acesse: https://app.netlify.com
2. Seu site → **Site settings** → **Environment variables**
3. Adicione as 3 variáveis acima

### 2. Conectar Repositório (se ainda não conectou)

1. **Add new site** → **Import an existing project**
2. Conecte com GitHub
3. Selecione o repositório
4. Configure:
   - **Build command**: `npm run build` (já vem do netlify.toml)
   - **Publish directory**: `dist` (já vem do netlify.toml)
   - **Branch to deploy**: `main` (ou a branch principal)

### 3. Deploy

1. Clique em **Deploy site**
2. Aguarde o build (2-3 minutos)
3. Verifique se não há erros

---

## ⚠️ Pontos de Atenção

### 1. Backend no Vercel

O frontend precisa do backend rodando. Certifique-se de que:
- ✅ Backend está deployado no Vercel
- ✅ URL do backend está correta em `VITE_API_URL`
- ✅ Backend tem as variáveis do Supabase configuradas

### 2. Supabase

Certifique-se de que:
- ✅ Tabelas criadas no Supabase (execute `supabase-schema.sql`)
- ✅ Variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` configuradas no Netlify

### 3. Build

O build deve:
- ✅ Compilar sem erros
- ✅ Gerar arquivos em `dist/`
- ✅ Não ter erros de TypeScript

---

## 🧪 Testar Após Deploy

1. Acesse a URL do Netlify
2. Abra o Console do navegador (F12)
3. Verifique:
   - ✅ Não há erros de "Supabase não configurado"
   - ✅ API está acessível
   - ✅ Dashboard carrega

---

## 📝 Resumo das URLs

- **Frontend (Netlify)**: `https://seu-site.netlify.app`
- **Backend (Vercel)**: `[SUA_URL_DO_BACKEND]`
- **Supabase**: `[SUA_URL_DO_SUPABASE]`

---

## ✅ Status Final

**Código está pronto para deploy no Netlify! 🎉**

Apenas configure as variáveis de ambiente e faça o deploy!



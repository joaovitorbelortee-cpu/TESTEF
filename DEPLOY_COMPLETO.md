# 🚀 Deploy Completo: Frontend (Netlify) + Backend + Banco de Dados

## 📋 Situação Atual

- ✅ **Frontend**: Deploy no Netlify (funcionando)
- ❌ **Backend**: Não está rodando (por isso o erro 404)
- ❌ **Banco de Dados**: Não configurado

## 🎯 Solução: 3 Passos

### 1️⃣ Configurar Supabase (Banco de Dados)
### 2️⃣ Deploy do Backend (Vercel ou Railway)
### 3️⃣ Conectar Frontend ao Backend (Netlify)

---

## 1️⃣ CONFIGURAR SUPABASE (Banco de Dados)

### Passo 1: Criar Projeto no Supabase

1. Acesse: https://supabase.com
2. Faça login ou crie conta (grátis)
3. Clique em **"New Project"**
4. Preencha:
   - **Name**: `gamepass-manager`
   - **Database Password**: (anote essa senha!)
   - **Region**: South America (São Paulo)
5. Clique em **"Create new project"**
6. Aguarde 2-3 minutos

### Passo 2: Obter Credenciais

1. No painel do projeto, vá em **Settings** → **API**
2. Copie:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** key → `SUPABASE_ANON_KEY`

### Passo 3: Criar Tabelas

1. No Supabase, vá em **SQL Editor**
2. Clique em **"New Query"**
3. Abra o arquivo `supabase-schema.sql` do projeto
4. Copie TODO o conteúdo e cole no SQL Editor
5. Clique em **"Run"** (ou Ctrl+Enter)
6. Deve aparecer: ✅ "Success. No rows returned"

**Pronto! Banco de dados configurado! ✅**

---

## 2️⃣ DEPLOY DO BACKEND

O Netlify **NÃO** roda backend. Você precisa de outro serviço:

### Opção A: Vercel (Recomendado - Mais Fácil) ⭐

#### Passo 1: Criar Conta

1. Acesse: https://vercel.com
2. Faça login com GitHub
3. Clique em **"Add New"** → **"Project"**

#### Passo 2: Conectar Repositório

1. Selecione seu repositório `gamepass-manager`
2. Vercel detecta automaticamente

#### Passo 3: Configurar Build

**Root Directory**: Deixe vazio (ou `/`)

**Build Settings:**
- **Framework Preset**: Other
- **Build Command**: (deixe vazio)
- **Output Directory**: (deixe vazio)
- **Install Command**: `npm install`

#### Passo 4: Configurar Variáveis de Ambiente

Clique em **"Environment Variables"** e adicione:

```
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-chave-anon-aqui
PORT=3001
```

#### Passo 5: Configurar para Serverless Functions

O Vercel precisa saber que é um backend. Crie/edite `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "api/index.js"
    }
  ]
}
```

#### Passo 6: Deploy!

1. Clique em **"Deploy"**
2. Aguarde o deploy (2-3 minutos)
3. Copie a URL: `https://seu-projeto.vercel.app`

**Anote essa URL! Você vai precisar dela!**

---

### Opção B: Railway (Alternativa)

1. Acesse: https://railway.app
2. Faça login com GitHub
3. **New Project** → **Deploy from GitHub repo**
4. Selecione seu repositório
5. Configure:
   - **Root Directory**: `/server`
   - **Start Command**: `node index.js`
6. Adicione variáveis de ambiente:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `PORT=3001`
7. Deploy automático!

---

## 3️⃣ CONECTAR FRONTEND AO BACKEND (Netlify)

Agora você precisa dizer ao Netlify onde está o backend:

### Passo 1: Adicionar Variável de Ambiente no Netlify

1. No Netlify, vá em seu site
2. **Site settings** → **Environment variables**
3. Clique em **"Add variable"**
4. Adicione:

```
VITE_API_URL=https://seu-backend.vercel.app/api
```

**Substitua `seu-backend.vercel.app` pela URL do seu backend!**

### Passo 2: Fazer Novo Deploy

1. No Netlify, vá em **Deploys**
2. Clique em **"Trigger deploy"** → **"Clear cache and deploy site"**
3. Aguarde o deploy

### Passo 3: Testar

1. Acesse seu site no Netlify
2. O dashboard deve carregar! ✅

---

## 📝 Resumo das URLs

Após configurar tudo, você terá:

- **Frontend**: `https://seu-site.netlify.app`
- **Backend**: `https://seu-backend.vercel.app`
- **Banco de Dados**: Supabase (interno)

---

## 🔧 Verificação

### Testar Backend:

Acesse: `https://seu-backend.vercel.app/api/health`

Deve retornar:
```json
{
  "status": "ok",
  "message": "GamePass Manager API rodando!"
}
```

### Testar Frontend:

1. Acesse seu site no Netlify
2. O dashboard deve carregar sem erro 404

---

## 🐛 Troubleshooting

### Erro 404 no Frontend

**Causa**: Backend não está acessível ou URL errada

**Solução**:
1. Verifique se o backend está rodando (teste `/api/health`)
2. Verifique a variável `VITE_API_URL` no Netlify
3. Faça novo deploy no Netlify

### Erro "Cannot connect to database"

**Causa**: Supabase não configurado ou credenciais erradas

**Solução**:
1. Verifique `SUPABASE_URL` e `SUPABASE_ANON_KEY` no backend
2. Verifique se as tabelas foram criadas no Supabase
3. Teste a conexão no SQL Editor do Supabase

### Backend não inicia no Vercel

**Causa**: Configuração incorreta do `vercel.json`

**Solução**:
1. Verifique se `api/index.js` existe
2. Verifique se `vercel.json` está correto
3. Veja os logs de build no Vercel

---

## ✅ Checklist Final

- [ ] Supabase criado e tabelas criadas
- [ ] Backend deployado (Vercel/Railway)
- [ ] Variáveis de ambiente configuradas no backend
- [ ] Variável `VITE_API_URL` configurada no Netlify
- [ ] Novo deploy feito no Netlify
- [ ] Teste: `/api/health` funciona
- [ ] Teste: Dashboard carrega no Netlify

---

**Pronto! Seu sistema completo está no ar! 🎉**




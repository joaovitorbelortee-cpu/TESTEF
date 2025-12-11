# 🔧 Configurar Netlify para Conectar ao Backend

## 📋 Passo a Passo

### 1. Acessar Configurações

1. No Netlify, vá em seu site
2. Clique em **"Site settings"** (menu lateral)
3. Role até **"Environment variables"**
4. Clique em **"Add variable"**

---

### 2. Adicionar Variável de Ambiente

**Nome da variável:**
```
VITE_API_URL
```

**Valor:**
```
https://seu-backend.vercel.app/api
```

**⚠️ IMPORTANTE:** 
- Substitua `seu-backend.vercel.app` pela URL real do seu backend no Vercel
- A URL deve terminar com `/api` (não esqueça!)

**Exemplo:**
```
https://gamepass-manager-api.vercel.app/api
```

---

### 3. Fazer Novo Deploy

Após adicionar a variável:

1. Vá em **"Deploys"** (menu superior)
2. Clique nos **3 pontinhos** (⋯) ao lado do último deploy
3. Selecione **"Trigger deploy"** → **"Clear cache and deploy site"**
4. Aguarde o deploy (1-2 minutos)

---

### 4. Verificar

1. Acesse seu site no Netlify
2. O dashboard deve carregar sem erro 404! ✅

---

## 🔍 Como Saber a URL do Backend?

### Se você fez deploy no Vercel:

1. Acesse: https://vercel.com
2. Vá em seu projeto
3. A URL aparece no topo: `https://seu-projeto.vercel.app`
4. Adicione `/api` no final: `https://seu-projeto.vercel.app/api`

---

## 🐛 Problemas Comuns

### Variável não funciona

**Solução:**
- Certifique-se de que o nome é exatamente: `VITE_API_URL`
- Certifique-se de que a URL termina com `/api`
- Faça novo deploy após adicionar a variável

### Ainda dá erro 404

**Solução:**
1. Teste o backend diretamente: `https://seu-backend.vercel.app/api/health`
2. Se não funcionar, o backend não está rodando
3. Verifique o deploy do backend no Vercel

### Dashboard carrega mas não mostra dados

**Solução:**
- Verifique se o Supabase está configurado no backend
- Verifique se as tabelas foram criadas no Supabase
- Veja os logs do backend no Vercel

---

**Pronto! Frontend conectado ao backend! ✅**





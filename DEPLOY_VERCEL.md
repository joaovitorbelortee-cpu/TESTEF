# 🚀 Guia de Deploy no Vercel

## ✅ Configuração Completa

O projeto está configurado para deploy no Vercel com:
- ✅ Frontend (Admin + Portal) - Build estático
- ✅ Backend API - Serverless Functions
- ✅ URLs dinâmicas (funciona em produção e desenvolvimento)

---

## 📋 Passo a Passo para Deploy

### 1. Preparar o Projeto

```bash
# Instalar dependências
npm install
```

### 2. Fazer Build Local (Teste)

```bash
npm run build
```

### 3. Deploy no Vercel

#### Opção A: Via CLI (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer login
vercel login

# Deploy
vercel

# Deploy em produção
vercel --prod
```

#### Opção B: Via Dashboard Vercel

1. Acesse: https://vercel.com
2. Clique em "Add New Project"
3. Conecte seu repositório GitHub/GitLab
4. Configure:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Clique em "Deploy"

---

## 🔧 Variáveis de Ambiente (Opcional)

No painel do Vercel, adicione variáveis de ambiente se necessário:

- `VITE_API_URL` - Deixe vazio para usar a mesma origem
- `JWT_SECRET` - Chave secreta para JWT (padrão: supersecretjwtkey)

---

## 📁 Estrutura de Arquivos

```
/
├── api/
│   └── index.js          # Serverless Function (Backend)
├── dist/                  # Build do frontend (gerado)
├── server/                # Código do backend
├── components/            # Componentes do admin
├── portal/                # Portal do cliente
├── vercel.json            # Configuração do Vercel
└── package.json
```

---

## 🌐 URLs Após Deploy

Após o deploy, você terá:

- **Admin Dashboard:** `https://seu-projeto.vercel.app`
- **Portal Cliente:** `https://seu-projeto.vercel.app/portal`
- **API:** `https://seu-projeto.vercel.app/api`

---

## ⚠️ Importante

1. **Banco de Dados:** 
   - No Vercel, o arquivo será salvo em `/tmp/gamepass-data.json`
   - ⚠️ **ATENÇÃO:** No Vercel Serverless, os arquivos em `/tmp` são temporários e são apagados após cada deploy
   - Para produção real, **recomendo migrar para um banco de dados** (MongoDB Atlas, Supabase, PostgreSQL, etc.)
   
2. **Persistência de Dados:**
   - Os dados serão perdidos a cada novo deploy
   - Para produção, use um banco de dados real
   
3. **Webhooks:** Configure as URLs dos webhooks para apontar para: `https://seu-projeto.vercel.app/api/webhook/...`

---

## 🐛 Troubleshooting

### Erro: "Cannot find module"
- Verifique se todas as dependências estão no `package.json`
- Execute `npm install` novamente

### Erro: "API not found"
- Verifique se o arquivo `api/index.js` existe
- Verifique as rotas no `vercel.json`

### Build falha
- Verifique os logs no Vercel
- Teste o build local: `npm run build`

---

## 📝 Próximos Passos (Opcional)

Para produção, considere:
- [ ] Migrar para banco de dados real (MongoDB Atlas, Supabase, etc.)
- [ ] Adicionar autenticação JWT mais robusta
- [ ] Configurar domínio customizado
- [ ] Adicionar monitoramento de erros (Sentry)

---

**Pronto para deploy! 🚀**


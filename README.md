# 🎮 GamePass Manager - Sistema Completo de Gestão

Sistema completo de gestão de contas GamePass Ultimate com painel administrativo, portal do cliente, automação de vendas e integração com Supabase.

## ✨ Funcionalidades

### 🎯 Painel Administrativo
- **Dashboard Completo**: Métricas em tempo real, faturamento, lucro, estoque
- **Gerenciamento de Contas**: CRUD completo, filtros por status (disponíveis, vendidas, vencendo, vencidas)
- **Gestão de Clientes**: Base de clientes, tags (novo, recorrente, VIP), histórico de compras
- **Controle de Vendas**: Registro de vendas, cálculo automático de lucro
- **Sistema de Alertas**: Contas vencendo, precisando renovar, vencidas
- **Exportação CSV**: Dados de clientes formatados para Meta Ads

### 🌐 Portal do Cliente
- **Login/Cadastro**: Autenticação por email e senha
- **Minha Conta**: Visualização de conta ativa, credenciais, dias restantes
- **Histórico de Compras**: Todas as compras realizadas
- **Renovação**: Botão direto para WhatsApp para renovar

### 🔧 Backend
- **API RESTful**: Endpoints completos para todas as operações
- **Banco de Dados**: Supabase (PostgreSQL) ou JSON local (fallback)
- **Autenticação**: JWT para portal do cliente
- **Webhooks**: Suporte para integração com gateways de pagamento

## 🚀 Tecnologias

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express
- **Banco de Dados**: Supabase (PostgreSQL) ou JSON
- **Estilização**: Tailwind CSS + CSS Custom
- **Ícones**: Lucide React
- **Deploy**: Vercel (Frontend + Backend Serverless)

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta no Supabase (opcional, pode usar JSON local)

## 🛠️ Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/gamepass-manager.git
cd gamepass-manager
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz:

```env
# Supabase (Opcional - se não configurar, usa JSON local)
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-chave-anon

# JWT Secret (para autenticação)
JWT_SECRET=supersecretjwtkey

# API URL (deixe vazio para usar a mesma origem)
VITE_API_URL=
```

### 4. Configure o Supabase (Opcional)

Se quiser usar Supabase:

1. Crie um projeto em https://supabase.com
2. Execute o SQL do arquivo `supabase-schema.sql` no SQL Editor
3. Configure as variáveis `SUPABASE_URL` e `SUPABASE_ANON_KEY` no `.env`

**📖 Guia completo:** Veja `SETUP_SUPABASE.md`

### 5. Inicie o servidor

```bash
# Desenvolvimento (frontend + backend)
npm run dev:all

# Ou separadamente:
npm run dev          # Frontend (porta 3000)
npm run dev:server   # Backend (porta 3001)
```

### 6. Acesse a aplicação

- **Admin Dashboard**: http://localhost:3000
- **Portal Cliente**: http://localhost:3000/portal
- **API**: http://localhost:3001/api

## 📁 Estrutura do Projeto

```
gamepass-manager/
├── components/          # Componentes React do admin
│   ├── Dashboard.tsx
│   ├── AccountsManager.tsx
│   ├── ClientsManager.tsx
│   ├── SalesManager.tsx
│   └── AlertsPanel.tsx
├── portal/              # Portal do cliente
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── MyAccount.tsx
│   └── PortalApp.tsx
├── server/              # Backend
│   ├── index.js         # Servidor Express
│   ├── database.js      # Banco JSON (fallback)
│   ├── database-supabase.js  # Banco Supabase
│   ├── supabase.js      # Configuração Supabase
│   └── routes/          # Rotas da API
├── services/            # Serviços frontend
│   └── api.ts           # Cliente API
├── utils/               # Utilitários
│   └── apiConfig.ts     # Configuração de URLs
├── api/                 # Serverless Functions (Vercel)
│   └── index.js
├── supabase-schema.sql  # Schema do banco Supabase
└── vercel.json          # Configuração Vercel
```

## 🚀 Deploy

### Deploy no Vercel

1. **Via CLI:**
```bash
npm i -g vercel
vercel login
vercel --prod
```

2. **Via Dashboard:**
   - Conecte seu repositório GitHub no Vercel
   - Configure as variáveis de ambiente
   - Deploy automático!

**📖 Guia completo:** Veja `DEPLOY_VERCEL.md`

## 📊 Funcionalidades Principais

### Gerenciamento de Contas
- ✅ Criar, editar, deletar contas
- ✅ Filtros: Todas, Disponíveis, Vendidas, Precisa Renovar, Vencidas
- ✅ Status automático: available, sold, expiring, expired, pending_renewal
- ✅ Cálculo automático de dias restantes

### Sistema de Vendas
- ✅ Criar vendas vinculando conta + cliente
- ✅ Cálculo automático de lucro
- ✅ Atualização automática de tags de clientes (novo → recorrente → VIP)
- ✅ Histórico completo de vendas

### Alertas Inteligentes
- ✅ **Vencendo**: Contas que vencem nos próximos 7 dias
- ✅ **Precisa Renovar**: Contas vencidas com venda (renovação manual)
- ✅ **Vencidas**: Contas expiradas sem venda vinculada
- ✅ Informações de contato (WhatsApp) para renovação

### Portal do Cliente
- ✅ Login seguro com JWT
- ✅ Visualização de conta ativa
- ✅ Histórico de compras
- ✅ Botão direto para renovação via WhatsApp

## 🔐 Segurança

- Senhas com hash SHA-256
- Tokens JWT para autenticação
- CORS configurado
- Validação de dados no backend

## 📝 Scripts Disponíveis

```bash
npm run dev              # Inicia frontend (Vite)
npm run dev:server       # Inicia backend (Express)
npm run dev:all          # Inicia ambos simultaneamente
npm run build            # Build para produção
npm run preview          # Preview do build
npm run vercel-build     # Build para Vercel
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Se tiver dúvidas ou problemas:

1. Verifique a documentação em `SETUP_SUPABASE.md` e `DEPLOY_VERCEL.md`
2. Abra uma issue no GitHub
3. Verifique os logs do servidor

## 🎯 Roadmap

- [ ] Integração com WhatsApp API (Z-API/Evolution API)
- [ ] Integração com gateways de pagamento (Mercado Pago, PagSeguro)
- [ ] Automação completa via N8N
- [ ] Dashboard de analytics avançado
- [ ] Sistema de notificações por email
- [ ] App mobile (React Native)

## 👨‍💻 Autor

**AssinaliveBr**

---

⭐ Se este projeto te ajudou, considere dar uma estrela no GitHub!

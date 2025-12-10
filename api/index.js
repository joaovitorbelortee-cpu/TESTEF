// Vercel Serverless Function - Wrapper para o Express
import express from 'express';
import cors from 'cors';
import { initDatabase } from '../server/database.js';
import accountsRoutes from '../server/routes/accounts.js';
import clientsRoutes from '../server/routes/clients.js';
import salesRoutes from '../server/routes/sales.js';
import dashboardRoutes from '../server/routes/dashboard.js';
import portalRoutes from '../server/routes/portal.js';
import webhookRoutes from '../server/routes/webhook.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Inicializar banco de dados
initDatabase();

// Rotas
app.use('/api/accounts', accountsRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/portal', portalRoutes);
app.use('/api/webhook', webhookRoutes);

// Rota de teste
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'GamePass Manager API rodando!' });
});

// Exportar para Vercel Serverless
export default app;



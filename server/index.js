import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import express from 'express';
import cors from 'cors';
// Tenta usar Supabase, se não estiver configurado, usa JSON
let initDatabase;
try {
  const supabaseDb = await import('./database-supabase.js');
  initDatabase = supabaseDb.initDatabase;
} catch (e) {
  const jsonDb = await import('./database.js');
  initDatabase = jsonDb.initDatabase;
}
import accountsRoutes from './routes/accounts.js';
import clientsRoutes from './routes/clients.js';
import salesRoutes from './routes/sales.js';
import dashboardRoutes from './routes/dashboard.js';
import portalRoutes from './routes/portal.js';
import webhookRoutes from './routes/webhook.js';

const app = express();
const PORT = process.env.PORT || 3001;

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

app.listen(PORT, () => {
  console.log('');
  console.log('🎮 ========================================');
  console.log('   GAMEPASS MANAGER - API RODANDO!');
  console.log('========================================');
  console.log('');
  console.log(`📊 Admin Dashboard: http://localhost:5173`);
  console.log(`🌐 Portal Cliente:  http://localhost:5173/portal`);
  console.log(`🔗 API:             http://localhost:${PORT}/api`);
  console.log('');
  console.log('Endpoints disponíveis:');
  console.log('  GET  /api/dashboard       - Métricas gerais');
  console.log('  GET  /api/accounts        - Listar contas');
  console.log('  GET  /api/accounts/status/sold - Contas vendidas');
  console.log('  GET  /api/accounts/status/pending-renewal - Contas que precisam renovar');
  console.log('  POST /api/portal/login    - Login do cliente');
  console.log('  POST /api/portal/register - Cadastro do cliente');
  console.log('  GET  /api/portal/my-account - Conta do cliente');
  console.log('  POST /api/webhook/renewal-needed - Webhook para marcar renovação');
  console.log('');
});

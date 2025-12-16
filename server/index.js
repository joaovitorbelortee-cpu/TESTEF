import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import express from 'express';
import cors from 'cors';
console.log('🚀 Iniciando servidor...');
// Tenta usar Supabase, se não estiver configurado, usa JSON
let initDatabase;
try {
  console.log('📦 Tentando carregar Supabase DB...');
  const supabaseDb = await import('./database-supabase.js');
  console.log('✅ Supabase DB carregado');
  initDatabase = supabaseDb.initDatabase;
} catch (e) {
  console.error('❌ Erro carregar Supabase:', e);
  console.log('📦 Tentando carregar JSON DB local...');
  try {
    const jsonDb = await import('./database.js');
    console.log('✅ JSON DB carregado');
    initDatabase = jsonDb.initDatabase;
  } catch (err2) {
    console.error('❌❌ FATAL: Erro carregar JSON DB:', err2);
    process.exit(1);
  }
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
  console.log('Endpoints para N8N:');
  console.log('  POST /api/webhook/n8n/sale        - Registrar venda');
  console.log('  POST /api/webhook/n8n/add-account - Adicionar conta');
  console.log('  POST /api/webhook/n8n/renew       - Renovar conta');
  console.log('  GET  /api/webhook/n8n/expiring    - Contas expirando');
  console.log('  GET  /api/webhook/n8n/expired     - Contas expiradas');
  console.log('  GET  /api/webhook/n8n/stock       - Estoque disponível');
  console.log('');
});

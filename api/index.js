// Netlify Serverless Function - Wrapper para o Express
import express from 'express';
import cors from 'cors';

// Import routes directly (they don't use top-level await)
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

// Database initialization flag
let dbInitialized = false;

// Initialize database lazily on first request
const ensureDbInitialized = async (req, res, next) => {
  if (!dbInitialized) {
    try {
      // Try Supabase first
      if (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL) {
        const { initDatabase } = await import('../server/database-supabase.js');
        await initDatabase();
        console.log('✅ Supabase database initialized');
      } else {
        const { initDatabase } = await import('../server/database.js');
        await initDatabase();
        console.log('✅ JSON database initialized');
      }
      dbInitialized = true;
    } catch (error) {
      console.error('❌ Database initialization error:', error);
      // Try fallback to JSON
      try {
        const { initDatabase } = await import('../server/database.js');
        await initDatabase();
        dbInitialized = true;
        console.log('✅ Fallback to JSON database');
      } catch (e) {
        console.error('❌ Complete database failure:', e);
      }
    }
  }
  next();
};

// Apply database initialization middleware
app.use(ensureDbInitialized);

// Rotas
app.use('/api/accounts', accountsRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/portal', portalRoutes);
app.use('/api/webhook', webhookRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'GamePass Manager API rodando!',
    dbInitialized
  });
});

// Exportar para Netlify/Vercel Serverless
export default app;

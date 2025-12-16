import express from 'express';
import { db } from '../database.js';
import webhookEvents from '../webhook-service.js';

const router = express.Router();

// Middleware de Autenticação para Endpoints Críticos (n8n/API)
const apiKeyAuth = (req, res, next) => {
  // Para requisições do frontend (browser), não pede token (ou usa outra auth)
  // Para rotas específicas que o n8n vai chamar, exige chave ou token

  // Se for uma das rotas protegidas
  if (req.path === '/expiring' || req.path === '/renew') {
    const authHeader = req.headers['authorization'];
    const apiKey = req.headers['x-api-key'];

    // Verificar Bearer Token
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      if (token === process.env.API_ADMIN_TOKEN) {
        return next();
      }
    }

    // Verificar API Key
    if (apiKey && apiKey === process.env.API_ADMIN_TOKEN) {
      return next();
    }

    return res.status(401).json({ error: 'Acesso não autorizado. Chave de API inválida.' });
  }

  next();
};

router.use(apiKeyAuth);

// ===========================================
// Rotas solicitadas pelo n8n
// ===========================================

// GET /api/sales/expiring
router.get('/expiring', (req, res) => {
  try {
    const expiringAccounts = db.getExpiringAccounts();
    res.json({
      success: true,
      count: expiringAccounts.length,
      accounts: expiringAccounts.map(a => ({
        id: a.id,
        email: a.email,
        expiry_date: a.expiry_date,
        days_left: a.days_left,
        client_name: a.client_name,
        client_email: a.client_email,
        client_whatsapp: a.client_whatsapp
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/sales/renew
router.put('/renew', async (req, res) => {
  try {
    const { client_email, new_expiry_date, new_account_email, new_account_password } = req.body;

    if (!client_email) {
      return res.status(400).json({ error: 'client_email é obrigatório' });
    }

    const client = await db.getClientByEmail(client_email);
    if (!client) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    const currentAccount = await db.getClientActiveAccount(client.id);

    if (new_account_email && new_account_password) {
      // Renovação com troca de conta
      if (currentAccount) {
        await db.updateAccount(currentAccount.id, { status: 'expired' });
      }

      let newAccount = (await db.getAllAccounts()).find(a => a.email === new_account_email);
      if (!newAccount) {
        newAccount = await db.createAccount({
          email: new_account_email,
          password: new_account_password,
          purchase_date: new Date().toISOString().split('T')[0],
          expiry_date: new_expiry_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          cost: 35,
          notes: 'Renovação via API'
        });
      }

      const sale = await db.createSale({
        client_id: client.id,
        account_id: newAccount.id,
        sale_price: 69,
        payment_method: 'api-renewal'
      });

      // Disparar webhook n8n para renovação (tratado como venda/renovação com nova conta)
      try {
        const accountObj = {
          id: newAccount.id,
          email: newAccount.email,
          expiry_date: newAccount.expiry_date,
          status: newAccount.status
        };
        const clientObj = {
          id: client.id,
          name: client.name,
          email: client.email,
          whatsapp: client.whatsapp
        };
        const saleObj = {
          id: sale.id,
          sale_price: sale.sale_price,
          profit: sale.profit,
          created_at: sale.created_at
        };

        // Usa accountSold pois é semanticamente similar (venda de renovação) e suporta a URL específica de vendas se necessário
        // Dependendo da lógica do usuário, pode querer separar, mas o N8N_SALES_WEBHOOK é para "new-sale"
        // Create extra data object for the simplified webhook
        const extraData = {
          payment_method: 'api-renewal',
          payment_id: `RENEW-${sale.id}` // Generate a transaction ID for renewals
        };

        await webhookEvents.accountSold(accountObj, clientObj, saleObj, extraData);
      } catch (n8nError) {
        console.error('[N8N] Error triggering renewal webhook via webhookEvents:', n8nError);
      }

      return res.json({
        success: true,
        message: 'Conta renovada com nova conta',
        account: newAccount
      });

    } else if (currentAccount && new_expiry_date) {
      // Renovação estendendo prazo
      const updatedAccount = await db.updateAccount(currentAccount.id, {
        expiry_date: new_expiry_date,
        status: 'sold'
      });

      return res.json({
        success: true,
        message: 'Data de expiração estendida',
        account: updatedAccount
      });
    }

    res.status(400).json({ error: 'Dados insuficientes para renovação' });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ===========================================
// Rotas Padrão
// ===========================================

// Listar todas as vendas
router.get('/', (req, res) => {
  try {
    const sales = db.getAllSales();
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Buscar venda por ID
router.get('/:id', (req, res) => {
  try {
    const sale = db.getSaleById(parseInt(req.params.id));
    if (!sale) {
      return res.status(404).json({ error: 'Venda não encontrada' });
    }
    res.json(sale);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Registrar nova venda
router.post('/', async (req, res) => {
  try {
    const sale = await db.createSale(req.body);

    // Disparar webhook n8n usando o serviço unificado
    try {
      // Reconstruir objetos necessários para o webhookEvent
      // sale já contém dados combinados (joins) retornados pelo db.createSale -> db.getSaleById

      const accountObj = {
        id: sale.account_id,
        email: sale.account_email,
        expiry_date: sale.account_expiry,
        status: 'sold' // Assumindo status sold após venda
      };

      const clientObj = {
        id: sale.client_id,
        name: sale.client_name,
        email: sale.client_email,
        whatsapp: sale.client_whatsapp
      };

      const saleObj = {
        id: sale.id,
        sale_price: sale.sale_price,
        profit: sale.profit,
        created_at: sale.created_at
      };

      const extraData = {
        payment_method: req.body.payment_method || 'pix',
        payment_id: req.body.payment_id || `SALE-${sale.id}`
      };

      await webhookEvents.accountSold(accountObj, clientObj, saleObj, extraData);
    } catch (n8nError) {
      console.error('[N8N] Error triggering sale webhook via webhookEvents:', n8nError);
      // Não falhar a venda se o n8n falhar
    }

    res.status(201).json(sale);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Deletar venda (estornar)
router.delete('/:id', (req, res) => {
  try {
    db.deleteSale(parseInt(req.params.id));
    res.json({ message: 'Venda estornada com sucesso' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Vendas de hoje
router.get('/period/today', (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const sales = db.getAllSales().filter(s => s.created_at.startsWith(today));
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vendas da semana
router.get('/period/week', (req, res) => {
  try {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const sales = db.getAllSales().filter(s => new Date(s.created_at) >= weekAgo);
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vendas do mês
router.get('/period/month', (req, res) => {
  try {
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const sales = db.getAllSales().filter(s => new Date(s.created_at) >= monthAgo);
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

import express from 'express';
import { db } from '../database.js';
import webhookEvents from '../webhook-service.js';

const router = express.Router();

// =====================================================
// ENDPOINTS PARA O N8N CHAMAR (Incoming Webhooks)
// =====================================================

/**
 * N8N -> Sistema: Registrar uma nova venda
 * POST /api/webhook/n8n/sale
 * Body: { client_email, client_name, client_whatsapp?, account_email?, sale_price }
 */
router.post('/n8n/sale', async (req, res) => {
  try {
    const { client_email, client_name, client_whatsapp, account_email, sale_price } = req.body;

    if (!client_email || !client_name || !sale_price) {
      return res.status(400).json({
        error: 'client_email, client_name e sale_price são obrigatórios'
      });
    }

    // Buscar ou criar cliente
    let client = db.getClientByEmail(client_email);
    if (!client) {
      client = db.createClient({
        name: client_name,
        email: client_email,
        whatsapp: client_whatsapp || '',
        tag: 'novo'
      });
    }

    // Buscar conta disponível (preferir por email ou pegar qualquer uma)
    let account;
    if (account_email) {
      const accounts = db.getAllAccounts();
      account = accounts.find(a => a.email === account_email && a.status === 'available');
    }

    if (!account) {
      const availableAccounts = db.getAvailableAccounts();
      if (availableAccounts.length === 0) {
        return res.status(404).json({
          error: 'Nenhuma conta disponível no estoque'
        });
      }
      account = availableAccounts[0];
    }

    // Criar venda
    const sale = db.createSale({
      client_id: client.id,
      account_id: account.id,
      sale_price: parseFloat(sale_price),
      payment_method: 'n8n'
    });

    // Enviar webhook de confirmação
    await webhookEvents.accountSold(account, client, sale);

    res.json({
      success: true,
      message: 'Venda registrada com sucesso',
      sale: {
        id: sale.id,
        client_name: client.name,
        client_email: client.email,
        account_email: account.email,
        account_password: account.password,
        expiry_date: account.expiry_date,
        price: sale.sale_price
      }
    });
  } catch (error) {
    console.error('Erro no webhook n8n/sale:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * N8N -> Sistema: Adicionar nova conta ao estoque
 * POST /api/webhook/n8n/add-account
 * Body: { email, password, expiry_date, cost?, notes? }
 */
router.post('/n8n/add-account', async (req, res) => {
  try {
    const { email, password, expiry_date, cost, notes } = req.body;

    if (!email || !password || !expiry_date) {
      return res.status(400).json({
        error: 'email, password e expiry_date são obrigatórios'
      });
    }

    const account = db.createAccount({
      email,
      password,
      purchase_date: new Date().toISOString().split('T')[0],
      expiry_date,
      cost: cost || 35,
      notes: notes || 'Adicionada via n8n'
    });

    // Enviar webhook de confirmação
    await webhookEvents.accountAdded(account);

    res.json({
      success: true,
      message: 'Conta adicionada ao estoque',
      account: {
        id: account.id,
        email: account.email,
        expiry_date: account.expiry_date,
        status: account.status
      }
    });
  } catch (error) {
    console.error('Erro no webhook n8n/add-account:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * N8N -> Sistema: Renovar uma conta existente
 * POST /api/webhook/n8n/renew
 * Body: { client_email, new_expiry_date, new_account_email?, new_account_password? }
 */
router.post('/n8n/renew', async (req, res) => {
  try {
    const { client_email, new_expiry_date, new_account_email, new_account_password } = req.body;

    if (!client_email) {
      return res.status(400).json({
        error: 'client_email é obrigatório'
      });
    }

    const client = db.getClientByEmail(client_email);
    if (!client) {
      return res.status(404).json({
        error: 'Cliente não encontrado'
      });
    }

    const currentAccount = db.getClientActiveAccount(client.id);

    if (new_account_email && new_account_password) {
      // Renovação com nova conta
      // Marcar conta antiga como expirada se existir
      if (currentAccount) {
        db.updateAccount(currentAccount.id, { status: 'expired' });
      }

      // Buscar ou criar nova conta
      let newAccount = db.getAllAccounts().find(a => a.email === new_account_email);
      if (!newAccount) {
        newAccount = db.createAccount({
          email: new_account_email,
          password: new_account_password,
          purchase_date: new Date().toISOString().split('T')[0],
          expiry_date: new_expiry_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          cost: 35,
          notes: 'Renovação via n8n'
        });
      }

      // Criar nova venda
      const sale = db.createSale({
        client_id: client.id,
        account_id: newAccount.id,
        sale_price: 69,
        payment_method: 'n8n-renewal'
      });

      res.json({
        success: true,
        message: 'Conta renovada com nova conta',
        account: {
          id: newAccount.id,
          email: newAccount.email,
          password: newAccount.password,
          expiry_date: newAccount.expiry_date
        }
      });
    } else if (currentAccount && new_expiry_date) {
      // Apenas estender a data de expiração
      const updatedAccount = db.updateAccount(currentAccount.id, {
        expiry_date: new_expiry_date,
        status: 'sold'
      });

      res.json({
        success: true,
        message: 'Data de expiração estendida',
        account: {
          id: updatedAccount.id,
          email: updatedAccount.email,
          expiry_date: updatedAccount.expiry_date
        }
      });
    } else {
      return res.status(400).json({
        error: 'Forneça new_expiry_date ou new_account_email + new_account_password'
      });
    }
  } catch (error) {
    console.error('Erro no webhook n8n/renew:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * N8N -> Sistema: Consultar contas expirando
 * GET /api/webhook/n8n/expiring
 */
router.get('/n8n/expiring', (req, res) => {
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
    console.error('Erro no webhook n8n/expiring:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * N8N -> Sistema: Consultar contas expiradas (pending renewal)
 * GET /api/webhook/n8n/expired
 */
router.get('/n8n/expired', (req, res) => {
  try {
    const expiredAccounts = db.getPendingRenewalAccounts();

    res.json({
      success: true,
      count: expiredAccounts.length,
      accounts: expiredAccounts.map(a => ({
        id: a.id,
        email: a.email,
        expiry_date: a.expiry_date,
        days_expired: a.days_expired,
        client_name: a.client_name,
        client_email: a.client_email,
        client_whatsapp: a.client_whatsapp
      }))
    });
  } catch (error) {
    console.error('Erro no webhook n8n/expired:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * N8N -> Sistema: Consultar estoque disponível
 * GET /api/webhook/n8n/stock
 */
router.get('/n8n/stock', (req, res) => {
  try {
    const availableAccounts = db.getAvailableAccounts();

    res.json({
      success: true,
      count: availableAccounts.length,
      accounts: availableAccounts.map(a => ({
        id: a.id,
        email: a.email,
        expiry_date: a.expiry_date,
        cost: a.cost
      }))
    });
  } catch (error) {
    console.error('Erro no webhook n8n/stock:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// =====================================================
// ENDPOINTS LEGADOS (Compatibilidade)
// =====================================================

// Webhook para receber notificação de vencimento (do N8N ou outro sistema)
router.post('/account-expired', (req, res) => {
  try {
    const { account_id, client_email } = req.body;

    if (!account_id || !client_email) {
      return res.status(400).json({
        error: 'account_id e client_email são obrigatórios'
      });
    }

    // Marcar conta como precisa renovar
    const result = db.markAccountForRenewal(account_id, client_email);

    res.json({
      success: true,
      message: 'Conta marcada para renovação',
      account: {
        id: result.account.id,
        email: result.account.email,
        status: result.account.status
      },
      client: {
        id: result.client.id,
        name: result.client.name,
        email: result.client.email
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Webhook genérico para renovação (pode ser chamado por qualquer sistema)
router.post('/renewal-needed', (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: 'email é obrigatório'
      });
    }

    // Buscar cliente pelo email
    const client = db.getClientByEmail(email);
    if (!client) {
      return res.status(404).json({
        error: 'Cliente não encontrado'
      });
    }

    // Buscar conta ativa do cliente
    const account = db.getClientActiveAccount(client.id);
    if (!account) {
      return res.status(404).json({
        error: 'Nenhuma conta ativa encontrada para este cliente'
      });
    }

    // Verificar se já expirou
    const daysLeft = db.getDaysUntilExpiry(account.expiry_date);
    if (daysLeft > 0) {
      return res.json({
        success: false,
        message: 'Conta ainda não expirou',
        days_left: daysLeft
      });
    }

    // Marcar como precisa renovar
    const result = db.markAccountForRenewal(account.id, email);

    res.json({
      success: true,
      message: 'Conta marcada para renovação',
      account: {
        id: result.account.id,
        email: result.account.email,
        status: result.account.status,
        expiry_date: result.account.expiry_date
      },
      client: {
        id: result.client.id,
        name: result.client.name,
        email: result.client.email
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

export default router;

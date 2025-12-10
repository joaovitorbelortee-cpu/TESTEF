import express from 'express';
import { db } from '../database.js';

const router = express.Router();

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



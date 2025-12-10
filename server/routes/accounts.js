import express from 'express';
import { db } from '../database.js';

const router = express.Router();

// Listar todas as contas
router.get('/', (req, res) => {
  try {
    const accounts = db.getAllAccounts();
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Buscar conta por ID
router.get('/:id', (req, res) => {
  try {
    const account = db.getAccountById(parseInt(req.params.id));
    if (!account) {
      return res.status(404).json({ error: 'Conta não encontrada' });
    }
    res.json(account);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Criar nova conta
router.post('/', (req, res) => {
  try {
    const account = db.createAccount(req.body);
    res.status(201).json(account);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Atualizar conta
router.put('/:id', (req, res) => {
  try {
    const account = db.updateAccount(parseInt(req.params.id), req.body);
    if (!account) {
      return res.status(404).json({ error: 'Conta não encontrada' });
    }
    res.json(account);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Deletar conta
router.delete('/:id', (req, res) => {
  try {
    const { force } = req.query; // Permite forçar exclusão de contas vendidas
    db.deleteAccount(parseInt(req.params.id), force === 'true');
    res.json({ message: 'Conta deletada com sucesso' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Listar contas disponíveis
router.get('/status/available', (req, res) => {
  try {
    const accounts = db.getAvailableAccounts();
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Listar contas vendidas
router.get('/status/sold', (req, res) => {
  try {
    const accounts = db.getSoldAccounts();
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Listar contas vencendo
router.get('/status/expiring', (req, res) => {
  try {
    const accounts = db.getExpiringAccounts();
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Listar contas que precisam renovar (vencidas)
router.get('/status/pending-renewal', (req, res) => {
  try {
    const accounts = db.getPendingRenewalAccounts();
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Listar contas vencidas (sem venda)
router.get('/status/expired', (req, res) => {
  try {
    const accounts = db.getExpiredAccounts();
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

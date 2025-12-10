import express from 'express';
import { db } from '../database.js';

const router = express.Router();

// Listar todos os clientes
router.get('/', (req, res) => {
  try {
    const clients = db.getAllClients();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Buscar cliente por ID
router.get('/:id', (req, res) => {
  try {
    const client = db.getClientById(parseInt(req.params.id));
    if (!client) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Criar novo cliente
router.post('/', (req, res) => {
  try {
    const client = db.createClient(req.body);
    res.status(201).json(client);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Atualizar cliente
router.put('/:id', (req, res) => {
  try {
    const client = db.updateClient(parseInt(req.params.id), req.body);
    if (!client) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Deletar cliente
router.delete('/:id', (req, res) => {
  try {
    db.deleteClient(parseInt(req.params.id));
    res.json({ message: 'Cliente deletado com sucesso' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Buscar cliente por WhatsApp
router.get('/whatsapp/:number', (req, res) => {
  try {
    const client = db.getClientByWhatsapp(req.params.number);
    if (!client) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Clientes com contas vencendo
router.get('/alerts/expiring', (req, res) => {
  try {
    const accounts = db.getExpiringAccounts();
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

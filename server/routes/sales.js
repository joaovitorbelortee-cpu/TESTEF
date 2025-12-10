import express from 'express';
import { db } from '../database.js';

const router = express.Router();

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
router.post('/', (req, res) => {
  try {
    const sale = db.createSale(req.body);
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

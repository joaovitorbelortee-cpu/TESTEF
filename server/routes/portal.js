import express from 'express';
import { db } from '../database.js';

const router = express.Router();

// Middleware de autenticação
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }
  
  const client = db.validateToken(token);
  
  if (!client) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
  
  req.client = client;
  next();
};

// Registrar no portal (primeiro acesso)
router.post('/register', (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: 'Senha deve ter no mínimo 6 caracteres' });
    }
    
    const result = db.registerClientPortal(email, password);
    res.json({ message: 'Cadastro realizado com sucesso!', client: result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login no portal
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }
    
    const result = db.loginClientPortal(email, password);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Verificar se email tem compra (para saber se pode cadastrar)
router.post('/check-email', (req, res) => {
  try {
    const { email } = req.body;
    
    const client = db.getClientByEmail(email);
    
    if (!client) {
      return res.json({ 
        exists: false, 
        hasPassword: false,
        message: 'Email não encontrado' 
      });
    }
    
    // Verificar se tem compras
    const purchases = db.getClientPurchaseHistory(client.id);
    
    res.json({ 
      exists: true, 
      hasPassword: !!client.password_hash,
      hasPurchases: purchases.length > 0,
      name: client.name
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obter conta ativa do cliente (requer auth)
router.get('/my-account', authMiddleware, (req, res) => {
  try {
    const account = db.getClientActiveAccount(req.client.id);
    
    if (!account) {
      return res.status(404).json({ error: 'Nenhuma conta ativa encontrada' });
    }
    
    res.json({
      client: {
        id: req.client.id,
        name: req.client.name,
        email: req.client.email
      },
      account
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Histórico de compras (requer auth)
router.get('/purchases', authMiddleware, (req, res) => {
  try {
    const purchases = db.getClientPurchaseHistory(req.client.id);
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verificar token (para manter sessão)
router.get('/verify', authMiddleware, (req, res) => {
  res.json({
    valid: true,
    client: {
      id: req.client.id,
      name: req.client.name,
      email: req.client.email
    }
  });
});

// Logout
router.post('/logout', authMiddleware, (req, res) => {
  try {
    db.updateClient(req.client.id, { auth_token: null, token_expires: null });
    res.json({ message: 'Logout realizado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;


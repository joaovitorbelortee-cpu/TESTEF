import express from 'express';
import { db } from '../database.js';

const router = express.Router();

// Dashboard principal
router.get('/', (req, res) => {
  try {
    const dashboard = db.getDashboard();
    res.json(dashboard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Package,
  Eye,
  EyeOff,
  Copy,
  Check,
  MessageCircle,
  ShoppingCart
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import type { Account } from '../types';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');

  .manager {
    display: flex;
    flex-direction: column;
    gap: 28px;
    animation: fadeIn 0.6s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .manager-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
    padding-bottom: 24px;
    border-bottom: 1px solid rgba(57, 255, 20, 0.1);
    position: relative;
  }

  .manager-header::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 120px;
    height: 2px;
    background: linear-gradient(90deg, var(--neon-green, #39ff14), transparent);
    border-radius: 2px;
  }
  
  .manager-title {
    font-family: 'Orbitron', sans-serif;
    font-size: 32px;
    font-weight: 700;
    color: #fff;
    letter-spacing: 1px;
    text-shadow: 0 0 30px rgba(57, 255, 20, 0.2);
    position: relative;
  }

  .manager-title::before {
    content: '';
    position: absolute;
    left: -20px;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 70%;
    background: linear-gradient(180deg, var(--neon-green, #39ff14), transparent);
    border-radius: 4px;
    box-shadow: 0 0 15px var(--neon-green, #39ff14);
  }
  
  .manager-subtitle {
    font-family: 'Rajdhani', sans-serif;
    color: #7a7a8a;
    font-size: 15px;
    margin-top: 6px;
    letter-spacing: 0.5px;
  }
  
  .header-actions {
    display: flex;
    gap: 14px;
    align-items: center;
    flex-wrap: wrap;
  }
  
  .search-box {
    display: flex;
    align-items: center;
    background: linear-gradient(135deg, rgba(15, 15, 20, 0.9) 0%, rgba(10, 10, 15, 0.95) 100%);
    border: 1px solid rgba(57, 255, 20, 0.15);
    border-radius: 14px;
    padding: 0 18px;
    gap: 12px;
    min-width: 280px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }

  .search-box:focus-within {
    border-color: rgba(57, 255, 20, 0.4);
    box-shadow: 
      0 4px 20px rgba(0, 0, 0, 0.3),
      0 0 20px rgba(57, 255, 20, 0.1);
  }
  
  .search-input {
    background: transparent;
    border: none;
    color: #fff;
    padding: 14px 0;
    font-family: 'Rajdhani', sans-serif;
    font-size: 15px;
    font-weight: 500;
    flex: 1;
    outline: none;
    letter-spacing: 0.3px;
  }
  
  .search-input::placeholder {
    color: #5a5a6a;
  }
  
  .btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 24px;
    border-radius: 12px;
    font-family: 'Rajdhani', sans-serif;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: none;
    letter-spacing: 0.5px;
    position: relative;
    overflow: hidden;
  }

  .btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
    transition: left 0.4s;
  }

  .btn:hover::before {
    left: 100%;
  }
  
  .btn-primary {
    background: linear-gradient(135deg, #39ff14 0%, #20c20e 50%, #107c10 100%);
    color: #000;
    box-shadow: 0 4px 20px rgba(57, 255, 20, 0.25);
  }
  
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(57, 255, 20, 0.4);
  }
  
  .btn-secondary {
    background: linear-gradient(135deg, rgba(30, 30, 40, 0.9) 0%, rgba(20, 20, 28, 0.95) 100%);
    color: #a0a0b0;
    border: 1px solid rgba(57, 255, 20, 0.15);
  }
  
  .btn-secondary:hover {
    background: linear-gradient(135deg, rgba(40, 40, 55, 0.9) 0%, rgba(30, 30, 40, 0.95) 100%);
    color: #fff;
    border-color: rgba(57, 255, 20, 0.3);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  }
  
  .btn-danger {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.15) 100%);
    color: #ff6b6b;
    border: 1px solid rgba(239, 68, 68, 0.3);
  }
  
  .btn-danger:hover {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(220, 38, 38, 0.25) 100%);
    box-shadow: 0 4px 20px rgba(239, 68, 68, 0.2);
    transform: translateY(-1px);
  }
  
  .tabs {
    display: flex;
    gap: 6px;
    background: linear-gradient(135deg, rgba(12, 12, 18, 0.95) 0%, rgba(8, 8, 12, 0.98) 100%);
    border: 1px solid rgba(57, 255, 20, 0.1);
    border-radius: 16px;
    padding: 6px;
    box-shadow: 
      0 4px 30px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.03);
  }
  
  .tab {
    padding: 12px 22px;
    border-radius: 12px;
    font-family: 'Rajdhani', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid transparent;
    background: transparent;
    color: #6a6a7a;
    display: flex;
    align-items: center;
    gap: 10px;
    letter-spacing: 0.5px;
  }
  
  .tab:hover {
    color: #a0a0b0;
    background: rgba(57, 255, 20, 0.03);
  }
  
  .tab.active {
    background: linear-gradient(135deg, rgba(57, 255, 20, 0.12) 0%, rgba(16, 124, 16, 0.08) 100%);
    color: #39ff14;
    border-color: rgba(57, 255, 20, 0.25);
    box-shadow: 
      0 0 20px rgba(57, 255, 20, 0.1),
      inset 0 0 15px rgba(57, 255, 20, 0.05);
  }
  
  .tab-count {
    background: rgba(57, 255, 20, 0.1);
    padding: 3px 10px;
    border-radius: 8px;
    font-family: 'Orbitron', sans-serif;
    font-size: 11px;
    font-weight: 600;
  }
  
  .tab.active .tab-count {
    background: rgba(57, 255, 20, 0.25);
    box-shadow: 0 0 10px rgba(57, 255, 20, 0.3);
  }
  
  .table-container {
    background: linear-gradient(180deg, rgba(12, 12, 18, 0.95) 0%, rgba(8, 8, 12, 0.98) 100%);
    border: 1px solid rgba(57, 255, 20, 0.1);
    border-radius: 20px;
    overflow: hidden;
    backdrop-filter: blur(20px);
    box-shadow: 
      0 10px 40px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.03);
  }
  
  .table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .table th {
    text-align: left;
    padding: 18px 24px;
    font-family: 'Orbitron', sans-serif;
    font-size: 10px;
    font-weight: 600;
    color: #5a5a6a;
    text-transform: uppercase;
    letter-spacing: 2px;
    border-bottom: 1px solid rgba(57, 255, 20, 0.1);
    background: linear-gradient(180deg, rgba(5, 5, 8, 0.8) 0%, rgba(8, 8, 12, 0.5) 100%);
  }
  
  .table td {
    padding: 18px 24px;
    border-bottom: 1px solid rgba(57, 255, 20, 0.05);
    font-family: 'Rajdhani', sans-serif;
    font-size: 15px;
    font-weight: 500;
    color: #a0a0b0;
    letter-spacing: 0.3px;
  }
  
  .table tr:last-child td {
    border-bottom: none;
  }
  
  .table tr {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .table tr:hover td {
    background: linear-gradient(90deg, rgba(57, 255, 20, 0.03) 0%, transparent 50%);
  }
  
  .status-badge {
    display: inline-flex;
    align-items: center;
    padding: 6px 14px;
    border-radius: 10px;
    font-family: 'Rajdhani', sans-serif;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.5px;
    border: 1px solid transparent;
    text-transform: uppercase;
  }
  
  .status-available {
    background: linear-gradient(135deg, rgba(57, 255, 20, 0.15) 0%, rgba(16, 124, 16, 0.1) 100%);
    color: #39ff14;
    border-color: rgba(57, 255, 20, 0.25);
    box-shadow: 0 0 15px rgba(57, 255, 20, 0.1);
  }
  
  .status-sold {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.1) 100%);
    color: #60a5fa;
    border-color: rgba(59, 130, 246, 0.25);
  }
  
  .status-expiring {
    background: linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(217, 119, 6, 0.1) 100%);
    color: #fbbf24;
    border-color: rgba(251, 191, 36, 0.25);
  }
  
  .status-expired {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.1) 100%);
    color: #f87171;
    border-color: rgba(239, 68, 68, 0.25);
  }
  
  .status-pending_renewal {
    background: linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%);
    color: #c084fc;
    border-color: rgba(168, 85, 247, 0.25);
  }
  
  .actions-cell {
    display: flex;
    gap: 8px;
  }
  
  .action-btn {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
    background: rgba(42, 42, 58, 0.5);
    color: #a0a0b0;
  }
  
  .action-btn:hover {
    background: rgba(42, 42, 58, 0.8);
    color: #fff;
  }
  
  .action-btn.danger:hover {
    background: rgba(239, 68, 68, 0.2);
    color: #ef4444;
  }
  
  .action-btn.whatsapp:hover {
    background: rgba(37, 211, 102, 0.2);
    color: #25d366;
  }

  .action-btn.sell:hover {
    background: rgba(16, 185, 129, 0.2);
    color: #10b981;
  }
  
  .account-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 20px;
  }
  
  .account-modal {
    background: #16161f;
    border: 1px solid rgba(42, 42, 58, 0.5);
    border-radius: 16px;
    width: 100%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid rgba(42, 42, 58, 0.5);
  }
  
  .modal-title {
    font-size: 18px;
    font-weight: 600;
    color: #fff;
  }
  
  .modal-close {
    background: transparent;
    border: none;
    color: #6a6a7a;
    cursor: pointer;
    padding: 4px;
    border-radius: 6px;
  }
  
  .modal-close:hover {
    background: rgba(42, 42, 58, 0.5);
    color: #fff;
  }
  
  .modal-body {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .form-label {
    font-size: 13px;
    font-weight: 500;
    color: #a0a0b0;
  }
  
  .form-input {
    background: rgba(10, 10, 15, 0.5);
    border: 1px solid rgba(42, 42, 58, 0.5);
    border-radius: 10px;
    padding: 12px 14px;
    font-size: 14px;
    color: #fff;
    outline: none;
    transition: border-color 0.2s;
  }
  
  .form-input:focus {
    border-color: #10b981;
  }
  
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  
  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 20px 24px;
    border-top: 1px solid rgba(42, 42, 58, 0.5);
  }
  
  .empty-state {
    text-align: center;
    padding: 60px 20px;
    color: #6a6a7a;
  }
  
  .empty-state-icon {
    width: 80px;
    height: 80px;
    border-radius: 20px;
    background: rgba(42, 42, 58, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
  }
  
  .password-field {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .password-text {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
  }
  
  .copy-btn {
    background: transparent;
    border: none;
    color: #6a6a7a;
    cursor: pointer;
    padding: 4px;
  }
  
  .copy-btn:hover {
    color: #10b981;
  }
  
  .email-cell {
    color: #fff;
    font-weight: 500;
  }
  
  .client-info {
    font-size: 12px;
    color: #10b981;
    margin-top: 4px;
  }
  
  .client-info-sold {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  
  .client-name {
    color: #3b82f6;
    font-weight: 500;
  }
  
  .client-contact {
    font-size: 11px;
    color: #6a6a7a;
  }
  
  @media (max-width: 900px) {
    .table-container {
      overflow-x: auto;
    }
    
    .table {
      min-width: 900px;
    }
    
    .tabs {
      overflow-x: auto;
      width: 100%;
    }
  }

  /* Painel de Importação em Lote */
  .bulk-toggle-btn {
    background: linear-gradient(135deg, #8b5cf6, #6366f1);
    color: #fff;
  }
  
  .bulk-toggle-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
  }

  .bulk-panel {
    position: fixed;
    right: 0;
    top: 0;
    height: 100vh;
    width: 400px;
    background: rgba(15, 15, 22, 0.98);
    border-left: 1px solid rgba(139, 92, 246, 0.3);
    backdrop-filter: blur(20px);
    z-index: 1000;
    display: flex;
    flex-direction: column;
    transform: translateX(100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: -10px 0 40px rgba(0, 0, 0, 0.5);
  }

  .bulk-panel.open {
    transform: translateX(0);
  }

  .bulk-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid rgba(139, 92, 246, 0.2);
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(99, 102, 241, 0.15));
  }

  .bulk-title {
    font-size: 18px;
    font-weight: 600;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .bulk-title::before {
    content: '⚡';
  }

  .bulk-close {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: #a0a0b0;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }

  .bulk-close:hover {
    background: rgba(255, 255, 255, 0.2);
    color: #fff;
  }

  .bulk-content {
    flex: 1;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    overflow-y: auto;
  }

  .bulk-description {
    color: #8a8a9a;
    font-size: 13px;
    line-height: 1.6;
    padding: 12px;
    background: rgba(139, 92, 246, 0.1);
    border-radius: 10px;
    border: 1px solid rgba(139, 92, 246, 0.2);
  }

  .bulk-description code {
    background: rgba(0, 0, 0, 0.3);
    padding: 2px 6px;
    border-radius: 4px;
    color: #a78bfa;
    font-family: monospace;
  }

  .bulk-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .bulk-label {
    font-size: 12px;
    font-weight: 600;
    color: #a0a0b0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .bulk-input {
    background: rgba(22, 22, 31, 0.8);
    border: 1px solid rgba(139, 92, 246, 0.3);
    border-radius: 10px;
    padding: 12px 14px;
    color: #fff;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;
  }

  .bulk-input:focus {
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
  }

  .bulk-textarea {
    min-height: 300px;
    resize: vertical;
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    line-height: 1.5;
  }

  .bulk-actions {
    padding: 20px 24px;
    border-top: 1px solid rgba(139, 92, 246, 0.2);
    display: flex;
    gap: 12px;
  }

  .bulk-btn {
    flex: 1;
    padding: 14px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .bulk-btn-import {
    background: linear-gradient(135deg, #10b981, #059669);
    color: #fff;
  }

  .bulk-btn-import:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
  }

  .bulk-btn-import:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .bulk-result {
    padding: 16px;
    border-radius: 12px;
    font-size: 14px;
  }

  .bulk-result-success {
    background: rgba(16, 185, 129, 0.15);
    border: 1px solid rgba(16, 185, 129, 0.3);
    color: #10b981;
  }

  .bulk-result-error {
    background: rgba(239, 68, 68, 0.15);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #ef4444;
  }

  .bulk-errors {
    margin-top: 12px;
    max-height: 150px;
    overflow-y: auto;
    font-size: 12px;
    padding: 10px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 8px;
  }

  .bulk-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
`;

const statusLabels: Record<string, string> = {
  available: 'Disponível',
  sold: 'Vendida',
  expiring: 'Vencendo',
  expired: 'Expirada',
  pending_renewal: 'Precisa Renovar'
};

type FilterType = 'all' | 'available' | 'sold' | 'pending-renewal' | 'expired';

export default function AccountsManager() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    purchase_date: new Date().toISOString().split('T')[0],
    expiry_date: '',
    cost: '35',
    notes: ''
  });

  // Estados para importação em lote
  const [showBulkPanel, setShowBulkPanel] = useState(false);
  const [bulkInput, setBulkInput] = useState('');
  const [bulkDays, setBulkDays] = useState('30');
  const [bulkCost, setBulkCost] = useState('35');
  const [bulkImporting, setBulkImporting] = useState(false);
  const [bulkResult, setBulkResult] = useState<{ success: number; errors: string[] } | null>(null);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      if (!supabase) {
        const errorMsg = 'Supabase não configurado. Configure as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no Netlify (Site settings → Environment variables).';
        console.error('❌', errorMsg);
        alert(errorMsg);
        return;
      }

      // Buscar contas diretamente do Supabase
      const { data: accountsData, error: accountsError } = await supabase
        .from('accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (accountsError) {
        console.error('❌ Erro do Supabase:', accountsError);
        // Verificar se é erro de tabela não encontrada
        if (accountsError.message?.includes('relation') || accountsError.message?.includes('does not exist')) {
          throw new Error('Tabelas não encontradas no Supabase. Execute o SQL do arquivo supabase-schema.sql no SQL Editor do Supabase.');
        }
        throw accountsError;
      }

      // Buscar vendas relacionadas
      const { data: salesData } = await supabase
        .from('sales')
        .select('id, account_id, sale_price, created_at, client_id');

      // Buscar clientes se houver vendas
      let clientsData: any[] = [];
      if (salesData && salesData.length > 0) {
        const clientIds = [...new Set(salesData.map((s: any) => s.client_id).filter(Boolean))];
        if (clientIds.length > 0) {
          const { data } = await supabase
            .from('clients')
            .select('id, name, email, whatsapp')
            .in('id', clientIds);
          clientsData = data || [];
        }
      }

      // Combinar dados de contas com vendas e clientes
      const accountsWithDetails: Account[] = (accountsData || []).map((account: any) => {
        const sale = salesData?.find((s: any) => s.account_id === account.id);
        const client = sale ? clientsData.find((c: any) => c.id === sale.client_id) : null;

        return {
          ...account,
          client_id: client?.id,
          client_name: client?.name,
          client_email: client?.email,
          client_whatsapp: client?.whatsapp,
          sale_date: sale?.created_at,
          sale_price: sale?.sale_price,
        };
      });

      setAccounts(accountsWithDetails);
    } catch (error: any) {
      console.error('❌ Erro ao carregar contas:', error);

      let errorMessage = 'Erro ao carregar contas.';

      if (error.message) {
        errorMessage = error.message;
      } else if (error.code === 'PGRST116') {
        errorMessage = 'Nenhuma conta encontrada. Adicione contas primeiro.';
      } else if (error.code === '42501' || error.message?.includes('permission')) {
        errorMessage = 'Erro de permissão no Supabase. Verifique as políticas RLS.';
      } else if (error.message?.includes('relation') || error.message?.includes('does not exist')) {
        errorMessage = 'Tabelas não encontradas. Execute o SQL do arquivo supabase-schema.sql no Supabase.';
      }

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!supabase) {
        throw new Error('Supabase não configurado');
      }

      const accountData = {
        email: formData.email,
        password: formData.password,
        purchase_date: formData.purchase_date,
        expiry_date: formData.expiry_date,
        cost: parseFloat(formData.cost),
        notes: formData.notes || '',
        status: 'available' as const,
      };

      if (editingAccount) {
        // Atualizar conta existente
        const { error } = await supabase
          .from('accounts')
          .update(accountData)
          .eq('id', editingAccount.id);

        if (error) throw error;
      } else {
        // Criar nova conta
        const { error } = await supabase
          .from('accounts')
          .insert([accountData]);

        if (error) throw error;
      }

      setShowModal(false);
      resetForm();
      loadAccounts();
    } catch (error: any) {
      console.error('Erro ao salvar conta:', error);
      alert(error.message || 'Erro ao salvar conta');
    }
  };

  const handleDelete = async (id: string, account: Account) => {
    if (!supabase) {
      alert('Supabase não configurado');
      return;
    }

    const isSold = isSoldAccount(account.status);
    const message = isSold
      ? `⚠️ ATENÇÃO: Esta conta está VENDIDA!\n\nAo excluir:\n• A venda será estornada automaticamente\n• A conta será removida permanentemente\n• O cliente perderá acesso\n\nTem certeza que deseja continuar?`
      : 'Tem certeza que deseja excluir esta conta?';

    if (confirm(message)) {
      try {
        // Se for conta vendida, primeiro estornar a venda
        if (isSold) {
          // Buscar a venda vinculada diretamente do Supabase
          const { data: sales, error: salesError } = await supabase
            .from('sales')
            .select('id')
            .eq('account_id', id)
            .single();

          if (salesError && salesError.code !== 'PGRST116') {
            throw salesError;
          }

          if (sales) {
            // Deletar a venda (isso vai voltar a conta para disponível devido ao CASCADE)
            const { error: deleteSaleError } = await supabase
              .from('sales')
              .delete()
              .eq('id', sales.id);

            if (deleteSaleError) throw deleteSaleError;
          }
        }

        // Deletar a conta diretamente do Supabase
        const { error: deleteError } = await supabase
          .from('accounts')
          .delete()
          .eq('id', id);

        if (deleteError) throw deleteError;

        loadAccounts();
      } catch (error: any) {
        console.error('Erro ao excluir conta:', error);
        alert(error.message || 'Erro ao excluir conta');
      }
    }
  };

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    setFormData({
      email: account.email,
      password: account.password,
      purchase_date: account.purchase_date,
      expiry_date: account.expiry_date,
      cost: (account.cost ?? 35).toString(),
      notes: account.notes || ''
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingAccount(null);
    // Calcular data de validade padrão: mesmo dia do próximo mês
    const today = new Date();
    const expiryDate = new Date(today);
    expiryDate.setMonth(today.getMonth() + 1); // Mesmo dia, próximo mês

    setFormData({
      email: '',
      password: '',
      purchase_date: today.toISOString().split('T')[0],
      expiry_date: expiryDate.toISOString().split('T')[0],
      cost: '35',
      notes: ''
    });
  };

  const togglePassword = (id: string) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyPassword = async (id: string, password: string) => {
    await navigator.clipboard.writeText(password);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openWhatsApp = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const message = encodeURIComponent(`Olá ${name}! 😊`);
    window.open(`https://wa.me/55${cleanPhone}?text=${message}`, '_blank');
  };

  // Função de importação em lote
  const handleBulkImport = async () => {
    if (!supabase) {
      alert('Supabase não configurado');
      return;
    }

    const lines = bulkInput.split('\n').filter(line => line.trim());
    if (lines.length === 0) {
      alert('Cole as contas no formato: email senha (uma por linha, separados por espaço)');
      return;
    }

    setBulkImporting(true);
    setBulkResult(null);

    const today = new Date();
    const expiryDate = new Date(today);
    expiryDate.setDate(today.getDate() + parseInt(bulkDays));

    let successCount = 0;
    const errors: string[] = [];

    for (const line of lines) {
      // Separar por espaço, :, / ou | - pega o primeiro como email, o resto como senha
      const parts = line.trim().split(/[\s:\/|]+/);
      if (parts.length >= 2) {
        const email = parts[0].trim();
        const password = parts.slice(1).join(' ').trim(); // Suporta senhas com espaço

        if (email && password) {
          try {
            const { error } = await supabase
              .from('accounts')
              .insert([{
                email,
                password,
                purchase_date: today.toISOString().split('T')[0],
                expiry_date: expiryDate.toISOString().split('T')[0],
                cost: parseFloat(bulkCost) || 35,
                status: 'available',
                notes: 'Importado em lote'
              }]);

            if (error) {
              errors.push(`${email}: ${error.message}`);
            } else {
              successCount++;
            }
          } catch (err: any) {
            errors.push(`${email}: ${err.message}`);
          }
        } else {
          errors.push(`Linha inválida: ${line}`);
        }
      } else {
        errors.push(`Formato inválido: ${line}`);
      }
    }

    setBulkImporting(false);
    setBulkResult({ success: successCount, errors });

    if (successCount > 0) {
      loadAccounts();
      if (errors.length === 0) {
        setBulkInput('');
      }
    }
  };

  // Contadores
  const availableCount = accounts.filter(a => a.status === 'available').length;
  const soldCount = accounts.filter(a => a.status !== 'available' && a.status !== 'pending_renewal' && a.status !== 'expired').length;
  const pendingRenewalCount = accounts.filter(a => a.status === 'pending_renewal').length;
  const expiredCount = accounts.filter(a => a.status === 'expired').length;

  // Filtrar contas
  const filteredAccounts = accounts
    .filter(account => {
      if (filter === 'available') return account.status === 'available';
      if (filter === 'sold') return account.status !== 'available' && account.status !== 'pending_renewal' && account.status !== 'expired';
      if (filter === 'pending-renewal') return account.status === 'pending_renewal';
      if (filter === 'expired') return account.status === 'expired';
      return true;
    })
    .filter(account =>
      account.email.toLowerCase().includes(search.toLowerCase()) ||
      account.client_name?.toLowerCase().includes(search.toLowerCase())
    );

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const isSoldAccount = (status: string) => {
    return status === 'sold' || status === 'expiring' || status === 'expired' || status === 'pending_renewal';
  };

  const handleMarkAsSold = async (id: string) => {
    if (!supabase) {
      alert('Supabase não configurado');
      return;
    }

    if (confirm('Marcar esta conta como vendida?\n\nIsso mudará o status para "Vendida".')) {
      try {
        const { error } = await supabase
          .from('accounts')
          .update({ status: 'sold' })
          .eq('id', id);

        if (error) throw error;

        loadAccounts();
      } catch (error: any) {
        console.error('Erro ao marcar como vendida:', error);
        alert(error.message || 'Erro ao atualizar status');
      }
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="manager">
        <div className="manager-header">
          <div>
            <h1 className="manager-title">Contas GamePass</h1>
            <p className="manager-subtitle">Gerencie seu estoque de contas</p>
          </div>

          <div className="header-actions">
            <div className="search-box">
              <Search size={18} color="#6a6a7a" />
              <input
                type="text"
                className="search-input"
                placeholder="Buscar por email ou cliente..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="btn bulk-toggle-btn" onClick={() => setShowBulkPanel(true)}>
              ⚡ Importar Lote
            </button>
            <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
              <Plus size={18} />
              Nova Conta
            </button>
          </div>
        </div>

        {/* Tabs de Filtro */}
        <div className="tabs">
          <button
            className={`tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Todas
            <span className="tab-count">{accounts.length}</span>
          </button>
          <button
            className={`tab ${filter === 'available' ? 'active' : ''}`}
            onClick={() => setFilter('available')}
          >
            Disponíveis
            <span className="tab-count">{availableCount}</span>
          </button>
          <button
            className={`tab ${filter === 'sold' ? 'active' : ''}`}
            onClick={() => setFilter('sold')}
          >
            Vendidas
            <span className="tab-count">{soldCount}</span>
          </button>
          <button
            className={`tab ${filter === 'pending-renewal' ? 'active' : ''}`}
            onClick={() => setFilter('pending-renewal')}
          >
            Precisa Renovar
            <span className="tab-count">{pendingRenewalCount}</span>
          </button>
          <button
            className={`tab ${filter === 'expired' ? 'active' : ''}`}
            onClick={() => setFilter('expired')}
          >
            Vencidas
            <span className="tab-count">{expiredCount}</span>
          </button>
        </div>

        <div className="table-container">
          {loading ? (
            <div className="empty-state">Carregando...</div>
          ) : filteredAccounts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Package size={36} />
              </div>
              <h3 className="text-white mb-8">
                {filter === 'available' ? 'Nenhuma conta disponível' :
                  filter === 'sold' ? 'Nenhuma conta vendida' :
                    filter === 'pending-renewal' ? 'Nenhuma conta precisa renovar' :
                      filter === 'expired' ? 'Nenhuma conta vencida' :
                        'Nenhuma conta encontrada'}
              </h3>
              <p>
                {filter === 'available' ? 'Adicione novas contas ao estoque' :
                  filter === 'sold' ? 'As contas vendidas aparecerão aqui' :
                    filter === 'pending-renewal' ? 'Todas as contas estão em dia!' :
                      filter === 'expired' ? 'Nenhuma conta vencida sem renovação' :
                        'Adicione sua primeira conta clicando em "Nova Conta"'}
              </p>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Senha</th>
                  {filter !== 'available' && <th>Cliente</th>}
                  <th>Compra</th>
                  <th>Validade</th>
                  <th>Custo</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.map((account) => (
                  <tr key={account.id}>
                    <td>
                      <div className="email-cell">{account.email}</div>
                    </td>
                    <td>
                      <div className="password-field">
                        <span className="password-text">
                          {showPasswords[account.id] ? account.password : '••••••••'}
                        </span>
                        <button
                          className="copy-btn"
                          onClick={() => togglePassword(account.id)}
                        >
                          {showPasswords[account.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                        <button
                          className="copy-btn"
                          onClick={() => copyPassword(account.id, account.password)}
                        >
                          {copiedId === account.id ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                        </button>
                      </div>
                    </td>
                    {filter !== 'available' && (
                      <td>
                        {isSoldAccount(account.status) && account.client_name ? (
                          <div className="client-info-sold">
                            <span className="client-name">{account.client_name}</span>
                            {account.client_whatsapp && (
                              <span className="client-contact">{account.client_whatsapp}</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                    )}
                    <td>{formatDate(account.purchase_date)}</td>
                    <td>{formatDate(account.expiry_date)}</td>
                    <td className="font-mono text-white">
                      R$ {(account.cost ?? 0).toFixed(2)}
                    </td>
                    <td>
                      <span className={`status-badge status-${account.status}`}>
                        {statusLabels[account.status]}
                      </span>
                    </td>
                    <td>
                      <div className="actions-cell">
                        {account.status === 'available' && (
                          <button
                            className="action-btn sell"
                            onClick={() => handleMarkAsSold(account.id)}
                            title="Marcar como Vendida"
                          >
                            <ShoppingCart size={14} />
                          </button>
                        )}
                        {isSoldAccount(account.status) && account.client_whatsapp && (
                          <button
                            className="action-btn whatsapp"
                            onClick={() => openWhatsApp(account.client_whatsapp!, account.client_name!)}
                            title="Abrir WhatsApp"
                          >
                            <MessageCircle size={14} />
                          </button>
                        )}
                        <button className="action-btn" onClick={() => handleEdit(account)} title="Editar">
                          <Edit2 size={14} />
                        </button>
                        <button
                          className="action-btn danger"
                          onClick={() => handleDelete(account.id, account)}
                          title="Excluir"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="account-modal-overlay" onClick={() => setShowModal(false)}>
            <div className="account-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">
                  {editingAccount ? 'Editar Conta' : 'Nova Conta'}
                </h3>
                <button className="modal-close" onClick={() => setShowModal(false)} title="Fechar">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label className="form-label">Email da Conta</label>
                    <input
                      type="email"
                      className="form-input"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@outlook.com"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Senha</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Senha da conta"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Data de Compra</label>
                      <input
                        type="date"
                        className="form-input"
                        value={formData.purchase_date}
                        onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                        required
                        title="Data de compra"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Validade</label>
                      <input
                        type="date"
                        className="form-input"
                        value={formData.expiry_date}
                        onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                        required
                        title="Data de validade"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Custo (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      value={formData.cost}
                      onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                      placeholder="35.00"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Observações (opcional)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Anotações sobre a conta..."
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingAccount ? 'Salvar' : 'Adicionar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Painel de Importação em Lote */}
      {showBulkPanel && <div className="bulk-overlay" onClick={() => setShowBulkPanel(false)} />}
      <div className={`bulk-panel ${showBulkPanel ? 'open' : ''}`}>
        <div className="bulk-header">
          <h3 className="bulk-title">Importação em Lote</h3>
          <button className="bulk-close" onClick={() => setShowBulkPanel(false)}>
            <X size={18} />
          </button>
        </div>

        <div className="bulk-content">
          <div className="bulk-description">
            Cole as contas no formato <code>email senha</code> (uma por linha).
            Separadores aceitos: espaço, : / ou |
          </div>

          <div className="bulk-field">
            <label className="bulk-label">Validade (dias a partir de hoje)</label>
            <input
              type="number"
              className="bulk-input"
              value={bulkDays}
              onChange={(e) => setBulkDays(e.target.value)}
              min="1"
              max="365"
              placeholder="30"
            />
          </div>

          <div className="bulk-field">
            <label className="bulk-label">Valor das contas (R$)</label>
            <input
              type="number"
              className="bulk-input"
              value={bulkCost}
              onChange={(e) => setBulkCost(e.target.value)}
              min="0"
              step="0.01"
              placeholder="35.00"
            />
          </div>

          <div className="bulk-field" style={{ flex: 1 }}>
            <label className="bulk-label">Contas (email senha)</label>
            <textarea
              className="bulk-input bulk-textarea"
              value={bulkInput}
              onChange={(e) => setBulkInput(e.target.value)}
              placeholder={`exemplo1@email.com senha123
exemplo2@email.com senha456
exemplo3@email.com senha789`}
            />
          </div>

          {bulkResult && (
            <div className={`bulk-result ${bulkResult.errors.length > 0 ? 'bulk-result-error' : 'bulk-result-success'}`}>
              ✅ {bulkResult.success} conta(s) importada(s) com sucesso!
              {bulkResult.errors.length > 0 && (
                <>
                  <br />❌ {bulkResult.errors.length} erro(s):
                  <div className="bulk-errors">
                    {bulkResult.errors.map((err, i) => (
                      <div key={i}>{err}</div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="bulk-actions">
          <button
            className="bulk-btn bulk-btn-import"
            onClick={handleBulkImport}
            disabled={bulkImporting || !bulkInput.trim()}
          >
            {bulkImporting ? '⏳ Importando...' : '🚀 Importar Contas'}
          </button>
        </div>
      </div>
    </>
  );
}

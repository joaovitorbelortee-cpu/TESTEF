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
  MessageCircle
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import type { Account } from '../types';

const styles = `
  .manager {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  
  .manager-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
  }
  
  .manager-title {
    font-size: 28px;
    font-weight: 700;
    color: #fff;
    letter-spacing: -0.5px;
  }
  
  .manager-subtitle {
    color: #6a6a7a;
    font-size: 14px;
    margin-top: 4px;
  }
  
  .header-actions {
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
  }
  
  .search-box {
    display: flex;
    align-items: center;
    background: rgba(22, 22, 31, 0.8);
    border: 1px solid rgba(42, 42, 58, 0.5);
    border-radius: 10px;
    padding: 0 14px;
    gap: 10px;
    min-width: 250px;
  }
  
  .search-input {
    background: transparent;
    border: none;
    color: #fff;
    padding: 12px 0;
    font-size: 14px;
    flex: 1;
    outline: none;
  }
  
  .search-input::placeholder {
    color: #6a6a7a;
  }
  
  .btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
  }
  
  .btn-primary {
    background: linear-gradient(135deg, #10b981, #059669);
    color: #fff;
  }
  
  .btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
  }
  
  .btn-secondary {
    background: rgba(42, 42, 58, 0.5);
    color: #a0a0b0;
    border: 1px solid rgba(42, 42, 58, 0.8);
  }
  
  .btn-secondary:hover {
    background: rgba(42, 42, 58, 0.8);
    color: #fff;
  }
  
  .btn-danger {
    background: rgba(239, 68, 68, 0.15);
    color: #ef4444;
    border: 1px solid rgba(239, 68, 68, 0.3);
  }
  
  .btn-danger:hover {
    background: rgba(239, 68, 68, 0.25);
  }
  
  .tabs {
    display: flex;
    gap: 4px;
    background: rgba(22, 22, 31, 0.8);
    border: 1px solid rgba(42, 42, 58, 0.5);
    border-radius: 12px;
    padding: 4px;
  }
  
  .tab {
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
    background: transparent;
    color: #6a6a7a;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .tab:hover {
    color: #a0a0b0;
  }
  
  .tab.active {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(59, 130, 246, 0.15));
    color: #10b981;
  }
  
  .tab-count {
    background: rgba(42, 42, 58, 0.8);
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 12px;
  }
  
  .tab.active .tab-count {
    background: rgba(16, 185, 129, 0.3);
  }
  
  .table-container {
    background: rgba(22, 22, 31, 0.8);
    border: 1px solid rgba(42, 42, 58, 0.5);
    border-radius: 16px;
    overflow: hidden;
    backdrop-filter: blur(10px);
  }
  
  .table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .table th {
    text-align: left;
    padding: 16px 20px;
    font-size: 11px;
    font-weight: 600;
    color: #6a6a7a;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid rgba(42, 42, 58, 0.5);
    background: rgba(10, 10, 15, 0.5);
  }
  
  .table td {
    padding: 16px 20px;
    border-bottom: 1px solid rgba(42, 42, 58, 0.3);
    font-size: 14px;
    color: #a0a0b0;
  }
  
  .table tr:last-child td {
    border-bottom: none;
  }
  
  .table tr:hover td {
    background: rgba(255, 255, 255, 0.02);
  }
  
  .status-badge {
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
  }
  
  .status-available {
    background: rgba(16, 185, 129, 0.15);
    color: #10b981;
  }
  
  .status-sold {
    background: rgba(59, 130, 246, 0.15);
    color: #3b82f6;
  }
  
  .status-expiring {
    background: rgba(245, 158, 11, 0.15);
    color: #f59e0b;
  }
  
  .status-expired {
    background: rgba(239, 68, 68, 0.15);
    color: #ef4444;
  }
  
  .status-pending_renewal {
    background: rgba(245, 158, 11, 0.2);
    color: #f59e0b;
    border: 1px solid rgba(245, 158, 11, 0.4);
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
  
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
  }
  
  .modal {
    background: #16161f;
    border: 1px solid rgba(42, 42, 58, 0.5);
    border-radius: 16px;
    width: 100%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
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
  const [showPasswords, setShowPasswords] = useState<Record<number, boolean>>({});
  const [copiedId, setCopiedId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    purchase_date: new Date().toISOString().split('T')[0],
    expiry_date: '',
    cost: '35',
    notes: ''
  });

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

  const handleDelete = async (id: number, account: Account) => {
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
      cost: account.cost.toString(),
      notes: account.notes || ''
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingAccount(null);
    setFormData({
      email: '',
      password: '',
      purchase_date: new Date().toISOString().split('T')[0],
      expiry_date: '',
      cost: '35',
      notes: ''
    });
  };

  const togglePassword = (id: number) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyPassword = async (id: number, password: string) => {
    await navigator.clipboard.writeText(password);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openWhatsApp = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const message = encodeURIComponent(`Olá ${name}! 😊`);
    window.open(`https://wa.me/55${cleanPhone}?text=${message}`, '_blank');
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
              <h3 style={{ color: '#fff', marginBottom: 8 }}>
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
                          <span style={{ color: '#6a6a7a' }}>-</span>
                        )}
                      </td>
                    )}
                    <td>{formatDate(account.purchase_date)}</td>
                    <td>{formatDate(account.expiry_date)}</td>
                    <td style={{ fontFamily: 'JetBrains Mono', color: '#fff' }}>
                      R$ {account.cost.toFixed(2)}
                    </td>
                    <td>
                      <span className={`status-badge status-${account.status}`}>
                        {statusLabels[account.status]}
                      </span>
                    </td>
                    <td>
                      <div className="actions-cell">
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
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">
                  {editingAccount ? 'Editar Conta' : 'Nova Conta'}
                </h3>
                <button className="modal-close" onClick={() => setShowModal(false)}>
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
    </>
  );
}

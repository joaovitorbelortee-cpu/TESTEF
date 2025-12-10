import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Trash2,
  X,
  ShoppingCart,
  Copy,
  Check,
  TrendingUp
} from 'lucide-react';
import { salesAPI, accountsAPI, clientsAPI } from '../services/api';
import type { Sale, Account, Client } from '../types';

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
  
  .stats-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
  
  @media (max-width: 768px) {
    .stats-row {
      grid-template-columns: 1fr;
    }
  }
  
  .stat-card {
    background: rgba(22, 22, 31, 0.8);
    border: 1px solid rgba(42, 42, 58, 0.5);
    border-radius: 16px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 16px;
  }
  
  .stat-icon {
    width: 50px;
    height: 50px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .stat-icon.green {
    background: rgba(16, 185, 129, 0.15);
    color: #10b981;
  }
  
  .stat-icon.blue {
    background: rgba(59, 130, 246, 0.15);
    color: #3b82f6;
  }
  
  .stat-icon.purple {
    background: rgba(139, 92, 246, 0.15);
    color: #8b5cf6;
  }
  
  .stat-info {
    flex: 1;
  }
  
  .stat-value {
    font-size: 24px;
    font-weight: 700;
    color: #fff;
    font-family: 'JetBrains Mono', monospace;
  }
  
  .stat-label {
    color: #6a6a7a;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 4px;
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
  
  .client-cell {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .client-avatar {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: linear-gradient(135deg, #10b981, #3b82f6);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 14px;
    color: #fff;
    flex-shrink: 0;
  }
  
  .client-info {
    min-width: 0;
  }
  
  .client-name {
    font-weight: 500;
    color: #fff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .client-whatsapp {
    font-size: 12px;
    color: #6a6a7a;
    font-family: 'JetBrains Mono', monospace;
  }
  
  .amount-cell {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 600;
  }
  
  .amount-cell.revenue {
    color: #fff;
  }
  
  .amount-cell.profit {
    color: #10b981;
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
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
  }
  
  .action-btn:hover {
    background: rgba(239, 68, 68, 0.2);
  }
  
  .sales-modal-overlay {
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
  
  .sales-modal {
    background: #16161f;
    border: 1px solid rgba(42, 42, 58, 0.5);
    border-radius: 16px;
    width: 100%;
    max-width: 550px;
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
  
  .form-input, .form-select {
    background: rgba(10, 10, 15, 0.5);
    border: 1px solid rgba(42, 42, 58, 0.5);
    border-radius: 10px;
    padding: 12px 14px;
    font-size: 14px;
    color: #fff;
    outline: none;
    transition: border-color 0.2s;
  }
  
  .form-input:focus, .form-select:focus {
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
  
  .sale-result {
    background: rgba(16, 185, 129, 0.1);
    border: 1px solid rgba(16, 185, 129, 0.3);
    border-radius: 12px;
    padding: 16px;
    margin-top: 12px;
  }
  
  .sale-result-title {
    font-size: 14px;
    font-weight: 600;
    color: #10b981;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .sale-result-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid rgba(16, 185, 129, 0.2);
  }
  
  .sale-result-item:last-child {
    border-bottom: none;
  }
  
  .sale-result-label {
    color: #a0a0b0;
    font-size: 13px;
  }
  
  .sale-result-value {
    color: #fff;
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
  }
  
  .copy-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .copy-btn {
    background: rgba(16, 185, 129, 0.2);
    border: none;
    color: #10b981;
    padding: 4px 8px;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
  }
  
  .copy-btn:hover {
    background: rgba(16, 185, 129, 0.3);
  }
  
  @media (max-width: 900px) {
    .table-container {
      overflow-x: auto;
    }
    
    .table {
      min-width: 700px;
    }
  }
`;

export default function SalesManager() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newSale, setNewSale] = useState<Sale | null>(null);
  const [copied, setCopied] = useState('');

  const [formData, setFormData] = useState({
    client_id: '',
    client_name: '',
    client_whatsapp: '',
    account_id: '',
    sale_price: '69',
    payment_method: 'pix'
  });

  const [stats, setStats] = useState({
    today: { count: 0, revenue: 0, profit: 0 },
    week: { count: 0, revenue: 0, profit: 0 },
    month: { count: 0, revenue: 0, profit: 0 }
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [salesData, accountsData, clientsData] = await Promise.all([
        salesAPI.list() as Promise<Sale[]>,
        accountsAPI.available() as Promise<Account[]>,
        clientsAPI.list() as Promise<Client[]>
      ]);

      setSales(salesData);
      setAccounts(accountsData);
      setClients(clientsData);

      // Calcular stats
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const todaySales = salesData.filter(s => s.created_at.startsWith(today));
      const weekSales = salesData.filter(s => new Date(s.created_at) >= weekAgo);
      const monthSales = salesData.filter(s => new Date(s.created_at) >= monthAgo);

      setStats({
        today: {
          count: todaySales.length,
          revenue: todaySales.reduce((sum, s) => sum + s.sale_price, 0),
          profit: todaySales.reduce((sum, s) => sum + s.profit, 0)
        },
        week: {
          count: weekSales.length,
          revenue: weekSales.reduce((sum, s) => sum + s.sale_price, 0),
          profit: weekSales.reduce((sum, s) => sum + s.profit, 0)
        },
        month: {
          count: monthSales.length,
          revenue: monthSales.reduce((sum, s) => sum + s.sale_price, 0),
          profit: monthSales.reduce((sum, s) => sum + s.profit, 0)
        }
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const saleData = {
        account_id: parseInt(formData.account_id),
        sale_price: parseFloat(formData.sale_price),
        payment_method: formData.payment_method,
        ...(formData.client_id ? { client_id: parseInt(formData.client_id) } : {
          client_name: formData.client_name,
          client_whatsapp: formData.client_whatsapp
        })
      };

      const result = await salesAPI.create(saleData) as Sale;
      setNewSale(result);
      loadData();
    } catch (error: any) {
      alert(error.message || 'Erro ao registrar venda');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja estornar esta venda?')) {
      try {
        await salesAPI.delete(id);
        loadData();
      } catch (error: any) {
        alert(error.message || 'Erro ao estornar venda');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      client_id: '',
      client_name: '',
      client_whatsapp: '',
      account_id: '',
      sale_price: '69',
      payment_method: 'pix'
    });
    setNewSale(null);
  };

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(''), 2000);
  };

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'CL';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const filteredSales = sales.filter(sale =>
    sale.client_name?.toLowerCase().includes(search.toLowerCase()) ||
    sale.account_email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{styles}</style>
      <div className="manager">
        <div className="manager-header">
          <div>
            <h1 className="manager-title">Vendas</h1>
            <p className="manager-subtitle">Registre e acompanhe suas vendas</p>
          </div>

          <div className="header-actions">
            <div className="search-box">
              <Search size={18} color="#6a6a7a" />
              <input
                type="text"
                className="search-input"
                placeholder="Buscar por cliente ou conta..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
              <Plus size={18} />
              Nova Venda
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon green">
              <TrendingUp size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{formatCurrency(stats.today.revenue)}</div>
              <div className="stat-label">Hoje • {stats.today.count} vendas</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon blue">
              <TrendingUp size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{formatCurrency(stats.week.revenue)}</div>
              <div className="stat-label">Semana • {stats.week.count} vendas</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon purple">
              <TrendingUp size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{formatCurrency(stats.month.revenue)}</div>
              <div className="stat-label">Mês • {stats.month.count} vendas</div>
            </div>
          </div>
        </div>

        <div className="table-container">
          {loading ? (
            <div className="empty-state">Carregando...</div>
          ) : filteredSales.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <ShoppingCart size={36} />
              </div>
              <h3 style={{ color: '#fff', marginBottom: 8 }}>Nenhuma venda encontrada</h3>
              <p>Registre sua primeira venda clicando em "Nova Venda"</p>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Conta</th>
                  <th>Valor</th>
                  <th>Lucro</th>
                  <th>Data</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map((sale) => (
                  <tr key={sale.id}>
                    <td>
                      <div className="client-cell">
                        <div className="client-avatar">
                          {getInitials(sale.client_name || '')}
                        </div>
                        <div className="client-info">
                          <div className="client-name">{sale.client_name}</div>
                          <div className="client-whatsapp">{sale.client_whatsapp}</div>
                        </div>
                      </div>
                    </td>
                    <td>{sale.account_email}</td>
                    <td className="amount-cell revenue">{formatCurrency(sale.sale_price)}</td>
                    <td className="amount-cell profit">+{formatCurrency(sale.profit)}</td>
                    <td>{formatDate(sale.created_at)}</td>
                    <td>
                      <button
                        className="action-btn"
                        onClick={() => handleDelete(sale.id)}
                        title="Estornar venda"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="sales-modal-overlay" onClick={() => { setShowModal(false); resetForm(); }}>
            <div className="sales-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">
                  {newSale ? '✅ Venda Registrada!' : 'Nova Venda'}
                </h3>
                <button className="modal-close" onClick={() => { setShowModal(false); resetForm(); }}>
                  <X size={20} />
                </button>
              </div>

              {newSale ? (
                <div className="modal-body">
                  <div className="sale-result">
                    <div className="sale-result-title">
                      <Check size={18} />
                      Dados para enviar ao cliente:
                    </div>

                    <div className="sale-result-item">
                      <span className="sale-result-label">Email:</span>
                      <div className="copy-row">
                        <span className="sale-result-value">{newSale.account_email}</span>
                        <button
                          className="copy-btn"
                          onClick={() => copyToClipboard(newSale.account_email || '', 'email')}
                        >
                          {copied === 'email' ? <Check size={12} /> : <Copy size={12} />}
                          {copied === 'email' ? 'Copiado!' : 'Copiar'}
                        </button>
                      </div>
                    </div>

                    <div className="sale-result-item">
                      <span className="sale-result-label">Senha:</span>
                      <div className="copy-row">
                        <span className="sale-result-value">{newSale.account_password}</span>
                        <button
                          className="copy-btn"
                          onClick={() => copyToClipboard(newSale.account_password || '', 'password')}
                        >
                          {copied === 'password' ? <Check size={12} /> : <Copy size={12} />}
                          {copied === 'password' ? 'Copiado!' : 'Copiar'}
                        </button>
                      </div>
                    </div>

                    <div className="sale-result-item">
                      <span className="sale-result-label">Validade:</span>
                      <span className="sale-result-value">
                        {new Date(newSale.account_expiry || '').toLocaleDateString('pt-BR')}
                      </span>
                    </div>

                    <div className="sale-result-item">
                      <span className="sale-result-label">Lucro:</span>
                      <span className="sale-result-value" style={{ color: '#10b981' }}>
                        +{formatCurrency(newSale.profit)}
                      </span>
                    </div>
                  </div>

                  <div className="modal-footer" style={{ padding: 0, border: 'none', marginTop: 12 }}>
                    <button className="btn btn-secondary" onClick={() => { setShowModal(false); resetForm(); }}>
                      Fechar
                    </button>
                    <button className="btn btn-primary" onClick={resetForm}>
                      <Plus size={16} />
                      Nova Venda
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="form-group">
                      <label className="form-label">Cliente Existente (opcional)</label>
                      <select
                        className="form-select"
                        value={formData.client_id}
                        onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                      >
                        <option value="">-- Novo cliente --</option>
                        {clients.map(client => (
                          <option key={client.id} value={client.id}>
                            {client.name} - {client.whatsapp}
                          </option>
                        ))}
                      </select>
                    </div>

                    {!formData.client_id && (
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Nome do Cliente</label>
                          <input
                            type="text"
                            className="form-input"
                            value={formData.client_name}
                            onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                            placeholder="Nome completo"
                            required={!formData.client_id}
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">WhatsApp</label>
                          <input
                            type="text"
                            className="form-input"
                            value={formData.client_whatsapp}
                            onChange={(e) => setFormData({ ...formData, client_whatsapp: e.target.value })}
                            placeholder="11999999999"
                            required={!formData.client_id}
                          />
                        </div>
                      </div>
                    )}

                    <div className="form-group">
                      <label className="form-label">Conta GamePass *</label>
                      <select
                        className="form-select"
                        value={formData.account_id}
                        onChange={(e) => setFormData({ ...formData, account_id: e.target.value })}
                        required
                      >
                        <option value="">Selecione uma conta disponível</option>
                        {accounts.map(account => (
                          <option key={account.id} value={account.id}>
                            {account.email} (vence: {new Date(account.expiry_date).toLocaleDateString('pt-BR')})
                          </option>
                        ))}
                      </select>
                      {accounts.length === 0 && (
                        <p style={{ color: '#f59e0b', fontSize: 12, marginTop: 8 }}>
                          ⚠️ Nenhuma conta disponível. Adicione contas no estoque primeiro.
                        </p>
                      )}
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Valor da Venda (R$)</label>
                        <input
                          type="number"
                          step="0.01"
                          className="form-input"
                          value={formData.sale_price}
                          onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })}
                          placeholder="69.00"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Forma de Pagamento</label>
                        <select
                          className="form-select"
                          value={formData.payment_method}
                          onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                        >
                          <option value="pix">PIX</option>
                          <option value="cartao">Cartão</option>
                          <option value="transferencia">Transferência</option>
                          <option value="outro">Outro</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={accounts.length === 0}>
                      Registrar Venda
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}


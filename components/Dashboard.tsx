import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Package,
  Users,
  AlertTriangle,
  DollarSign,
  ShoppingCart,
  ArrowUpRight,
  Clock,
  MessageCircle
} from 'lucide-react';
import { dashboardAPI } from '../services/api';
import type { DashboardData, TabType } from '../types';

const styles = `
  .dashboard {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  
  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
  }
  
  .dashboard-title {
    font-size: 28px;
    font-weight: 700;
    color: #fff;
    letter-spacing: -0.5px;
  }
  
  .dashboard-subtitle {
    color: #6a6a7a;
    font-size: 14px;
    margin-top: 4px;
  }

  .error-message {
    margin-bottom: 12px;
    font-size: 14px;
    color: #fff;
  }
  
  .error-actions {
    margin-top: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
  }
  
  .error-hint {
    font-size: 12px;
    color: #6a6a7a;
  }
  
  .error-code {
    background: rgba(42, 42, 58, 0.8);
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 12px;
    color: #10b981;
    font-family: monospace;
  }
  
  .retry-btn {
    margin-top: 12px;
    padding: 10px 20px;
    background: rgba(16, 185, 129, 0.15);
    border: 1px solid rgba(16, 185, 129, 0.3);
    border-radius: 8px;
    color: #10b981;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }
  
  @media (max-width: 1200px) {
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media (max-width: 600px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }
  }
  
  .stat-card {
    background: rgba(22, 22, 31, 0.8);
    border: 1px solid rgba(42, 42, 58, 0.5);
    border-radius: 16px;
    padding: 20px;
    backdrop-filter: blur(10px);
  }
  
  .stat-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
  }
  
  .stat-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
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
  
  .stat-icon.yellow {
    background: rgba(245, 158, 11, 0.15);
    color: #f59e0b;
  }
  
  .stat-value {
    font-size: 32px;
    font-weight: 700;
    color: #fff;
    font-family: 'JetBrains Mono', monospace;
    line-height: 1;
  }
  
  .stat-label {
    color: #6a6a7a;
    font-size: 13px;
    margin-top: 4px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .stat-change {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    margin-top: 12px;
    padding: 4px 8px;
    border-radius: 6px;
    width: fit-content;
  }
  
  .stat-change.positive {
    background: rgba(16, 185, 129, 0.15);
    color: #10b981;
  }
  
  .content-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 24px;
  }
  
  @media (max-width: 1024px) {
    .content-grid {
      grid-template-columns: 1fr;
    }
  }
  
  .card {
    background: rgba(22, 22, 31, 0.8);
    border: 1px solid rgba(42, 42, 58, 0.5);
    border-radius: 16px;
    padding: 20px;
    backdrop-filter: blur(10px);
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .card-title {
    font-size: 16px;
    font-weight: 600;
    color: #fff;
  }
  
  .card-link {
    font-size: 13px;
    color: #10b981;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
    background: none;
    border: none;
  }
  
  .card-link:hover {
    text-decoration: underline;
  }
  
  .sales-table {
    width: 100%;
  }
  
  .sales-row {
    display: flex;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid rgba(42, 42, 58, 0.3);
    gap: 12px;
  }
  
  .sales-row:last-child {
    border-bottom: none;
  }
  
  .sales-avatar {
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
  
  .sales-info {
    flex: 1;
    min-width: 0;
  }
  
  .sales-name {
    font-weight: 500;
    color: #fff;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .sales-product {
    color: #6a6a7a;
    font-size: 12px;
  }
  
  .sales-amount {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 600;
    color: #10b981;
    font-size: 14px;
    flex-shrink: 0;
  }
  
  .sales-time {
    color: #6a6a7a;
    font-size: 11px;
    flex-shrink: 0;
  }
  
  .alert-item {
    display: flex;
    align-items: center;
    padding: 14px;
    background: rgba(245, 158, 11, 0.1);
    border: 1px solid rgba(245, 158, 11, 0.3);
    border-radius: 12px;
    margin-bottom: 12px;
    gap: 12px;
  }
  
  .alert-item:last-child {
    margin-bottom: 0;
  }
  
  .alert-icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: rgba(245, 158, 11, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #f59e0b;
    flex-shrink: 0;
  }
  
  .alert-info {
    flex: 1;
    min-width: 0;
  }
  
  .alert-name {
    font-weight: 500;
    color: #fff;
    font-size: 13px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .alert-days {
    color: #f59e0b;
    font-size: 12px;
  }
  
  .alert-action {
    background: transparent;
    border: 1px solid rgba(16, 185, 129, 0.5);
    color: #10b981;
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
    transition: all 0.2s;
    flex-shrink: 0;
  }
  
  .alert-action:hover {
    background: rgba(16, 185, 129, 0.15);
  }
  
  .empty-state {
    text-align: center;
    padding: 40px 20px;
    color: #6a6a7a;
  }
  
  .empty-state-icon {
    width: 64px;
    height: 64px;
    border-radius: 16px;
    background: rgba(42, 42, 58, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
  }
  
  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px;
    color: #6a6a7a;
  }
  
  .stock-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-top: 16px;
  }
  
  .stock-item {
    padding: 14px;
    border-radius: 12px;
    text-align: center;
  }
  
  .stock-item.available {
    background: rgba(16, 185, 129, 0.1);
    border: 1px solid rgba(16, 185, 129, 0.3);
  }
  
  .stock-item.sold {
    background: rgba(59, 130, 246, 0.1);
    border: 1px solid rgba(59, 130, 246, 0.3);
  }
  
  .stock-item.expiring {
    background: rgba(245, 158, 11, 0.1);
    border: 1px solid rgba(245, 158, 11, 0.3);
  }
  
  .stock-item.expired {
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
  }
  
  .stock-value {
    font-size: 28px;
    font-weight: 700;
    font-family: 'JetBrains Mono', monospace;
  }
  
  .stock-item.available .stock-value { color: #10b981; }
  .stock-item.sold .stock-value { color: #3b82f6; }
  .stock-item.expiring .stock-value { color: #f59e0b; }
  .stock-item.expired .stock-value { color: #ef4444; }
  
  .stock-label {
    font-size: 11px;
    color: #6a6a7a;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 4px;
  }
`;

interface DashboardProps {
  onNavigate: (tab: TabType) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('🔄 Carregando dashboard...');
      console.log('🔗 API URL:', import.meta.env.VITE_API_URL || 'http://localhost:3001/api');

      const result = await dashboardAPI.get() as DashboardData;
      console.log('✅ Dashboard carregado:', result);
      setData(result);
    } catch (err: any) {
      console.error('❌ Erro ao carregar dashboard:', err);

      // Mensagem de erro mais específica
      let errorMessage = 'Erro ao carregar dashboard';

      if (err.message?.includes('Unexpected token') || err.message?.includes('JSON') || err.message?.includes('HTML')) {
        errorMessage = 'A API retornou HTML ao invés de JSON. Verifique se a Netlify Function está configurada corretamente.';
      } else if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
        errorMessage = 'Erro ao conectar com o servidor. O backend pode estar iniciando (cold boot). Aguarde alguns segundos e tente novamente.';
      } else if (err.message?.includes('404')) {
        errorMessage = 'Endpoint não encontrado. Verifique a URL da API.';
      } else if (err.message) {
        errorMessage = `Erro: ${err.message}`;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Agora';
    if (diffMins < 60) return `${diffMins}min atrás`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h atrás`;

    return date.toLocaleDateString('pt-BR');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const openWhatsApp = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const message = encodeURIComponent(
      `Olá ${name}! Tudo bem? 😊\n\nVi aqui que sua conta GamePass está perto de vencer. Quer renovar? Tenho condições especiais para você! 🎮`
    );
    window.open(`https://wa.me/55${cleanPhone}?text=${message}`, '_blank');
  };

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="loading">Carregando dashboard...</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <style>{styles}</style>
        <div className="dashboard">
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon">
                <AlertTriangle size={32} color="#ef4444" />
              </div>
              <p className="error-message">{error}</p>
              <div className="error-actions">
                <p className="error-hint">
                  Para desenvolvimento local, execute:
                </p>
                <code className="error-code">
                  npm run dev:server
                </code>
                <button
                  onClick={loadDashboard}
                  className="retry-btn"
                >
                  Tentar Novamente
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!data) return null;

  return (
    <>
      <style>{styles}</style>
      <div className="dashboard">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Dashboard</h1>
            <p className="dashboard-subtitle">Visão geral do seu negócio GamePass</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon green">
                <DollarSign size={22} />
              </div>
            </div>
            <div className="stat-value">{formatCurrency(data.today.revenue)}</div>
            <div className="stat-label">Faturamento Hoje</div>
            <div className="stat-change positive">
              <ArrowUpRight size={14} />
              {data.today.count} vendas
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon blue">
                <TrendingUp size={22} />
              </div>
            </div>
            <div className="stat-value">{formatCurrency(data.today.profit)}</div>
            <div className="stat-label">Lucro Hoje</div>
            <div className="stat-change positive">
              <ArrowUpRight size={14} />
              Lucro líquido
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon purple">
                <Package size={22} />
              </div>
            </div>
            <div className="stat-value">{data.stock.available}</div>
            <div className="stat-label">Contas Disponíveis</div>
            <div className="stat-change positive">
              <Package size={14} />
              de {data.stock.total} total
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon yellow">
                <Users size={22} />
              </div>
            </div>
            <div className="stat-value">{data.clients.total}</div>
            <div className="stat-label">Total de Clientes</div>
            <div className="stat-change positive">
              <Users size={14} />
              {data.clients.recurring + data.clients.vip} recorrentes
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="content-grid">
          {/* Recent Sales */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Últimas Vendas</h3>
              <button className="card-link" onClick={() => onNavigate('sales')}>
                Ver todas <ArrowUpRight size={14} />
              </button>
            </div>

            {data.recentSales.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <ShoppingCart size={28} />
                </div>
                <p>Nenhuma venda ainda</p>
              </div>
            ) : (
              <div className="sales-table">
                {data.recentSales.map((sale) => (
                  <div key={sale.id} className="sales-row">
                    <div className="sales-avatar">
                      {getInitials(sale.client_name || 'CL')}
                    </div>
                    <div className="sales-info">
                      <div className="sales-name">{sale.client_name}</div>
                      <div className="sales-product">GamePass Ultimate</div>
                    </div>
                    <div className="sales-amount">{formatCurrency(sale.sale_price)}</div>
                    <div className="sales-time">{formatDate(sale.created_at)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Alerts & Stock */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Expiring Accounts Alert */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">⚠️ Contas Vencendo</h3>
                <button className="card-link" onClick={() => onNavigate('alerts')}>
                  Ver todas <ArrowUpRight size={14} />
                </button>
              </div>

              {data.expiringAccounts.length === 0 ? (
                <div className="empty-state" style={{ padding: 20 }}>
                  <p style={{ fontSize: 13 }}>Nenhuma conta vencendo nos próximos 7 dias 🎉</p>
                </div>
              ) : (
                data.expiringAccounts.slice(0, 3).map((account) => (
                  <div key={account.id} className="alert-item">
                    <div className="alert-icon">
                      <Clock size={18} />
                    </div>
                    <div className="alert-info">
                      <div className="alert-name">{account.client_name}</div>
                      <div className="alert-days">
                        Vence em {account.days_left} dia{account.days_left !== 1 ? 's' : ''}
                      </div>
                    </div>
                    <button
                      className="alert-action"
                      onClick={() => openWhatsApp(account.client_whatsapp, account.client_name)}
                    >
                      <MessageCircle size={14} />
                      Contatar
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Stock Overview */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">📦 Estoque</h3>
                <button className="card-link" onClick={() => onNavigate('accounts')}>
                  Gerenciar <ArrowUpRight size={14} />
                </button>
              </div>

              <div className="stock-grid">
                <div className="stock-item available">
                  <div className="stock-value">{data.stock.available}</div>
                  <div className="stock-label">Disponíveis</div>
                </div>
                <div className="stock-item sold">
                  <div className="stock-value">{data.stock.sold}</div>
                  <div className="stock-label">Vendidas</div>
                </div>
                <div className="stock-item expiring">
                  <div className="stock-value">{data.stock.expiring}</div>
                  <div className="stock-label">Vencendo</div>
                </div>
                <div className="stock-item expired">
                  <div className="stock-value">{data.stock.expired}</div>
                  <div className="stock-label">Expiradas</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Week Summary */}
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div className="stat-card">
            <div className="stat-label" style={{ marginBottom: 8 }}>Esta Semana</div>
            <div className="stat-value" style={{ fontSize: 24 }}>{formatCurrency(data.week.revenue)}</div>
            <div style={{ color: '#6a6a7a', fontSize: 12, marginTop: 4 }}>{data.week.count} vendas</div>
          </div>
          <div className="stat-card">
            <div className="stat-label" style={{ marginBottom: 8 }}>Lucro da Semana</div>
            <div className="stat-value" style={{ fontSize: 24, color: '#10b981' }}>{formatCurrency(data.week.profit)}</div>
            <div style={{ color: '#6a6a7a', fontSize: 12, marginTop: 4 }}>Lucro líquido</div>
          </div>
          <div className="stat-card">
            <div className="stat-label" style={{ marginBottom: 8 }}>Este Mês</div>
            <div className="stat-value" style={{ fontSize: 24 }}>{formatCurrency(data.month.revenue)}</div>
            <div style={{ color: '#6a6a7a', fontSize: 12, marginTop: 4 }}>{data.month.count} vendas • {formatCurrency(data.month.profit)} lucro</div>
          </div>
        </div>
      </div>
    </>
  );
}


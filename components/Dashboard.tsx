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
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');

  .dashboard {
    display: flex;
    flex-direction: column;
    gap: 28px;
    animation: fadeIn 0.6s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
    padding-bottom: 24px;
    border-bottom: 1px solid rgba(57, 255, 20, 0.1);
    position: relative;
  }

  .dashboard-header::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 120px;
    height: 2px;
    background: linear-gradient(90deg, #39ff14, transparent);
    border-radius: 2px;
  }
  
  .dashboard-title {
    font-family: 'Orbitron', sans-serif;
    font-size: 32px;
    font-weight: 700;
    color: #fff;
    letter-spacing: 1px;
    text-shadow: 0 0 30px rgba(57, 255, 20, 0.2);
    position: relative;
  }

  .dashboard-title::before {
    content: '';
    position: absolute;
    left: -20px;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 70%;
    background: linear-gradient(180deg, #39ff14, transparent);
    border-radius: 4px;
    box-shadow: 0 0 15px #39ff14;
  }
  
  .dashboard-subtitle {
    font-family: 'Rajdhani', sans-serif;
    color: #7a7a8a;
    font-size: 15px;
    margin-top: 6px;
    letter-spacing: 0.5px;
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
    background: linear-gradient(135deg, rgba(57, 255, 20, 0.1) 0%, rgba(16, 124, 16, 0.05) 100%);
    padding: 10px 20px;
    border-radius: 10px;
    font-size: 13px;
    color: #39ff14;
    font-family: 'Orbitron', monospace;
    border: 1px solid rgba(57, 255, 20, 0.2);
  }
  
  .retry-btn {
    margin-top: 12px;
    padding: 12px 24px;
    background: linear-gradient(135deg, rgba(57, 255, 20, 0.15) 0%, rgba(16, 124, 16, 0.1) 100%);
    border: 1px solid rgba(57, 255, 20, 0.3);
    border-radius: 12px;
    color: #39ff14;
    cursor: pointer;
    font-family: 'Rajdhani', sans-serif;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .retry-btn:hover {
    background: linear-gradient(135deg, rgba(57, 255, 20, 0.25) 0%, rgba(16, 124, 16, 0.15) 100%);
    box-shadow: 0 0 20px rgba(57, 255, 20, 0.2);
    transform: translateY(-2px);
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
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
    background: linear-gradient(180deg, rgba(12, 12, 18, 0.95) 0%, rgba(8, 8, 12, 0.98) 100%);
    border: 1px solid rgba(57, 255, 20, 0.1);
    border-radius: 20px;
    padding: 24px;
    backdrop-filter: blur(20px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  }

  .stat-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(57, 255, 20, 0.3), transparent);
  }

  .stat-card:hover {
    border-color: rgba(57, 255, 20, 0.25);
    transform: translateY(-4px);
    box-shadow: 
      0 15px 50px rgba(0, 0, 0, 0.4),
      0 0 30px rgba(57, 255, 20, 0.1);
  }
  
  .stat-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 18px;
  }
  
  .stat-icon {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
  }
  
  .stat-icon.green {
    background: linear-gradient(135deg, rgba(57, 255, 20, 0.2) 0%, rgba(16, 124, 16, 0.15) 100%);
    color: #39ff14;
    box-shadow: 0 0 20px rgba(57, 255, 20, 0.15);
  }
  
  .stat-icon.blue {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.15) 100%);
    color: #60a5fa;
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.15);
  }
  
  .stat-icon.purple {
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(109, 40, 217, 0.15) 100%);
    color: #a78bfa;
    box-shadow: 0 0 20px rgba(139, 92, 246, 0.15);
  }
  
  .stat-icon.yellow {
    background: linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(217, 119, 6, 0.15) 100%);
    color: #fbbf24;
    box-shadow: 0 0 20px rgba(251, 191, 36, 0.15);
  }
  
  .stat-value {
    font-family: 'Orbitron', sans-serif;
    font-size: 34px;
    font-weight: 700;
    color: #fff;
    line-height: 1;
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
  }
  
  .stat-label {
    font-family: 'Rajdhani', sans-serif;
    color: #6a6a7a;
    font-size: 13px;
    font-weight: 600;
    margin-top: 6px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  .stat-change {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: 'Rajdhani', sans-serif;
    font-size: 13px;
    font-weight: 600;
    margin-top: 14px;
    padding: 6px 12px;
    border-radius: 10px;
    width: fit-content;
  }
  
  .stat-change.positive {
    background: linear-gradient(135deg, rgba(57, 255, 20, 0.15) 0%, rgba(16, 124, 16, 0.1) 100%);
    color: #39ff14;
    border: 1px solid rgba(57, 255, 20, 0.2);
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
    background: linear-gradient(180deg, rgba(12, 12, 18, 0.95) 0%, rgba(8, 8, 12, 0.98) 100%);
    border: 1px solid rgba(57, 255, 20, 0.1);
    border-radius: 20px;
    padding: 24px;
    backdrop-filter: blur(20px);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    position: relative;
    overflow: hidden;
  }

  .card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(57, 255, 20, 0.2), transparent);
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 22px;
  }
  
  .card-title {
    font-family: 'Orbitron', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  
  .card-link {
    font-family: 'Rajdhani', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #39ff14;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    background: none;
    border: none;
    transition: all 0.3s;
  }
  
  .card-link:hover {
    color: #5fff4a;
    text-shadow: 0 0 15px rgba(57, 255, 20, 0.5);
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

      const result = await dashboardAPI.getMetrics() as DashboardData;
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
          <div className="flex-col-gap-24">
            {/* Expiring Accounts Alert */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">⚠️ Contas Vencendo</h3>
                <button className="card-link" onClick={() => onNavigate('alerts')}>
                  Ver todas <ArrowUpRight size={14} />
                </button>
              </div>

              {data.expiringAccounts.length === 0 ? (
                <div className="empty-state p-20">
                  <p className="text-sm">Nenhuma conta vencendo nos próximos 7 dias 🎉</p>
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
        <div className="stats-grid grid-cols-3">
          <div className="stat-card">
            <div className="stat-label mb-8">Esta Semana</div>
            <div className="stat-value text-xl">{formatCurrency(data.week.revenue)}</div>
            <div className="text-xs mt-4 text-muted">{data.week.count} vendas</div>
          </div>
          <div className="stat-card">
            <div className="stat-label mb-8">Lucro da Semana</div>
            <div className="stat-value text-xl text-success">{formatCurrency(data.week.profit)}</div>
            <div className="text-xs mt-4 text-muted">Lucro líquido</div>
          </div>
          <div className="stat-card">
            <div className="stat-label mb-8">Este Mês</div>
            <div className="stat-value text-xl">{formatCurrency(data.month.revenue)}</div>
            <div className="text-xs mt-4 text-muted">{data.month.count} vendas • {formatCurrency(data.month.profit)} lucro</div>
          </div>
        </div>
      </div>
    </>
  );
}


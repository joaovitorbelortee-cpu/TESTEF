import React, { useState, useEffect } from 'react';
import {
  Bell,
  Clock,
  MessageCircle,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Copy,
  Check,
  X
} from 'lucide-react';
import { clientsAPI, accountsAPI } from '../services/api';
import type { ExpiringAccount, Account } from '../types';

const styles = `
  .alerts {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  
  .alerts-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
  }
  
  .alerts-title {
    font-size: 28px;
    font-weight: 700;
    color: #fff;
    letter-spacing: -0.5px;
  }
  
  .alerts-subtitle {
    color: #6a6a7a;
    font-size: 14px;
    margin-top: 4px;
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
  
  .stat-icon.red {
    background: rgba(239, 68, 68, 0.15);
    color: #ef4444;
  }
  
  .stat-icon.yellow {
    background: rgba(245, 158, 11, 0.15);
    color: #f59e0b;
  }
  
  .stat-icon.green {
    background: rgba(16, 185, 129, 0.15);
    color: #10b981;
  }
  
  .stat-info {
    flex: 1;
  }
  
  .stat-value {
    font-size: 28px;
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
  
  .alerts-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .alert-card {
    background: rgba(22, 22, 31, 0.8);
    border-radius: 16px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    transition: all 0.2s;
  }
  
  .alert-card.urgent {
    border: 1px solid rgba(239, 68, 68, 0.4);
    background: rgba(239, 68, 68, 0.05);
  }
  
  .alert-card.warning {
    border: 1px solid rgba(245, 158, 11, 0.4);
    background: rgba(245, 158, 11, 0.05);
  }
  
  .alert-card.normal {
    border: 1px solid rgba(42, 42, 58, 0.5);
  }
  
  .alert-card:hover {
    transform: translateY(-2px);
  }
  
  .alert-icon {
    width: 50px;
    height: 50px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  
  .alert-icon.urgent {
    background: rgba(239, 68, 68, 0.15);
    color: #ef4444;
  }
  
  .alert-icon.warning {
    background: rgba(245, 158, 11, 0.15);
    color: #f59e0b;
  }
  
  .alert-icon.normal {
    background: rgba(59, 130, 246, 0.15);
    color: #3b82f6;
  }
  
  .alert-content {
    flex: 1;
    min-width: 0;
  }
  
  .alert-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 4px;
  }
  
  .alert-name {
    font-size: 16px;
    font-weight: 600;
    color: #fff;
  }
  
  .alert-badge {
    padding: 2px 8px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
  }
  
  .alert-badge.urgent {
    background: rgba(239, 68, 68, 0.2);
    color: #ef4444;
  }
  
  .alert-badge.warning {
    background: rgba(245, 158, 11, 0.2);
    color: #f59e0b;
  }
  
  .alert-badge.normal {
    background: rgba(59, 130, 246, 0.2);
    color: #3b82f6;
  }
  
  .alert-details {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    font-size: 13px;
    color: #6a6a7a;
  }
  
  .alert-detail {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  
  .alert-actions {
    display: flex;
    gap: 8px;
    flex-shrink: 0;
  }
  
  .alert-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 16px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
  }
  
  .alert-btn.whatsapp {
    background: rgba(37, 211, 102, 0.15);
    color: #25d366;
    border: 1px solid rgba(37, 211, 102, 0.3);
  }
  
  .alert-btn.whatsapp:hover {
    background: rgba(37, 211, 102, 0.25);
  }
  
  .alert-btn.copy {
    background: rgba(42, 42, 58, 0.5);
    color: #a0a0b0;
  }
  
  .alert-btn.copy:hover {
    background: rgba(42, 42, 58, 0.8);
    color: #fff;
  }
  
  .empty-state {
    text-align: center;
    padding: 60px 20px;
    color: #6a6a7a;
    background: rgba(22, 22, 31, 0.8);
    border: 1px solid rgba(42, 42, 58, 0.5);
    border-radius: 16px;
  }
  
  .empty-state-icon {
    width: 80px;
    height: 80px;
    border-radius: 20px;
    background: rgba(16, 185, 129, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
    color: #10b981;
  }
  
  .message-template {
    background: rgba(10, 10, 15, 0.5);
    border: 1px solid rgba(42, 42, 58, 0.5);
    border-radius: 12px;
    padding: 16px;
    margin-top: 24px;
  }
  
  .template-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }
  
  .template-title {
    font-size: 14px;
    font-weight: 600;
    color: #fff;
  }
  
  .template-text {
    font-size: 13px;
    color: #a0a0b0;
    line-height: 1.6;
    white-space: pre-wrap;
  }
  
  .alert-section {
    margin-top: 32px;
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 20px;
  }
  
  .section-title {
    font-size: 20px;
    font-weight: 600;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 4px;
  }
  
  .section-subtitle {
    color: #6a6a7a;
    font-size: 14px;
    margin-top: 4px;
  }
  
  .alert-item {
    background: rgba(22, 22, 31, 0.8);
    border-radius: 16px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    transition: all 0.2s;
  }
  
  .alert-item.urgent {
    border: 1px solid rgba(239, 68, 68, 0.4);
    background: rgba(239, 68, 68, 0.05);
  }
  
  .alert-item:hover {
    transform: translateY(-2px);
  }
  
    .alert-item {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  /* Refactored Styles */
  .tabs-container {
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    padding-bottom: 12px;
  }
  
  .tab-btn {
    padding: 10px 20px;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 8px;
    color: #6a6a7a;
    cursor: pointer;
    font-weight: 400;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .tab-btn.active-warning {
    background: rgba(245, 158, 11, 0.2);
    border-color: rgba(245, 158, 11, 0.4);
    color: #f59e0b;
    font-weight: 600;
  }
  
  .tab-btn.active-danger {
    background: rgba(239, 68, 68, 0.2);
    border-color: rgba(239, 68, 68, 0.4);
    color: #ef4444;
    font-weight: 600;
  }

  .alert-details-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 12px;
  }

  .alert-detail-box {
    padding: 10px;
    border-radius: 8px;
    border: 1px solid transparent;
  }

  .detail-label {
    font-weight: 600;
    font-size: 13px;
    margin-bottom: 4px;
  }

  .detail-value {
    color: #fff;
    font-size: 14px;
    font-family: monospace;
  }

  /* Custom Colors */
  .box-neon {
    background: rgba(57, 255, 20, 0.1);
    border-color: rgba(57, 255, 20, 0.3);
  }
  .text-neon { color: #39ff14; }

  .box-whatsapp {
    background: rgba(37, 211, 102, 0.1);
    border-color: rgba(37, 211, 102, 0.3);
  }
  .text-whatsapp { color: #25d366; }

  .box-danger {
    background: rgba(239, 68, 68, 0.1);
    border-color: rgba(239, 68, 68, 0.3);
  }
  .text-danger { color: #ef4444; }

  .meta-info {
    display: flex;
    gap: 12px;
    font-size: 12px;
    color: #6a6a7a;
    margin-top: 4px;
  }
`;

import { API_BASE_URL } from '../utils/apiConfig';

interface ExpiringAccountExtended extends ExpiringAccount {
  client_name: string;
  client_whatsapp: string;
}

export default function AlertsPanel() {
  const [expiringAccounts, setExpiringAccounts] = useState<ExpiringAccountExtended[]>([]);
  const [pendingRenewalAccounts, setPendingRenewalAccounts] = useState<any[]>([]);
  const [expiredAccounts, setExpiredAccounts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'expiring' | 'pending-renewal' | 'expired'>('expiring');
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    loadAlerts();
    loadPendingRenewalAccounts();
    loadExpired();
  }, []);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const data = await accountsAPI.expiring() as ExpiringAccountExtended[];
      setExpiringAccounts(data);
    } catch (error) {
      console.error('Erro ao carregar alertas:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPendingRenewalAccounts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/accounts/status/pending-renewal`);
      const data = await response.json();
      setPendingRenewalAccounts(data);
    } catch (error) {
      console.error('Erro ao carregar contas que precisam renovar:', error);
    }
  };

  const loadExpired = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/accounts/status/expired`);
      const data = await response.json();
      setExpiredAccounts(data);
    } catch (error) {
      console.error('Erro ao carregar contas vencidas:', error);
    }
  };

  const getUrgencyLevel = (daysLeft: number): 'urgent' | 'warning' | 'normal' => {
    if (daysLeft <= 1) return 'urgent';
    if (daysLeft <= 3) return 'warning';
    return 'normal';
  };

  const getUrgencyLabel = (daysLeft: number): string => {
    if (daysLeft <= 0) return 'VENCEU HOJE';
    if (daysLeft === 1) return 'VENCE AMANHÃ';
    return `VENCE EM ${daysLeft} DIAS`;
  };

  const openWhatsApp = (phone: string, name: string, daysLeft: number) => {
    const cleanPhone = phone.replace(/\D/g, '');
    let message = '';

    if (daysLeft <= 1) {
      message = `Olá ${name}! 😊

Vi aqui que sua conta GamePass vence ${daysLeft === 0 ? 'HOJE' : 'AMANHÃ'}! 🎮

Quer renovar? Tenho um desconto especial pra você como cliente fiel! 🔥

Me avisa aí que já te passo os valores!`;
    } else {
      message = `Olá ${name}! Tudo bem? 😊

Passando pra avisar que sua conta GamePass vence em ${daysLeft} dias! 🎮

Quer garantir a renovação com desconto? Me avisa que te passo as condições especiais! 🔥`;
    }

    window.open(`https://wa.me/55${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const copyMessage = async (id: number, name: string, daysLeft: number) => {
    const message = daysLeft <= 1
      ? `Olá ${name}! Vi que sua conta GamePass vence ${daysLeft === 0 ? 'hoje' : 'amanhã'}. Quer renovar com desconto?`
      : `Olá ${name}! Sua conta GamePass vence em ${daysLeft} dias. Quer garantir a renovação com desconto?`;

    await navigator.clipboard.writeText(message);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const urgentCount = expiringAccounts.filter(a => a.days_left <= 1).length;
  const warningCount = expiringAccounts.filter(a => a.days_left > 1 && a.days_left <= 3).length;
  const normalCount = expiringAccounts.filter(a => a.days_left > 3).length;

  return (
    <>
      <style>{styles}</style>
      <div className="alerts">
        <div className="alerts-header">
          <div>
            <h1 className="alerts-title">Alertas de Renovação</h1>
            <p className="alerts-subtitle">Clientes com contas próximas do vencimento</p>
          </div>

          <button className="btn btn-secondary" onClick={loadAlerts}>
            <RefreshCw size={18} />
            Atualizar
          </button>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon red">
              <AlertTriangle size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{urgentCount}</div>
              <div className="stat-label">Urgente (0-1 dias)</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon yellow">
              <Clock size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{warningCount}</div>
              <div className="stat-label">Atenção (2-3 dias)</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">
              <Bell size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{normalCount}</div>
              <div className="stat-label">Próximos (4-7 dias)</div>
            </div>
          </div>
        </div>

        {/* Tabs de Navegação */}
        <div className="tabs-container">
          <button
            onClick={() => setActiveTab('expiring')}
            className={`tab-btn ${activeTab === 'expiring' ? 'active-warning' : ''}`}
          >
            <Clock size={16} />
            Vencendo ({expiringAccounts.length})
          </button>
          <button
            onClick={() => setActiveTab('pending-renewal')}
            className={`tab-btn ${activeTab === 'pending-renewal' ? 'active-warning' : ''}`}
          >
            <AlertTriangle size={16} />
            Precisa Renovar ({pendingRenewalAccounts.length})
          </button>
          <button
            onClick={() => setActiveTab('expired')}
            className={`tab-btn ${activeTab === 'expired' ? 'active-danger' : ''}`}
          >
            <X size={16} />
            Vencidos ({expiredAccounts.length})
          </button>
        </div>

        {/* Alerts List - Vencendo */}
        {activeTab === 'expiring' && (
          <>
            {loading ? (
              <div className="empty-state">Carregando alertas...</div>
            ) : expiringAccounts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <CheckCircle size={36} />
                </div>
                <h3 style={{ color: '#fff', marginBottom: 8 }}>Tudo certo! 🎉</h3>
                <p>Nenhuma conta vencendo nos próximos 7 dias</p>
              </div>
            ) : (
              <div className="alerts-list">
                {expiringAccounts.map((account) => {
                  const urgency = getUrgencyLevel(account.days_left);

                  return (
                    <div key={account.id} className={`alert-card ${urgency}`}>
                      <div className={`alert-icon ${urgency}`}>
                        {urgency === 'urgent' ? <AlertTriangle size={24} /> : <Clock size={24} />}
                      </div>

                      <div className="alert-content">
                        <div className="alert-header">
                          <span className="alert-name">{account.client_name}</span>
                          <span className={`alert-badge ${urgency}`}>
                            {getUrgencyLabel(account.days_left)}
                          </span>
                        </div>

                        <div className="alert-details">
                          <span className="alert-detail">
                            📧 {account.email}
                          </span>
                          <span className="alert-detail">
                            📅 Vence: {new Date(account.expiry_date).toLocaleDateString('pt-BR')}
                          </span>
                          <span className="alert-detail">
                            📱 {account.client_whatsapp}
                          </span>
                        </div>
                      </div>

                      <div className="alert-actions">
                        <button
                          className="alert-btn copy"
                          onClick={() => copyMessage(account.id, account.client_name, account.days_left)}
                        >
                          {copiedId === account.id ? <Check size={16} /> : <Copy size={16} />}
                          {copiedId === account.id ? 'Copiado!' : 'Copiar'}
                        </button>
                        <button
                          className="alert-btn whatsapp"
                          onClick={() => openWhatsApp(account.client_whatsapp, account.client_name, account.days_left)}
                        >
                          <MessageCircle size={16} />
                          WhatsApp
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Contas que Precisam Renovar (Vencidas) */}
        {activeTab === 'pending-renewal' && (
          <div className="alert-section">
            <div className="section-header">
              <div>
                <h2 className="section-title">
                  <AlertTriangle size={20} style={{ color: '#f59e0b' }} />
                  Contas que Precisam Renovar
                </h2>
                <p className="section-subtitle">
                  {pendingRenewalAccounts.length} conta{pendingRenewalAccounts.length !== 1 ? 's' : ''} vencida{pendingRenewalAccounts.length !== 1 ? 's' : ''} aguardando renovação
                </p>
              </div>
              <button className="btn btn-secondary" onClick={loadPendingRenewalAccounts}>
                <RefreshCw size={16} />
                Atualizar
              </button>
            </div>

            {pendingRenewalAccounts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <CheckCircle size={40} />
                </div>
                <h3>Nenhuma conta precisa renovar</h3>
                <p>Todas as contas estão em dia! 🎉</p>
              </div>
            ) : (
              <div className="alerts-list">
                {pendingRenewalAccounts.map((account: any) => {
                  const daysExpired = account.days_expired || 0;
                  return (
                    <div key={account.id} className="alert-item urgent">
                      <div className="alert-content">
                        <div className="alert-header">
                          <span className="alert-name">{account.client_name}</span>
                          <span className="alert-badge urgent">
                            {daysExpired > 0 ? `Expirada há ${daysExpired} dia${daysExpired !== 1 ? 's' : ''}` : 'Expirada hoje'}
                          </span>
                        </div>

                        <div className="alert-details-container">
                          <div className="alert-detail-box box-neon">
                            <div className="detail-label text-neon">
                              🎮 CONTA GAMEPASS
                            </div>
                            <div className="detail-value">
                              {account.email}
                            </div>
                          </div>
                          <div className="alert-detail-box box-whatsapp">
                            <div className="detail-label text-whatsapp">
                              📱 CONTATO WHATSAPP
                            </div>
                            <div className="detail-value">
                              {account.client_whatsapp || 'Não informado'}
                            </div>
                          </div>
                          <div className="meta-info">
                            <span>📅 Venceu: {new Date(account.expiry_date).toLocaleDateString('pt-BR')}</span>
                            <span>💰 R$ {account.sale_price?.toFixed(2) || '0.00'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="alert-actions">
                        <button
                          className="alert-btn copy"
                          onClick={() => {
                            const message = `Olá ${account.client_name}! Tudo bem? 😊\n\nSua conta GamePass Ultimate venceu e precisa ser renovada! 🎮\n\nComo você é cliente fiel, tenho condições especiais:\n✅ Mesma conta, sem perder saves\n✅ Desconto exclusivo: R$59 (era R$69)\n✅ Entrega imediata após pagamento\n\nQuer garantir? Me avisa que já te passo o PIX! 🔥`;
                            navigator.clipboard.writeText(message);
                            setCopiedId(account.id);
                            setTimeout(() => setCopiedId(null), 2000);
                          }}
                        >
                          {copiedId === account.id ? <Check size={16} /> : <Copy size={16} />}
                          {copiedId === account.id ? 'Copiado!' : 'Copiar'}
                        </button>
                        <button
                          className="alert-btn whatsapp"
                          onClick={() => {
                            const cleanPhone = account.client_whatsapp?.replace(/\D/g, '') || '';
                            const message = encodeURIComponent(`Olá ${account.client_name}! Tudo bem? 😊\n\nSua conta GamePass Ultimate venceu e precisa ser renovada! 🎮\n\nComo você é cliente fiel, tenho condições especiais:\n✅ Mesma conta, sem perder saves\n✅ Desconto exclusivo: R$59 (era R$69)\n✅ Entrega imediata após pagamento\n\nQuer garantir? Me avisa que já te passo o PIX! 🔥`);
                            window.open(`https://wa.me/55${cleanPhone}?text=${message}`, '_blank');
                          }}
                        >
                          <MessageCircle size={16} />
                          WhatsApp
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Contas Vencidas (Sem venda) */}
        {activeTab === 'expired' && (
          <div className="alert-section">
            <div className="section-header">
              <div>
                <h2 className="section-title">
                  <X size={20} style={{ color: '#ef4444' }} />
                  Contas Vencidas
                </h2>
                <p className="section-subtitle">
                  {expiredAccounts.length} conta{expiredAccounts.length !== 1 ? 's' : ''} vencida{expiredAccounts.length !== 1 ? 's' : ''} sem venda vinculada
                </p>
              </div>
              <button className="btn btn-secondary" onClick={loadExpired}>
                <RefreshCw size={16} />
                Atualizar
              </button>
            </div>

            {expiredAccounts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <CheckCircle size={40} />
                </div>
                <h3>Nenhuma conta vencida</h3>
                <p>Todas as contas disponíveis estão válidas! 🎉</p>
              </div>
            ) : (
              <div className="alerts-list">
                {expiredAccounts.map((account: any) => {
                  const daysExpired = account.days_expired || 0;
                  return (
                    <div key={account.id} className="alert-item border-danger-light">
                      <div className="alert-content">
                        <div className="alert-header">
                          <span className="alert-name text-danger">Conta Vencida</span>
                          <span className="alert-badge bg-danger-light text-danger">
                            {daysExpired > 0 ? `Expirada há ${daysExpired} dia${daysExpired !== 1 ? 's' : ''}` : 'Expirada hoje'}
                          </span>
                        </div>

                        <div className="alert-details-container">
                          <div className="alert-detail-box box-danger">
                            <div className="detail-label text-danger">
                              🎮 CONTA GAMEPASS
                            </div>
                            <div className="detail-value">
                              {account.email}
                            </div>
                          </div>
                          <div className="meta-info">
                            <span>📅 Venceu: {new Date(account.expiry_date).toLocaleDateString('pt-BR')}</span>
                            <span>💰 Custo: R$ {account.cost?.toFixed(2) || '0.00'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Message Template */}
        <div className="message-template">
          <div className="template-header">
            <span className="template-title">💡 Dica: Mensagem de Renovação</span>
          </div>
          <div className="template-text">
            {`Olá [NOME]! Tudo bem? 😊

Passando pra avisar que sua conta GamePass Ultimate vence em [X] dias! 🎮

Como você é cliente fiel, tenho condições especiais pra renovação:
✅ Mesma conta, sem perder saves
✅ Desconto exclusivo: R$59 (era R$69)
✅ Entrega imediata após pagamento

Quer garantir? Me avisa que já te passo o PIX! 🔥`}
          </div>
        </div>
      </div>
    </>
  );
}


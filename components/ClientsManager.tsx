import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Users,
  MessageCircle,
  Star,
  Crown,
  UserPlus,
  Download
} from 'lucide-react';
import { clientsAPI } from '../services/api';
import type { Client } from '../types';

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
    background: linear-gradient(90deg, #39ff14, transparent);
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
    background: linear-gradient(180deg, #39ff14, transparent);
    border-radius: 4px;
    box-shadow: 0 0 15px #39ff14;
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
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 20px rgba(57, 255, 20, 0.1);
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
  }
  
  .clients-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    gap: 20px;
  }
  
  .client-card {
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

  .client-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(57, 255, 20, 0.2), transparent);
  }
  
  .client-card:hover {
    border-color: rgba(57, 255, 20, 0.25);
    transform: translateY(-4px);
    box-shadow: 0 15px 50px rgba(0, 0, 0, 0.4), 0 0 30px rgba(57, 255, 20, 0.1);
  }
  
  .client-header {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 18px;
  }
  
  .client-avatar {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Orbitron', sans-serif;
    font-weight: 600;
    font-size: 18px;
    color: #fff;
    flex-shrink: 0;
  }
  
  .client-avatar.novo {
    background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%);
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
  }
  
  .client-avatar.recorrente {
    background: linear-gradient(135deg, #39ff14 0%, #20c20e 50%, #107c10 100%);
    box-shadow: 0 0 20px rgba(57, 255, 20, 0.3);
  }
  
  .client-avatar.vip {
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%);
    box-shadow: 0 0 20px rgba(251, 191, 36, 0.3);
  }
  
  .client-info {
    flex: 1;
    min-width: 0;
  }
  
  .client-name {
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .client-tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    border-radius: 6px;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
  }
  
  .client-tag.novo {
    background: rgba(59, 130, 246, 0.15);
    color: #3b82f6;
  }
  
  .client-tag.recorrente {
    background: rgba(16, 185, 129, 0.15);
    color: #10b981;
  }
  
  .client-tag.vip {
    background: rgba(245, 158, 11, 0.15);
    color: #f59e0b;
  }
  
  .client-whatsapp {
    color: #6a6a7a;
    font-size: 13px;
    margin-top: 4px;
    font-family: 'JetBrains Mono', monospace;
  }
  
  .client-stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 16px;
  }
  
  .stat-item {
    background: rgba(10, 10, 15, 0.5);
    border-radius: 10px;
    padding: 12px;
    text-align: center;
  }
  
  .stat-value {
    font-size: 20px;
    font-weight: 700;
    color: #fff;
    font-family: 'JetBrains Mono', monospace;
  }
  
  .stat-label {
    font-size: 11px;
    color: #6a6a7a;
    text-transform: uppercase;
    margin-top: 4px;
  }
  
  .client-actions {
    display: flex;
    gap: 8px;
  }
  
  .client-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 10px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
  }
  
  .client-btn.whatsapp {
    background: rgba(37, 211, 102, 0.15);
    color: #25d366;
    border: 1px solid rgba(37, 211, 102, 0.3);
  }
  
  .client-btn.whatsapp:hover {
    background: rgba(37, 211, 102, 0.25);
  }
  
  .client-btn.edit {
    background: rgba(42, 42, 58, 0.5);
    color: #a0a0b0;
  }
  
  .client-btn.edit:hover {
    background: rgba(42, 42, 58, 0.8);
    color: #fff;
  }
  
  .client-btn.delete {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
  }
  
  .client-btn.delete:hover {
    background: rgba(239, 68, 68, 0.2);
  }
  
  .client-modal-overlay {
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
  
  .client-modal {
    background: #16161f;
    border: 1px solid rgba(42, 42, 58, 0.5);
    border-radius: 16px;
    width: 100%;
    max-width: 450px;
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
  
  .form-select {
    cursor: pointer;
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
    grid-column: 1 / -1;
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
`;

const tagLabels: Record<string, string> = {
  novo: 'Novo',
  recorrente: 'Recorrente',
  vip: 'VIP'
};

const tagIcons: Record<string, React.ReactNode> = {
  novo: <UserPlus size={10} />,
  recorrente: <Star size={10} />,
  vip: <Crown size={10} />
};

export default function ClientsManager() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    tag: 'novo',
    notes: ''
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const data = await clientsAPI.list() as Client[];
      setClients(data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportClients = () => {
    // Filtrar apenas clientes com dados válidos
    const clientsToExport = clients.filter(c => c.whatsapp || c.email);

    if (clientsToExport.length === 0) {
      alert('Nenhum cliente com dados para exportar');
      return;
    }

    // Formato CSV para Meta Ads
    // Meta Ads precisa de: email, phone (formato internacional), first_name, last_name
    const headers = ['email', 'phone', 'first_name', 'last_name'];

    const rows = clientsToExport.map(client => {
      const email = client.email || '';

      // Formatar WhatsApp para formato internacional (55 + DDD + número)
      let phone = '';
      if (client.whatsapp) {
        // Remove tudo que não é número
        const cleanPhone = client.whatsapp.replace(/\D/g, '');
        // Se não começa com 55, adiciona
        if (cleanPhone.length >= 10) {
          phone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
        }
      }

      // Separar nome em first_name e last_name
      const nameParts = client.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      return [
        email,
        phone,
        firstName,
        lastName
      ];
    });

    // Converter para CSV (formato compatível com Meta Ads)
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => {
        // Escapar aspas e vírgulas no CSV
        const cellStr = String(cell || '');
        if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
          return `"${cellStr.replace(/"/g, '""')}"`;
        }
        return cellStr;
      }).join(','))
    ].join('\n');

    // Criar e baixar arquivo CSV (BOM para UTF-8)
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `clientes_meta_ads_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert(`✅ ${clientsToExport.length} cliente(s) exportado(s) em formato CSV para Meta Ads!\n\nArquivo: clientes_meta_ads_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingClient) {
        await clientsAPI.update(editingClient.id, formData);
      } else {
        await clientsAPI.create(formData);
      }
      setShowModal(false);
      resetForm();
      loadClients();
    } catch (error: any) {
      alert(error.message || 'Erro ao salvar cliente');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await clientsAPI.delete(id);
        loadClients();
      } catch (error: any) {
        alert(error.message || 'Erro ao excluir cliente');
      }
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      whatsapp: client.whatsapp,
      tag: client.tag,
      notes: client.notes || ''
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingClient(null);
    setFormData({
      name: '',
      whatsapp: '',
      tag: 'novo',
      notes: ''
    });
  };

  const openWhatsApp = (phone: string | null | undefined, name: string | null | undefined) => {
    if (!phone) return;
    const cleanPhone = (phone || '').replace(/\D/g, '');
    const message = encodeURIComponent(`Olá ${name || 'Cliente'}! 😊`);
    window.open(`https://wa.me/55${cleanPhone}?text=${message}`, '_blank');
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  const formatPhone = (phone: string | null | undefined) => {
    if (!phone) return '';
    const cleaned = (phone || '').replace(/\D/g, '');
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    }
    return phone || '';
  };

  const filteredClients = clients.filter(client =>
    (client.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (client.whatsapp || '').includes(search)
  );

  return (
    <>
      <style>{styles}</style>
      <div className="manager">
        <div className="manager-header">
          <div>
            <h1 className="manager-title">Clientes</h1>
            <p className="manager-subtitle">Gerencie sua base de clientes</p>
          </div>

          <div className="header-actions">
            <div className="search-box">
              <Search size={18} color="#6a6a7a" />
              <input
                type="text"
                className="search-input"
                placeholder="Buscar por nome ou telefone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="btn btn-secondary" onClick={exportClients} title="Exportar todos os clientes">
              <Download size={18} />
              Exportar
            </button>
            <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
              <Plus size={18} />
              Novo Cliente
            </button>
          </div>
        </div>

        <div className="clients-grid">
          {loading ? (
            <div className="empty-state">Carregando...</div>
          ) : filteredClients.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Users size={36} />
              </div>
              <h3 className="text-white mb-8">Nenhum cliente encontrado</h3>
              <p>Adicione seu primeiro cliente clicando em "Novo Cliente"</p>
            </div>
          ) : (
            filteredClients.map((client) => (
              <div key={client.id} className="client-card">
                <div className="client-header">
                  <div className={`client-avatar ${client.tag}`}>
                    {getInitials(client.name)}
                  </div>
                  <div className="client-info">
                    <div className="client-name">
                      {client.name}
                      <span className={`client-tag ${client.tag}`}>
                        {tagIcons[client.tag]}
                        {tagLabels[client.tag]}
                      </span>
                    </div>
                    <div className="client-whatsapp">{formatPhone(client.whatsapp)}</div>
                  </div>
                </div>

                <div className="client-stats">
                  <div className="stat-item">
                    <div className="stat-value">{client.total_purchases || 0}</div>
                    <div className="stat-label">Compras</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value text-lg">
                      {formatCurrency(client.total_spent || 0)}
                    </div>
                    <div className="stat-label">Total Gasto</div>
                  </div>
                </div>

                <div className="client-actions">
                  <button
                    className="client-btn whatsapp"
                    onClick={() => openWhatsApp(client.whatsapp, client.name)}
                  >
                    <MessageCircle size={16} />
                    WhatsApp
                  </button>
                  <button className="client-btn edit" onClick={() => handleEdit(client)} title="Editar cliente">
                    <Edit2 size={16} />
                  </button>
                  <button className="client-btn delete" onClick={() => handleDelete(client.id)} title="Excluir cliente">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="client-modal-overlay" onClick={() => setShowModal(false)}>
            <div className="client-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">
                  {editingClient ? 'Editar Cliente' : 'Novo Cliente'}
                </h3>
                <button className="modal-close" onClick={() => setShowModal(false)} title="Fechar">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label className="form-label">Nome</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Nome do cliente"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">WhatsApp</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      placeholder="11999999999"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Categoria</label>
                    <select
                      className="form-select"
                      value={formData.tag}
                      onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                      aria-label="Categoria do cliente"
                    >
                      <option value="novo">Novo</option>
                      <option value="recorrente">Recorrente</option>
                      <option value="vip">VIP</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Observações (opcional)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Anotações sobre o cliente..."
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingClient ? 'Salvar' : 'Adicionar'}
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


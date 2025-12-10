// Database usando Supabase
import { supabase } from './supabase.js';
import { createHash, randomBytes } from 'crypto';

// Hash de senha
function hashPassword(password) {
  return createHash('sha256').update(password).digest('hex');
}

// Gerar token
function generateToken() {
  return randomBytes(32).toString('hex');
}

// Helper para calcular dias até expiração
function getDaysUntilExpiry(expiryDate) {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Database wrapper para Supabase
class Database {
  constructor() {
    this.useSupabase = supabase !== null;
  }

  // Accounts
  async getAllAccounts() {
    if (!this.useSupabase) {
      throw new Error('Supabase não configurado');
    }

    const { data: accounts, error } = await supabase
      .from('accounts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Atualizar statuses
    await this.updateAccountStatuses();

    // Buscar vendas e clientes relacionados
    const accountsWithDetails = await Promise.all(
      accounts.map(async (account) => {
        const { data: sale } = await supabase
          .from('sales')
          .select('*, clients(*)')
          .eq('account_id', account.id)
          .single();

        if (sale && sale.clients) {
          return {
            ...account,
            client_id: sale.clients.id,
            client_name: sale.clients.name,
            client_whatsapp: sale.clients.whatsapp,
            client_email: sale.clients.email,
            sale_date: sale.created_at
          };
        }
        return account;
      })
    );

    return accountsWithDetails;
  }

  async getAccountById(id) {
    if (!this.useSupabase) throw new Error('Supabase não configurado');
    
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async getAvailableAccounts() {
    if (!this.useSupabase) throw new Error('Supabase não configurado');
    
    await this.updateAccountStatuses();
    
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('status', 'available')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getSoldAccounts() {
    if (!this.useSupabase) throw new Error('Supabase não configurado');
    
    await this.updateAccountStatuses();
    
    const { data: accounts, error } = await supabase
      .from('accounts')
      .select('*')
      .in('status', ['sold', 'expiring', 'expired', 'pending_renewal'])
      .order('created_at', { ascending: false });

    if (error) throw error;

    const accountsWithDetails = await Promise.all(
      accounts.map(async (account) => {
        const { data: sale } = await supabase
          .from('sales')
          .select('*, clients(*)')
          .eq('account_id', account.id)
          .single();

        if (sale && sale.clients) {
          return {
            ...account,
            client_id: sale.clients.id,
            client_name: sale.clients.name || 'Desconhecido',
            client_whatsapp: sale.clients.whatsapp || '',
            client_email: sale.clients.email || '',
            sale_date: sale.created_at,
            sale_price: sale.sale_price
          };
        }
        return account;
      })
    );

    return accountsWithDetails;
  }

  async getExpiringAccounts() {
    if (!this.useSupabase) throw new Error('Supabase não configurado');
    
    await this.updateAccountStatuses();
    
    const { data: accounts, error } = await supabase
      .from('accounts')
      .select('*')
      .in('status', ['expiring', 'sold'])
      .order('expiry_date', { ascending: true });

    if (error) throw error;

    const today = new Date();
    const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const expiring = accounts
      .filter(a => {
        const expiry = new Date(a.expiry_date);
        return expiry >= today && expiry <= sevenDaysFromNow;
      })
      .map(account => ({
        ...account,
        days_left: getDaysUntilExpiry(account.expiry_date)
      }));

    const accountsWithDetails = await Promise.all(
      expiring.map(async (account) => {
        const { data: sale } = await supabase
          .from('sales')
          .select('*, clients(*)')
          .eq('account_id', account.id)
          .single();

        if (sale && sale.clients) {
          return {
            ...account,
            client_name: sale.clients.name || 'Desconhecido',
            client_whatsapp: sale.clients.whatsapp || ''
          };
        }
        return account;
      })
    );

    return accountsWithDetails.sort((a, b) => a.days_left - b.days_left);
  }

  async createAccount(data) {
    if (!this.useSupabase) throw new Error('Supabase não configurado');
    
    const account = {
      email: data.email,
      password: data.password,
      purchase_date: data.purchase_date,
      expiry_date: data.expiry_date,
      cost: data.cost || 35,
      status: 'available',
      notes: data.notes || ''
    };

    const { data: newAccount, error } = await supabase
      .from('accounts')
      .insert(account)
      .select()
      .single();

    if (error) throw error;
    return newAccount;
  }

  async updateAccount(id, data) {
    if (!this.useSupabase) throw new Error('Supabase não configurado');
    
    const { data: updated, error } = await supabase
      .from('accounts')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return updated;
  }

  async deleteAccount(id, force = false) {
    if (!this.useSupabase) throw new Error('Supabase não configurado');
    
    // Verificar se tem vendas
    const { data: sales } = await supabase
      .from('sales')
      .select('id')
      .eq('account_id', id);

    if (sales && sales.length > 0 && !force) {
      throw new Error('Não é possível deletar conta com vendas vinculadas');
    }

    // Se force=true, deletar vendas primeiro
    if (sales && sales.length > 0 && force) {
      await supabase
        .from('sales')
        .delete()
        .eq('account_id', id);
    }

    const { error } = await supabase
      .from('accounts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async updateAccountStatuses() {
    if (!this.useSupabase) return;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Buscar todas as contas
    const { data: accounts, error } = await supabase
      .from('accounts')
      .select('*');

    if (error) {
      console.error('Erro ao atualizar statuses:', error);
      return;
    }

    for (const account of accounts) {
      const expiryDate = new Date(account.expiry_date);
      expiryDate.setHours(0, 0, 0, 0);

      let newStatus = account.status;

      // Conta vencida
      if (expiryDate < today) {
        const { data: sale } = await supabase
          .from('sales')
          .select('id')
          .eq('account_id', account.id)
          .single();

        if (sale && account.status !== 'pending_renewal') {
          newStatus = 'pending_renewal';
        } else if (!sale && account.status !== 'expired') {
          newStatus = 'expired';
        }
      } else if (account.status === 'sold' && expiryDate >= today && expiryDate <= sevenDaysFromNow && account.status !== 'expiring') {
        newStatus = 'expiring';
      }

      if (newStatus !== account.status) {
        await supabase
          .from('accounts')
          .update({ status: newStatus, updated_at: new Date().toISOString() })
          .eq('id', account.id);
      }
    }
  }

  async getExpiredAccounts() {
    if (!this.useSupabase) throw new Error('Supabase não configurado');
    
    await this.updateAccountStatuses();
    
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('status', 'expired')
      .order('expiry_date', { ascending: true });

    if (error) throw error;

    return data.map(account => ({
      ...account,
      days_expired: getDaysUntilExpiry(account.expiry_date) * -1
    })).sort((a, b) => (b.days_expired || 0) - (a.days_expired || 0));
  }

  async getPendingRenewalAccounts() {
    if (!this.useSupabase) throw new Error('Supabase não configurado');
    
    await this.updateAccountStatuses();
    
    const { data: accounts, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('status', 'pending_renewal')
      .order('expiry_date', { ascending: true });

    if (error) throw error;

    const accountsWithDetails = await Promise.all(
      accounts.map(async (account) => {
        const { data: sale } = await supabase
          .from('sales')
          .select('*, clients(*)')
          .eq('account_id', account.id)
          .single();

        if (sale && sale.clients) {
          return {
            ...account,
            client_id: sale.clients.id,
            client_name: sale.clients.name || 'Desconhecido',
            client_email: sale.clients.email || '',
            client_whatsapp: sale.clients.whatsapp || '',
            sale_date: sale.created_at,
            sale_price: sale.sale_price,
            days_expired: getDaysUntilExpiry(account.expiry_date) * -1
          };
        }
        return {
          ...account,
          days_expired: getDaysUntilExpiry(account.expiry_date) * -1
        };
      })
    );

    return accountsWithDetails.sort((a, b) => (b.days_expired || 0) - (a.days_expired || 0));
  }

  // Clients
  async getAllClients() {
    if (!this.useSupabase) throw new Error('Supabase não configurado');
    
    const { data: clients, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const clientsWithStats = await Promise.all(
      clients.map(async (client) => {
        const { data: sales } = await supabase
          .from('sales')
          .select('*')
          .eq('client_id', client.id)
          .order('created_at', { ascending: false });

        const lastSale = sales && sales.length > 0 ? sales[0] : null;

        return {
          ...client,
          total_purchases: sales?.length || 0,
          total_spent: sales?.reduce((sum, s) => sum + s.sale_price, 0) || 0,
          last_purchase: lastSale?.created_at
        };
      })
    );

    return clientsWithStats;
  }

  async getClientById(id) {
    if (!this.useSupabase) throw new Error('Supabase não configurado');
    
    const { data: client, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    const { data: sales } = await supabase
      .from('sales')
      .select('*, accounts(*)')
      .eq('client_id', id)
      .order('created_at', { ascending: false });

    return {
      ...client,
      total_purchases: sales?.length || 0,
      total_spent: sales?.reduce((sum, s) => sum + s.sale_price, 0) || 0,
      purchases: sales?.map(sale => ({
        ...sale,
        account_email: sale.accounts?.email,
        expiry_date: sale.accounts?.expiry_date
      })) || []
    };
  }

  async getClientByWhatsapp(whatsapp) {
    if (!this.useSupabase) throw new Error('Supabase não configurado');
    
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('whatsapp', whatsapp)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async getClientByEmail(email) {
    if (!this.useSupabase) throw new Error('Supabase não configurado');
    
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async createClient(data) {
    if (!this.useSupabase) throw new Error('Supabase não configurado');
    
    if (data.whatsapp) {
      const existing = await this.getClientByWhatsapp(data.whatsapp);
      if (existing) {
        throw new Error('Cliente com este WhatsApp já existe');
      }
    }

    const client = {
      name: data.name,
      email: data.email || '',
      whatsapp: data.whatsapp || '',
      password_hash: data.password ? hashPassword(data.password) : null,
      tag: data.tag || 'novo',
      notes: data.notes || ''
    };

    const { data: newClient, error } = await supabase
      .from('clients')
      .insert(client)
      .select()
      .single();

    if (error) throw error;
    return newClient;
  }

  async updateClient(id, data) {
    if (!this.useSupabase) throw new Error('Supabase não configurado');
    
    const updateData = { ...data };
    if (data.password) {
      updateData.password_hash = hashPassword(data.password);
      delete updateData.password;
    }
    updateData.updated_at = new Date().toISOString();

    const { data: updated, error } = await supabase
      .from('clients')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return updated;
  }

  async deleteClient(id) {
    if (!this.useSupabase) throw new Error('Supabase não configurado');
    
    const { data: sales } = await supabase
      .from('sales')
      .select('id')
      .eq('client_id', id);

    if (sales && sales.length > 0) {
      throw new Error('Não é possível deletar cliente com vendas vinculadas');
    }

    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Portal - Autenticação
  async registerClientPortal(email, password) {
    if (!this.useSupabase) throw new Error('Supabase não configurado');
    
    const client = await this.getClientByEmail(email);
    
    if (!client) {
      throw new Error('Email não encontrado. Use o mesmo email da compra.');
    }

    if (client.password_hash) {
      throw new Error('Este email já possui cadastro. Faça login.');
    }

    const { data: sales } = await supabase
      .from('sales')
      .select('id')
      .eq('client_id', client.id);

    if (!sales || sales.length === 0) {
      throw new Error('Nenhuma compra encontrada para este email.');
    }

    await this.updateClient(client.id, { password });
    return { id: client.id, name: client.name, email: client.email };
  }

  async loginClientPortal(email, password) {
    if (!this.useSupabase) throw new Error('Supabase não configurado');
    
    const client = await this.getClientByEmail(email);
    
    if (!client) {
      throw new Error('Email não encontrado.');
    }

    if (!client.password_hash) {
      throw new Error('Primeiro acesso? Cadastre sua senha.');
    }

    if (client.password_hash !== hashPassword(password)) {
      throw new Error('Senha incorreta.');
    }

    const token = generateToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    await supabase
      .from('clients')
      .update({ auth_token: token, token_expires: expiresAt })
      .eq('id', client.id);

    return {
      token,
      client: {
        id: client.id,
        name: client.name,
        email: client.email
      }
    };
  }

  async validateToken(token) {
    if (!this.useSupabase) return null;
    
    const { data: client, error } = await supabase
      .from('clients')
      .select('*')
      .eq('auth_token', token)
      .single();

    if (error || !client) return null;

    if (new Date(client.token_expires) < new Date()) {
      return null;
    }

    return client;
  }

  async getClientActiveAccount(clientId) {
    if (!this.useSupabase) throw new Error('Supabase não configurado');
    
    await this.updateAccountStatuses();

    const { data: sales, error } = await supabase
      .from('sales')
      .select('*, accounts(*)')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) throw error;
    if (!sales || sales.length === 0) return null;

    const sale = sales[0];
    const account = sale.accounts;

    if (!account) return null;

    return {
      id: account.id,
      email: account.email,
      password: account.password,
      expiry_date: account.expiry_date,
      status: account.status,
      days_left: getDaysUntilExpiry(account.expiry_date),
      purchase_date: sale.created_at,
      sale_price: sale.sale_price
    };
  }

  async getClientPurchaseHistory(clientId) {
    if (!this.useSupabase) throw new Error('Supabase não configurado');
    
    const { data: sales, error } = await supabase
      .from('sales')
      .select('*, accounts(*)')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return sales.map(sale => ({
      id: sale.id,
      purchase_date: sale.created_at,
      sale_price: sale.sale_price,
      account_email: sale.accounts?.email,
      expiry_date: sale.accounts?.expiry_date,
      status: sale.accounts?.status
    }));
  }

  // Sales
  async getAllSales() {
    if (!this.useSupabase) throw new Error('Supabase não configurado');
    
    const { data: sales, error } = await supabase
      .from('sales')
      .select('*, clients(*), accounts(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return sales.map(sale => ({
      ...sale,
      client_name: sale.clients?.name,
      client_whatsapp: sale.clients?.whatsapp,
      client_email: sale.clients?.email,
      account_email: sale.accounts?.email,
      account_password: sale.accounts?.password,
      account_expiry: sale.accounts?.expiry_date
    }));
  }

  async getSaleById(id) {
    if (!this.useSupabase) throw new Error('Supabase não configurado');
    
    const { data: sale, error } = await supabase
      .from('sales')
      .select('*, clients(*), accounts(*)')
      .eq('id', id)
      .single();

    if (error) throw error;

    return {
      ...sale,
      client_name: sale.clients?.name,
      client_whatsapp: sale.clients?.whatsapp,
      client_email: sale.clients?.email,
      account_email: sale.accounts?.email,
      account_password: sale.accounts?.password,
      account_expiry: sale.accounts?.expiry_date
    };
  }

  async createSale(data) {
    if (!this.useSupabase) throw new Error('Supabase não configurado');
    
    let clientId = data.client_id;

    // Criar cliente se não existir
    if (!clientId && data.client_name && (data.client_whatsapp || data.client_email)) {
      let client = data.client_whatsapp ? await this.getClientByWhatsapp(data.client_whatsapp) : null;
      if (!client && data.client_email) {
        client = await this.getClientByEmail(data.client_email);
      }
      if (!client) {
        client = await this.createClient({
          name: data.client_name,
          whatsapp: data.client_whatsapp || '',
          email: data.client_email || '',
          tag: 'novo'
        });
      } else if (data.client_email && !client.email) {
        await this.updateClient(client.id, { email: data.client_email });
      }
      clientId = client.id;
    }

    // Verificar conta
    const account = await this.getAccountById(data.account_id);
    if (!account || account.status !== 'available') {
      throw new Error('Conta não está disponível');
    }

    // Criar venda
    const sale = {
      client_id: clientId,
      account_id: data.account_id,
      sale_price: data.sale_price,
      cost: account.cost,
      profit: data.sale_price - account.cost,
      payment_method: data.payment_method || 'pix',
      notes: data.notes || ''
    };

    const { data: newSale, error: saleError } = await supabase
      .from('sales')
      .insert(sale)
      .select()
      .single();

    if (saleError) throw saleError;

    // Marcar conta como vendida
    await this.updateAccount(data.account_id, { status: 'sold' });

    // Atualizar tag do cliente
    const { data: clientSales } = await supabase
      .from('sales')
      .select('id')
      .eq('client_id', clientId);

    const client = await this.getClientById(clientId);
    if (client) {
      if (clientSales.length >= 5 && client.tag !== 'vip') {
        await this.updateClient(clientId, { tag: 'vip' });
      } else if (clientSales.length >= 2 && client.tag === 'novo') {
        await this.updateClient(clientId, { tag: 'recorrente' });
      }
    }

    return await this.getSaleById(newSale.id);
  }

  async deleteSale(id) {
    if (!this.useSupabase) throw new Error('Supabase não configurado');
    
    const sale = await this.getSaleById(id);
    if (!sale) {
      throw new Error('Venda não encontrada');
    }

    // Voltar conta para disponível
    await this.updateAccount(sale.account_id, { status: 'available' });

    // Remover venda
    const { error } = await supabase
      .from('sales')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Dashboard
  async getDashboard() {
    if (!this.useSupabase) throw new Error('Supabase não configurado');
    
    await this.updateAccountStatuses();

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const { data: allSales } = await supabase
      .from('sales')
      .select('*');

    const todaySales = allSales?.filter(s => s.created_at.startsWith(today)) || [];
    const weekSales = allSales?.filter(s => new Date(s.created_at) >= weekAgo) || [];
    const monthSales = allSales?.filter(s => new Date(s.created_at) >= monthAgo) || [];

    const calcStats = (sales) => ({
      count: sales.length,
      revenue: sales.reduce((sum, s) => sum + s.sale_price, 0),
      profit: sales.reduce((sum, s) => sum + s.profit, 0)
    });

    const { data: accounts } = await supabase.from('accounts').select('status');
    const stockByStatus = (status) => accounts?.filter(a => a.status === status).length || 0;

    const { data: clients } = await supabase.from('clients').select('tag');
    const clientsByTag = (tag) => clients?.filter(c => c.tag === tag).length || 0;

    const expiringAccounts = await this.getExpiringAccounts();
    const recentSales = await this.getAllSales();

    // Vendas por dia (últimos 7 dias)
    const salesByDay = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const daySales = allSales?.filter(s => s.created_at.startsWith(dateStr)) || [];
      salesByDay.push({
        date: dateStr,
        count: daySales.length,
        revenue: daySales.reduce((sum, s) => sum + s.sale_price, 0),
        profit: daySales.reduce((sum, s) => sum + s.profit, 0)
      });
    }

    return {
      today: calcStats(todaySales),
      week: calcStats(weekSales),
      month: calcStats(monthSales),
      stock: {
        available: stockByStatus('available'),
        sold: stockByStatus('sold'),
        expiring: stockByStatus('expiring'),
        expired: stockByStatus('expired'),
        total: accounts?.length || 0
      },
      clients: {
        total: clients?.length || 0,
        new: clientsByTag('novo'),
        recurring: clientsByTag('recorrente'),
        vip: clientsByTag('vip')
      },
      expiringAccounts: expiringAccounts.slice(0, 10),
      recentSales: recentSales.slice(0, 5),
      salesByDay
    };
  }

  async markAccountForRenewal(accountId, clientEmail) {
    if (!this.useSupabase) throw new Error('Supabase não configurado');
    
    const account = await this.getAccountById(accountId);
    if (!account) {
      throw new Error('Conta não encontrada');
    }

    const { data: sale } = await supabase
      .from('sales')
      .select('*, clients(*)')
      .eq('account_id', accountId)
      .single();

    if (!sale) {
      throw new Error('Conta não possui venda vinculada');
    }

    if (!sale.clients || sale.clients.email !== clientEmail) {
      throw new Error('Email não corresponde ao cliente da conta');
    }

    await this.updateAccount(accountId, { status: 'pending_renewal' });

    return {
      account,
      client: sale.clients,
      message: 'Conta marcada para renovação'
    };
  }
}

export const db = new Database();

export async function initDatabase() {
  if (supabase) {
    console.log('✅ Banco de dados Supabase conectado!');
    console.log(`🔗 URL: ${process.env.SUPABASE_URL}`);
  } else {
    console.log('⚠️  Supabase não configurado. Usando banco JSON local.');
  }
}



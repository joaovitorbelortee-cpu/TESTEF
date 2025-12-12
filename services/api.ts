import { supabase } from '@/lib/supabase';
import type { Account, Client } from '@/lib/supabase';

// ==========================================
// DASHBOARD API
// ==========================================
export const dashboardAPI = {
  async getMetrics() {
    try {
      const { data: accounts, error: accountsError } = await supabase
        .from('accounts')
        .select('*');

      if (accountsError) throw accountsError;

      const { count: clientsCount, error: clientsError } = await supabase
        .from('clients')
        .select('id', { count: 'exact', head: true });

      if (clientsError) throw clientsError;

      const today = new Date().toISOString().split('T')[0];
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const soldAccounts = accounts?.filter(a => a.status === 'sold') || [];
      const todaySales = accounts?.filter(a => a.sold_date?.startsWith(today)) || [];
      const weekSales = accounts?.filter(a => {
        const saleDate = new Date(a.sold_date || 0);
        return saleDate >= sevenDaysAgo;
      }) || [];
      const monthSales = accounts?.filter(a => {
        const saleDate = new Date(a.sold_date || 0);
        return saleDate >= thirtyDaysAgo;
      }) || [];

      const recentSales = soldAccounts
        .sort((a, b) => new Date(b.sold_date || 0).getTime() - new Date(a.sold_date || 0).getTime())
        .slice(0, 5)
        .map(account => ({
          id: account.id,
          client_name: 'Cliente',
          plan: account.plan,
          sale_price: account.price || 0,
          created_at: account.sold_date || new Date().toISOString(),
        }));

      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

      const expiringAccounts = accounts?.filter(a => {
        if (!a.renewal_date) return false;
        const renewalDate = new Date(a.renewal_date);
        return renewalDate <= sevenDaysFromNow && renewalDate >= new Date();
      }) || [];

      // Dados de vendas por dia (mock inicial para tipagem exigida por DashboardData)
      const salesByDay = [
        { date: 'Seg', count: 0, revenue: 0, profit: 0 },
        { date: 'Ter', count: 0, revenue: 0, profit: 0 },
        { date: 'Qua', count: 0, revenue: 0, profit: 0 },
        { date: 'Qui', count: 0, revenue: 0, profit: 0 },
        { date: 'Sex', count: 0, revenue: 0, profit: 0 },
        { date: 'Sáb', count: 0, revenue: 0, profit: 0 },
        { date: 'Dom', count: 0, revenue: 0, profit: 0 }
      ];

      return {
        totalRevenue: soldAccounts.reduce((sum, a) => sum + (a.price || 0), 0),
        todayRevenue: todaySales.reduce((sum, a) => sum + (a.price || 0), 0),
        availableAccounts: accounts?.filter(a => a.status === 'available').length || 0,
        totalClients: clientsCount || 0,
        soldAccounts: soldAccounts.length,
        pendingRenewal: accounts?.filter(a => a.status === 'pending-renewal').length || 0,
        expiredAccounts: accounts?.filter(a => a.status === 'expired').length || 0,
        recentSales,
        expiringAccounts: expiringAccounts.map(a => ({
          id: a.id,
          // ExpiringAccount interface requires email, expiry_date, client_name, etc.
          email: a.email,
          plan: a.plan,
          // Fix: Map renewal_date to expiry_date as expected by interface
          expiry_date: a.renewal_date || '',
          client_name: 'Cliente', // Default since no join here
          client_whatsapp: '',
          days_left: Math.ceil((new Date(a.renewal_date || 0).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
        })),
        today: {
          revenue: todaySales.reduce((sum, a) => sum + (a.price || 0), 0),
          count: todaySales.length,
          profit: 0
        },
        week: {
          revenue: weekSales.reduce((sum, a) => sum + (a.price || 0), 0),
          count: weekSales.length,
          profit: 0
        },
        month: {
          revenue: monthSales.reduce((sum, a) => sum + (a.price || 0), 0),
          count: monthSales.length,
          profit: 0
        },
        stock: {
          available: accounts?.filter(a => a.status === 'available').length || 0,
          sold: soldAccounts.length,
          expiring: expiringAccounts.length,
          expired: accounts?.filter(a => a.status === 'expired').length || 0,
          total: accounts?.length || 0,
        },
        alerts: {
          expiring: expiringAccounts.length,
          expired: accounts?.filter(a => a.status === 'expired').length || 0,
        },
        // Required by DashboardData interface
        clients: {
          total: clientsCount || 0,
          new: 0,
          recurring: 0,
          vip: 0
        },
        salesByDay: salesByDay
      };
    } catch (error) {
      console.error('Erro ao buscar métricas:', error);
      throw error;
    }
  },

  async get() {
    return this.getMetrics();
  },
};

// ==========================================
// ACCOUNTS API
// ==========================================
export const accountsAPI = {
  async getAll(filters?: { status?: string; plan?: string }) {
    try {
      let query = supabase
        .from('accounts')
        .select('*, client:clients(*)')
        .order('created_at', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.plan) {
        query = query.eq('plan', filters.plan);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar contas:', error);
      throw error;
    }
  },

  async getById(id: string) {
    try {
      const { data, error } = await supabase
        .from('accounts')
        .select('*, client:clients(*)')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar conta:', error);
      throw error;
    }
  },

  async create(account: Omit<Account, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('accounts')
        .insert([{
          ...account,
          status: account.status || 'available',
          price: account.price || 69.00,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao criar conta:', error);
      throw error;
    }
  },

  async update(id: string | number, updates: Partial<Account>) {
    try {
      const { data, error } = await supabase
        .from('accounts')
        .update(updates)
        .eq('id', String(id))
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao atualizar conta:', error);
      throw error;
    }
  },

  async delete(id: string) {
    try {
      const { error } = await supabase
        .from('accounts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao deletar conta:', error);
      throw error;
    }
  },

  async getByStatus(status: string) {
    try {
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar contas por status:', error);
      throw error;
    }
  },

  async bulkUpdateStatus(ids: string[], status: string) {
    try {
      const { data, error } = await supabase
        .from('accounts')
        .update({ status })
        .in('id', ids)
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao atualizar status em lote:', error);
      throw error;
    }
  },

  async available() {
    return this.getByStatus('available');
  },

  async expiring() {
    try {
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .not('renewal_date', 'is', null)
        .lte('renewal_date', sevenDaysFromNow.toISOString())
        .gte('renewal_date', new Date().toISOString())
        .order('renewal_date', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar contas expirando:', error);
      throw error;
    }
  },
};

// ==========================================
// CLIENTS API
// ==========================================
export const clientsAPI = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      throw error;
    }
  },

  async getById(id: string | number) {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', String(id))
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      throw error;
    }
  },

  async create(client: Omit<Client, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([client])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      throw error;
    }
  },

  async update(id: string | number, updates: Partial<Client>) {
    try {
      const { data, error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', String(id))
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      throw error;
    }
  },

  async delete(id: string | number) {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', String(id));

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
      throw error;
    }
  },

  async getWithAccounts(id: string | number) {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*, accounts(*)')
        .eq('id', String(id))
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar cliente com contas:', error);
      throw error;
    }
  },

  async list() {
    return this.getAll();
  },
};

// ==========================================
// PORTAL API
// ==========================================
export const portalAPI = {
  async login(email: string, password: string) {
    try {
      // 1. Verificar se o cliente existe
      const { data: client, error } = await supabase
        .from('clients')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !client) {
        throw new Error('Cliente não encontrado');
      }

      // 2. Verificar senha (comparação direta para a tabela "clients" legada)
      // Nota: Em produção, usar Supabase Auth ou hashing real.
      // A tabela clients tem 'password_hash' (segundo schema), mas aqui vamos assumir
      // que o sistema legado pode estar salvando texto plano ou precisamos verificar hash.
      // Se for texto plano (simples):
      if (client.password_hash !== password && client.password !== password) { // Tenta ambos campos se existirem
        throw new Error('Senha incorreta');
      }

      // 3. Gerar um "token" simples para sessão local (ID do cliente)
      // Em um app real, usar JWT do Supabase Auth.
      return {
        token: `mock-token-${client.id}`,
        client: {
          id: client.id,
          name: client.name,
          email: client.email
        }
      };
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  },

  async register(clientData: Omit<Client, 'id' | 'created_at' | 'updated_at'>) {
    try {
      // Verificar se email já existe
      const { data: existing } = await supabase
        .from('clients')
        .select('id')
        .eq('email', clientData.email)
        .single();

      if (existing) {
        throw new Error('Email já cadastrado');
      }

      const { data, error } = await supabase
        .from('clients')
        .insert([{
          ...clientData,
          password_hash: (clientData as any).password, // Mapeia password para password_hash
          tag: 'novo'
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao registrar:', error);
      throw error;
    }
  },

  async verify(token: string) {
    // Verifica token mockado (formato: mock-token-ID)
    if (!token.startsWith('mock-token-')) {
      throw new Error('Token inválido');
    }
    const id = token.replace('mock-token-', '');

    return clientsAPI.getById(id);
  },

  async getMyAccount(clientId: string | number) {
    try {
      // Busca a conta mais recente ou ativa
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('client_id', String(clientId))
        .neq('status', 'expired') // Preferencia por não expiradas
        .order('purchase_date', { ascending: false })
        .limit(1)
        .single();

      // Se não achar ativa, tenta pegar a última mesmo expirada
      if (error && error.code === 'PGRST116') {
        const { data: lastAccount, error: lastError } = await supabase
          .from('accounts')
          .select('*')
          .eq('client_id', String(clientId))
          .order('purchase_date', { ascending: false })
          .limit(1)
          .single();

        if (lastError) return null; // Sem contas
        return lastAccount;
      }

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar minha conta:', error);
      return null; // Retorna null em vez de erro para UI tratar "sem conta"
    }
  },

  async getPurchases(clientId: string | number) {
    try {
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('client_id', String(clientId))
        .order('purchase_date', { ascending: false });

      if (error) throw error;

      // Mapeia para formato esperado pela UI
      return data.map(acc => ({
        id: acc.id,
        purchase_date: acc.purchase_date || acc.sold_date || acc.created_at,
        sale_price: acc.cost || 0, // Fallback se não tiver sale_price na tabela accounts (ver schema)
        account_email: acc.email,
        expiry_date: acc.expiry_date,
        status: acc.status
      }));
    } catch (error) {
      console.error('Erro ao buscar compras:', error);
      throw error;
    }
  }
};

// ==========================================
// SALES API
// ==========================================
export const salesAPI = {
  async getAll() {
    return accountsAPI.getByStatus('sold');
  },

  async create(saleData: any) {
    return accountsAPI.update(saleData.accountId, {
      status: 'sold',
      sold_date: new Date().toISOString(),
      client_id: saleData.clientId,
    });
  },

  async getRecent(limit = 5) {
    try {
      const { data, error } = await supabase
        .from('accounts')
        .select('*, client:clients(*)')
        .eq('status', 'sold')
        .order('sold_date', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar vendas recentes:', error);
      throw error;
    }
  },

  // Método Required by SalesManager.tsx
  async delete(id: string | number) {
    // Estornar venda = voltar conta para 'available'
    return accountsAPI.update(String(id), {
      status: 'available',
      sold_date: undefined,
      client_id: undefined,
    });
  },

  // Compatibility alias
  async list() {
    return this.getAll();
  }
};

export default {
  dashboard: dashboardAPI,
  accounts: accountsAPI,
  clients: clientsAPI,
  portal: portalAPI,
  sales: salesAPI,
};

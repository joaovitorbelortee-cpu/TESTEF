import { supabase } from '@/lib/supabase';
import type { Account, Client } from '@/lib/supabase';

// ==========================================
// DASHBOARD API
// ==========================================
export const dashboardAPI = {
  async getMetrics() {
    try {
      // Buscar todas as contas
      const { data: accounts, error: accountsError } = await supabase
        .from('accounts')
        .select('*');

      if (accountsError) throw accountsError;

      // Buscar total de clientes
      const { count: clientsCount, error: clientsError } = await supabase
        .from('clients')
        .select('id', { count: 'exact', head: true });

      if (clientsError) throw clientsError;

      const today = new Date().toISOString().split('T')[0];
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Calcular métricas
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

      // Vendas recentes (últimas 5)
      const recentSales = soldAccounts
        .sort((a, b) => new Date(b.sold_date || 0).getTime() - new Date(a.sold_date || 0).getTime())
        .slice(0, 5)
        .map(account => ({
          id: account.id,
          clientName: 'Cliente', // Você pode fazer join com clients depois
          plan: account.plan,
          price: account.price,
          date: account.sold_date,
        }));

      // Contas vencendo nos próximos 7 dias
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

      const expiringAccounts = accounts?.filter(a => {
        if (!a.renewal_date) return false;
        const renewalDate = new Date(a.renewal_date);
        return renewalDate <= sevenDaysFromNow && renewalDate >= new Date();
      }) || [];

      // Dados de vendas por dia (mock inicial para tipagem)
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
          email: a.email,
          plan: a.plan,
          // Use renewal_date (from DB) as expiry_date (for frontend)
          expiry_date: a.renewal_date,
          // Add default values for missing client info since we didn't join with client table here
          client_name: 'Cliente',
          client_whatsapp: '',
          days_left: Math.ceil((new Date(a.renewal_date || 0).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
        })),
        // Campos adicionais para compatibilidade total com DashboardData
        today: {
          count: todaySales.length,
          revenue: todaySales.reduce((sum, a) => sum + (a.price || 0), 0),
          profit: 0 // Placeholder
        },
        week: {
          count: weekSales.length,
          revenue: weekSales.reduce((sum, a) => sum + (a.price || 0), 0),
          profit: 0 // Placeholder
        },
        month: {
          count: monthSales.length,
          revenue: monthSales.reduce((sum, a) => sum + (a.price || 0), 0),
          profit: 0 // Placeholder
        },
        stock: {
          available: accounts?.filter(a => a.status === 'available').length || 0,
          sold: soldAccounts.length,
          expiring: expiringAccounts.length,
          expired: accounts?.filter(a => a.status === 'expired').length || 0,
          total: accounts?.length || 0,
        },
        clients: {
          total: clientsCount || 0,
          new: 0, // Placeholder
          recurring: 0, // Placeholder
          vip: 0 // Placeholder
        },
        salesByDay: salesByDay,
        alerts: {
          expiring: expiringAccounts.length,
          expired: accounts?.filter(a => a.status === 'expired').length || 0,
        },
      };
    } catch (error) {
      console.error('Erro ao buscar métricas:', error);
      throw error;
    }
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

  // Métodos de compatibilidade
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

  // Métodos de compatibilidade
  async list() {
    return this.getAll();
  },
};

// ==========================================
// PORTAL API (para clientes)
// ==========================================
export const portalAPI = {
  async login(email: string, password: string) {
    try {
      // Implementar autenticação real depois
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('email', email)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  },

  async register(clientData: Omit<Client, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([clientData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao registrar:', error);
      throw error;
    }
  },

  async getMyAccount(clientId: string) {
    try {
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('client_id', clientId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar minha conta:', error);
      throw error;
    }
  },
};

// ==========================================
// SALES API (Compatibilidade)
// ==========================================
export const salesAPI = {
  async getAll() {
    return accountsAPI.getByStatus('sold');
  },

  async create(saleData: any) {
    // Venda = atualizar conta para 'sold' + adicionar client_id
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

  // Métodos de compatibilidade
  async list() {
    return this.getAll();
  },

  async delete(id: string | number) {
    // Estornar venda = voltar conta para 'available'
    return accountsAPI.update(String(id), {
      status: 'available',
      sold_date: undefined,
      client_id: undefined,
    });
  },
};

// Exportar tudo
export default {
  dashboard: dashboardAPI,
  accounts: accountsAPI,
  clients: clientsAPI,
  portal: portalAPI,
  sales: salesAPI,
};

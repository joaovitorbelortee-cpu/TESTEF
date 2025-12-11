// src/services/api.ts - SUBSTITUA TODO O CONTEÚDO POR ESTE
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

      // Calcular métricas
      const soldAccounts = accounts?.filter(a => a.status === 'sold') || [];
      const todaySales = accounts?.filter(a => a.sold_date?.startsWith(today)) || [];

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

      return {
        totalRevenue: soldAccounts.reduce((sum, a) => sum + (a.price || 0), 0),
        todayRevenue: todaySales.reduce((sum, a) => sum + (a.price || 0), 0),
        availableAccounts: accounts?.filter(a => a.status === 'available').length || 0,
        totalClients: clientsCount || 0,
        soldAccounts: soldAccounts.length,
        pendingRenewal: accounts?.filter(a => a.status === 'pending-renewal').length || 0,
        expiredAccounts: accounts?.filter(a => a.status === 'expired').length || 0,
        recentSales,
        expiringAccounts: expiringAccounts.length,
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

  async update(id: string, updates: Partial<Account>) {
    try {
      const { data, error } = await supabase
        .from('accounts')
        .update(updates)
        .eq('id', id)
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

  async getById(id: string) {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
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

  async update(id: string, updates: Partial<Client>) {
    try {
      const { data, error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      throw error;
    }
  },

  async delete(id: string) {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
      throw error;
    }
  },

  async getWithAccounts(id: string) {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*, accounts(*)')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar cliente com contas:', error);
      throw error;
    }
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

// Exportar tudo
export default {
  dashboard: dashboardAPI,
  accounts: accountsAPI,
  clients: clientsAPI,
  portal: portalAPI,
};

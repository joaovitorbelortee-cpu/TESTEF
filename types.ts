// Tipos do Sistema GamePass Manager

export interface Account {
  id: number;
  email: string;
  password: string;
  purchase_date: string;
  expiry_date: string;
  cost: number;
  status: 'available' | 'sold' | 'expiring' | 'expired' | 'pending_renewal';
  notes?: string;
  created_at: string;
  updated_at: string;
  // Dados do cliente (quando vendida)
  client_id?: number;
  client_name?: string;
  client_whatsapp?: string;
  client_email?: string;
  sale_date?: string;
  sale_price?: number;
}

export interface Client {
  id: number;
  name: string;
  email?: string;
  whatsapp: string;
  tag: 'novo' | 'recorrente' | 'vip';
  total_purchases: number;
  total_spent: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  last_purchase?: string;
  purchases?: Sale[];
}

export interface Sale {
  id: number;
  client_id: number;
  account_id: number;
  sale_price: number;
  cost: number;
  profit: number;
  payment_method: string;
  notes?: string;
  created_at: string;
  client_name?: string;
  client_whatsapp?: string;
  client_email?: string;
  account_email?: string;
  account_password?: string;
  account_expiry?: string;
}

export interface DashboardRecentSale {
  id: number;
  client_name?: string;
  plan?: string;
  sale_price: number;
  created_at: string;
}

export interface DashboardData {
  today: {
    count: number;
    revenue: number;
    profit: number;
  };
  week: {
    count: number;
    revenue: number;
    profit: number;
  };
  month: {
    count: number;
    revenue: number;
    profit: number;
  };
  stock: {
    available: number;
    sold: number;
    expiring: number;
    expired: number;
    total: number;
  };
  clients: {
    total: number;
    new: number;
    recurring: number;
    vip: number;
  };
  expiringAccounts: ExpiringAccount[];
  recentSales: DashboardRecentSale[];
  salesByDay: DailySales[];
}

export interface ExpiringAccount {
  id: number;
  email: string;
  expiry_date: string;
  client_name: string;
  client_whatsapp: string;
  days_left: number;
}

export interface DailySales {
  date: string;
  count: number;
  revenue: number;
  profit: number;
}

export type TabType = 'dashboard' | 'accounts' | 'clients' | 'sales' | 'alerts';

// Tipos do Portal do Cliente
export interface PortalClient {
  id: number;
  name: string;
  email: string;
}

export interface PortalAccount {
  id: number;
  email: string;
  password: string;
  expiry_date: string;
  status: string;
  days_left: number;
  purchase_date: string;
  sale_price: number;
}

export interface PortalPurchase {
  id: number;
  purchase_date: string;
  sale_price: number;
  account_email: string;
  expiry_date: string;
  status: string;
}

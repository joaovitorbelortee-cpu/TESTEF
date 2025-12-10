// API Service - Comunicação com o Backend
import { API_BASE_URL } from '../utils/apiConfig';

const API_URL = API_BASE_URL;

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  console.log('🔗 API Request:', url); // Debug
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    
    // Verificar se a resposta é HTML (erro comum quando API não está configurada)
    const contentType = response.headers.get('content-type');
    if (contentType && !contentType.includes('application/json')) {
      const text = await response.text();
      if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
        throw new Error(`A API retornou HTML ao invés de JSON. Verifique se VITE_API_URL está configurado corretamente no Netlify. URL atual: ${url}`);
      }
    }
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: `HTTP ${response.status}: ${response.statusText}` }));
      console.error('❌ API Error:', error);
      throw new Error(error.error || `Erro na requisição: ${response.status}`);
    }
    
    return response.json();
  } catch (error: any) {
    console.error('❌ Fetch Error:', error);
    
    // Melhorar mensagem de erro para "Failed to fetch"
    if (error.message?.includes('Failed to fetch') || error.name === 'TypeError') {
      throw new Error('Failed to fetch - Verifique se o servidor está rodando e acessível');
    }
    
    // Detectar erro de JSON inválido (HTML retornado)
    if (error.message?.includes('Unexpected token') || error.message?.includes('JSON')) {
      throw new Error('A API retornou HTML ao invés de JSON. Configure VITE_API_URL no Netlify apontando para o backend no Vercel.');
    }
    
    throw error;
  }
}

// Dashboard
export const dashboardAPI = {
  get: () => fetchAPI('/dashboard'),
};

// Accounts (Contas)
export const accountsAPI = {
  list: () => fetchAPI('/accounts'),
  get: (id: number) => fetchAPI(`/accounts/${id}`),
  create: (data: any) => fetchAPI('/accounts', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => fetchAPI(`/accounts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => fetchAPI(`/accounts/${id}`, { method: 'DELETE' }),
  available: () => fetchAPI('/accounts/status/available'),
  sold: () => fetchAPI('/accounts/status/sold'),
  expiring: () => fetchAPI('/accounts/status/expiring'),
};

// Clients (Clientes)
export const clientsAPI = {
  list: () => fetchAPI('/clients'),
  get: (id: number) => fetchAPI(`/clients/${id}`),
  create: (data: any) => fetchAPI('/clients', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => fetchAPI(`/clients/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => fetchAPI(`/clients/${id}`, { method: 'DELETE' }),
  expiring: () => fetchAPI('/clients/alerts/expiring'),
};

// Sales (Vendas)
export const salesAPI = {
  list: () => fetchAPI('/sales'),
  get: (id: number) => fetchAPI(`/sales/${id}`),
  create: (data: any) => fetchAPI('/sales', { method: 'POST', body: JSON.stringify(data) }),
  delete: (id: number) => fetchAPI(`/sales/${id}`, { method: 'DELETE' }),
  today: () => fetchAPI('/sales/period/today'),
  week: () => fetchAPI('/sales/period/week'),
  month: () => fetchAPI('/sales/period/month'),
};

// Portal (Cliente)
export const portalAPI = {
  login: (email: string, password: string) => 
    fetchAPI('/portal/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  
  register: (email: string, password: string) => 
    fetchAPI('/portal/register', { method: 'POST', body: JSON.stringify({ email, password }) }),
  
  checkEmail: (email: string) => 
    fetchAPI('/portal/check-email', { method: 'POST', body: JSON.stringify({ email }) }),
  
  getMyAccount: (token: string) => 
    fetchAPI('/portal/my-account', { 
      headers: { 'Authorization': `Bearer ${token}` } 
    }),
  
  getPurchases: (token: string) => 
    fetchAPI('/portal/purchases', { 
      headers: { 'Authorization': `Bearer ${token}` } 
    }),
  
  verify: (token: string) => 
    fetchAPI('/portal/verify', { 
      headers: { 'Authorization': `Bearer ${token}` } 
    }),
  
  logout: (token: string) => 
    fetchAPI('/portal/logout', { 
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` } 
    }),
};

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createHash, randomBytes } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Em Netlify Functions, usar /tmp para escrita (único diretório writable em serverless)
// Em desenvolvimento, usar o diretório do servidor
const isServerless = process.env.NETLIFY === 'true' || process.env.AWS_LAMBDA_FUNCTION_NAME;
const dbPath = isServerless
  ? join('/tmp', 'gamepass-data.json')
  : join(__dirname, 'data.json');

// Estrutura inicial do banco
const initialDB = {
  accounts: [],
  clients: [],
  sales: [],
  nextIds: {
    accounts: 1,
    clients: 1,
    sales: 1
  }
};

// Carregar ou criar banco de dados
function loadDB() {
  try {
    if (existsSync(dbPath)) {
      const data = readFileSync(dbPath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Erro ao carregar banco:', error);
  }
  return { ...initialDB };
}

// Salvar banco de dados
function saveDB(db) {
  try {
    writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
  } catch (error) {
    console.error('Erro ao salvar banco:', error);
  }
}

// Hash de senha simples
function hashPassword(password) {
  return createHash('sha256').update(password).digest('hex');
}

// Gerar token simples
function generateToken() {
  return randomBytes(32).toString('hex');
}

// Database wrapper
class Database {
  constructor() {
    this.data = loadDB();
  }

  save() {
    saveDB(this.data);
  }

  // Accounts
  getAllAccounts() {
    this.updateAccountStatuses();
    return this.data.accounts.map(account => {
      const sale = this.data.sales.find(s => s.account_id === account.id);
      if (sale) {
        const client = this.data.clients.find(c => c.id === sale.client_id);
        return {
          ...account,
          client_id: client?.id,
          client_name: client?.name,
          client_whatsapp: client?.whatsapp,
          client_email: client?.email,
          sale_date: sale.created_at
        };
      }
      return account;
    });
  }

  getAccountById(id) {
    return this.data.accounts.find(a => a.id === id);
  }

  getAvailableAccounts() {
    this.updateAccountStatuses();
    return this.data.accounts.filter(a => a.status === 'available');
  }

  getSoldAccounts() {
    this.updateAccountStatuses();
    return this.data.accounts
      .filter(a => a.status === 'sold' || a.status === 'expiring' || a.status === 'expired')
      .map(account => {
        const sale = this.data.sales.find(s => s.account_id === account.id);
        const client = sale ? this.data.clients.find(c => c.id === sale.client_id) : null;
        return {
          ...account,
          client_id: client?.id,
          client_name: client?.name || 'Desconhecido',
          client_whatsapp: client?.whatsapp || '',
          client_email: client?.email || '',
          sale_date: sale?.created_at,
          sale_price: sale?.sale_price
        };
      });
  }

  getExpiringAccounts() {
    this.updateAccountStatuses();
    return this.data.accounts
      .filter(a => a.status === 'expiring' || (a.status === 'sold' && this.getDaysUntilExpiry(a.expiry_date) <= 7 && this.getDaysUntilExpiry(a.expiry_date) > 0))
      .map(account => {
        const sale = this.data.sales.find(s => s.account_id === account.id);
        const client = sale ? this.data.clients.find(c => c.id === sale.client_id) : null;
        return {
          ...account,
          client_name: client?.name || 'Desconhecido',
          client_whatsapp: client?.whatsapp || '',
          days_left: this.getDaysUntilExpiry(account.expiry_date)
        };
      })
      .sort((a, b) => a.days_left - b.days_left);
  }

  createAccount(data) {
    const account = {
      id: this.data.nextIds.accounts++,
      email: data.email,
      password: data.password,
      purchase_date: data.purchase_date,
      expiry_date: data.expiry_date,
      cost: data.cost || 35,
      status: 'available',
      notes: data.notes || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.data.accounts.push(account);
    this.save();
    return account;
  }

  updateAccount(id, data) {
    const index = this.data.accounts.findIndex(a => a.id === id);
    if (index !== -1) {
      this.data.accounts[index] = {
        ...this.data.accounts[index],
        ...data,
        updated_at: new Date().toISOString()
      };
      this.save();
      return this.data.accounts[index];
    }
    return null;
  }

  deleteAccount(id, force = false) {
    const hasSales = this.data.sales.some(s => s.account_id === id);
    if (hasSales && !force) {
      throw new Error('Não é possível deletar conta com vendas vinculadas');
    }

    // Se force=true, deletar as vendas vinculadas primeiro
    if (hasSales && force) {
      this.data.sales = this.data.sales.filter(s => s.account_id !== id);
    }

    this.data.accounts = this.data.accounts.filter(a => a.id !== id);
    this.save();
  }

  updateAccountStatuses() {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Zerar horas para comparação apenas de data
    const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    this.data.accounts.forEach(account => {
      const expiryDate = new Date(account.expiry_date);
      expiryDate.setHours(0, 0, 0, 0); // Zerar horas para comparação apenas de data

      // Conta vencida
      if (expiryDate < today) {
        const hasSale = this.data.sales.some(s => s.account_id === account.id);
        // Se tem venda, sempre marcar como precisa renovar (renovação manual)
        if (hasSale && account.status !== 'pending_renewal') {
          account.status = 'pending_renewal';
          account.updated_at = new Date().toISOString();
        } else if (!hasSale && account.status !== 'expired') {
          // Sem venda = conta disponível que expirou
          account.status = 'expired';
          account.updated_at = new Date().toISOString();
        }
      } else if (account.status === 'sold' && expiryDate >= today && expiryDate <= sevenDaysFromNow && account.status !== 'expiring') {
        account.status = 'expiring';
        account.updated_at = new Date().toISOString();
      }
    });

    this.save();
  }

  getExpiredAccounts() {
    this.updateAccountStatuses();
    return this.data.accounts
      .filter(a => a.status === 'expired')
      .map(account => {
        return {
          ...account,
          days_expired: this.getDaysUntilExpiry(account.expiry_date) * -1
        };
      })
      .sort((a, b) => {
        // Ordenar por dias expirados (mais tempo expirado primeiro)
        return (b.days_expired || 0) - (a.days_expired || 0);
      });
  }

  getPendingRenewalAccounts() {
    this.updateAccountStatuses();
    return this.data.accounts
      .filter(a => a.status === 'pending_renewal')
      .map(account => {
        const sale = this.data.sales.find(s => s.account_id === account.id);
        const client = sale ? this.data.clients.find(c => c.id === sale.client_id) : null;
        return {
          ...account,
          client_id: client?.id,
          client_name: client?.name || 'Desconhecido',
          client_email: client?.email || '',
          client_whatsapp: client?.whatsapp || '',
          sale_date: sale?.created_at,
          sale_price: sale?.sale_price,
          days_expired: this.getDaysUntilExpiry(account.expiry_date) * -1 // Dias desde que expirou
        };
      })
      .sort((a, b) => {
        // Ordenar por dias expirados (mais tempo expirado primeiro)
        return (b.days_expired || 0) - (a.days_expired || 0);
      });
  }

  getDaysUntilExpiry(expiryDate) {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  markAccountForRenewal(accountId, clientEmail) {
    const account = this.getAccountById(accountId);
    if (!account) {
      throw new Error('Conta não encontrada');
    }

    // Verificar se o email do cliente bate
    const sale = this.data.sales.find(s => s.account_id === accountId);
    if (!sale) {
      throw new Error('Conta não possui venda vinculada');
    }

    const client = this.data.clients.find(c => c.id === sale.client_id);
    if (!client || client.email !== clientEmail) {
      throw new Error('Email não corresponde ao cliente da conta');
    }

    // Marcar como precisa renovar
    account.status = 'pending_renewal';
    account.updated_at = new Date().toISOString();
    this.save();

    return {
      account,
      client,
      message: 'Conta marcada para renovação'
    };
  }

  // Clients
  getAllClients() {
    return this.data.clients.map(client => {
      const clientSales = this.data.sales.filter(s => s.client_id === client.id);
      const lastSale = clientSales.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
      return {
        ...client,
        total_purchases: clientSales.length,
        total_spent: clientSales.reduce((sum, s) => sum + s.sale_price, 0),
        last_purchase: lastSale?.created_at
      };
    });
  }

  getClientById(id) {
    const client = this.data.clients.find(c => c.id === id);
    if (!client) return null;

    const purchases = this.data.sales
      .filter(s => s.client_id === id)
      .map(sale => {
        const account = this.data.accounts.find(a => a.id === sale.account_id);
        return {
          ...sale,
          account_email: account?.email,
          expiry_date: account?.expiry_date
        };
      });

    return {
      ...client,
      total_purchases: purchases.length,
      total_spent: purchases.reduce((sum, s) => sum + s.sale_price, 0),
      purchases
    };
  }

  getClientByWhatsapp(whatsapp) {
    return this.data.clients.find(c => c.whatsapp === whatsapp);
  }

  getClientByEmail(email) {
    return this.data.clients.find(c => c.email === email);
  }

  createClient(data) {
    if (data.whatsapp && this.getClientByWhatsapp(data.whatsapp)) {
      throw new Error('Cliente com este WhatsApp já existe');
    }

    const client = {
      id: this.data.nextIds.clients++,
      name: data.name,
      email: data.email || '',
      whatsapp: data.whatsapp || '',
      password_hash: data.password ? hashPassword(data.password) : null,
      tag: data.tag || 'novo',
      notes: data.notes || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.data.clients.push(client);
    this.save();
    return client;
  }

  updateClient(id, data) {
    const index = this.data.clients.findIndex(c => c.id === id);
    if (index !== -1) {
      // Se estiver atualizando senha, fazer hash
      if (data.password) {
        data.password_hash = hashPassword(data.password);
        delete data.password;
      }
      this.data.clients[index] = {
        ...this.data.clients[index],
        ...data,
        updated_at: new Date().toISOString()
      };
      this.save();
      return this.data.clients[index];
    }
    return null;
  }

  deleteClient(id) {
    const hasSales = this.data.sales.some(s => s.client_id === id);
    if (hasSales) {
      throw new Error('Não é possível deletar cliente com vendas vinculadas');
    }
    this.data.clients = this.data.clients.filter(c => c.id !== id);
    this.save();
  }

  // Portal - Autenticação de Cliente
  registerClientPortal(email, password) {
    // Verificar se email já tem compra
    const client = this.data.clients.find(c => c.email === email);

    if (!client) {
      throw new Error('Email não encontrado. Use o mesmo email da compra.');
    }

    if (client.password_hash) {
      throw new Error('Este email já possui cadastro. Faça login.');
    }

    // Verificar se tem vendas vinculadas
    const hasPurchases = this.data.sales.some(s => s.client_id === client.id);
    if (!hasPurchases) {
      throw new Error('Nenhuma compra encontrada para este email.');
    }

    // Definir senha
    client.password_hash = hashPassword(password);
    client.updated_at = new Date().toISOString();
    this.save();

    return { id: client.id, name: client.name, email: client.email };
  }

  loginClientPortal(email, password) {
    const client = this.data.clients.find(c => c.email === email);

    if (!client) {
      throw new Error('Email não encontrado.');
    }

    if (!client.password_hash) {
      throw new Error('Primeiro acesso? Cadastre sua senha.');
    }

    if (client.password_hash !== hashPassword(password)) {
      throw new Error('Senha incorreta.');
    }

    // Gerar token
    const token = generateToken();
    client.auth_token = token;
    client.token_expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24h
    this.save();

    return {
      token,
      client: {
        id: client.id,
        name: client.name,
        email: client.email
      }
    };
  }

  validateToken(token) {
    const client = this.data.clients.find(c => c.auth_token === token);

    if (!client) {
      return null;
    }

    if (new Date(client.token_expires) < new Date()) {
      return null;
    }

    return client;
  }

  getClientActiveAccount(clientId) {
    this.updateAccountStatuses();

    // Buscar última venda do cliente
    const clientSales = this.data.sales
      .filter(s => s.client_id === clientId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    if (clientSales.length === 0) {
      return null;
    }

    const lastSale = clientSales[0];
    const account = this.data.accounts.find(a => a.id === lastSale.account_id);

    if (!account) {
      return null;
    }

    return {
      id: account.id,
      email: account.email,
      password: account.password,
      expiry_date: account.expiry_date,
      status: account.status,
      days_left: this.getDaysUntilExpiry(account.expiry_date),
      purchase_date: lastSale.created_at,
      sale_price: lastSale.sale_price
    };
  }

  getClientPurchaseHistory(clientId) {
    return this.data.sales
      .filter(s => s.client_id === clientId)
      .map(sale => {
        const account = this.data.accounts.find(a => a.id === sale.account_id);
        return {
          id: sale.id,
          purchase_date: sale.created_at,
          sale_price: sale.sale_price,
          account_email: account?.email,
          expiry_date: account?.expiry_date,
          status: account?.status
        };
      })
      .sort((a, b) => new Date(b.purchase_date) - new Date(a.purchase_date));
  }

  // Sales
  getAllSales() {
    return this.data.sales.map(sale => {
      const client = this.data.clients.find(c => c.id === sale.client_id);
      const account = this.data.accounts.find(a => a.id === sale.account_id);
      return {
        ...sale,
        client_name: client?.name,
        client_whatsapp: client?.whatsapp,
        client_email: client?.email,
        account_email: account?.email,
        account_password: account?.password,
        account_expiry: account?.expiry_date
      };
    }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  getSaleById(id) {
    const sale = this.data.sales.find(s => s.id === id);
    if (!sale) return null;

    const client = this.data.clients.find(c => c.id === sale.client_id);
    const account = this.data.accounts.find(a => a.id === sale.account_id);

    return {
      ...sale,
      client_name: client?.name,
      client_whatsapp: client?.whatsapp,
      client_email: client?.email,
      account_email: account?.email,
      account_password: account?.password,
      account_expiry: account?.expiry_date
    };
  }

  createSale(data) {
    let clientId = data.client_id;

    // Criar cliente se não existir
    if (!clientId && data.client_name && (data.client_whatsapp || data.client_email)) {
      let client = data.client_whatsapp ? this.getClientByWhatsapp(data.client_whatsapp) : null;
      if (!client && data.client_email) {
        client = this.getClientByEmail(data.client_email);
      }
      if (!client) {
        client = this.createClient({
          name: data.client_name,
          whatsapp: data.client_whatsapp || '',
          email: data.client_email || '',
          tag: 'novo'
        });
      } else {
        // Atualizar email se não tiver
        if (data.client_email && !client.email) {
          this.updateClient(client.id, { email: data.client_email });
        }
      }
      clientId = client.id;
    }

    // Verificar conta
    const account = this.getAccountById(data.account_id);
    if (!account || account.status !== 'available') {
      throw new Error('Conta não está disponível');
    }

    // Criar venda
    const sale = {
      id: this.data.nextIds.sales++,
      client_id: clientId,
      account_id: data.account_id,
      sale_price: data.sale_price,
      cost: account.cost,
      profit: data.sale_price - account.cost,
      payment_method: data.payment_method || 'pix',
      notes: data.notes || '',
      created_at: new Date().toISOString()
    };
    this.data.sales.push(sale);

    // Marcar conta como vendida
    this.updateAccount(data.account_id, { status: 'sold' });

    // Atualizar tag do cliente
    const clientSales = this.data.sales.filter(s => s.client_id === clientId);
    const client = this.data.clients.find(c => c.id === clientId);
    if (client) {
      if (clientSales.length >= 5 && client.tag !== 'vip') {
        this.updateClient(clientId, { tag: 'vip' });
      } else if (clientSales.length >= 2 && client.tag === 'novo') {
        this.updateClient(clientId, { tag: 'recorrente' });
      }
    }

    this.save();
    return this.getSaleById(sale.id);
  }

  deleteSale(id) {
    const sale = this.data.sales.find(s => s.id === id);
    if (!sale) {
      throw new Error('Venda não encontrada');
    }

    // Voltar conta para disponível
    this.updateAccount(sale.account_id, { status: 'available' });

    // Remover venda
    this.data.sales = this.data.sales.filter(s => s.id !== id);
    this.save();
  }

  // Dashboard
  getDashboard() {
    this.updateAccountStatuses();

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const todaySales = this.data.sales.filter(s => s.created_at.startsWith(today));
    const weekSales = this.data.sales.filter(s => new Date(s.created_at) >= weekAgo);
    const monthSales = this.data.sales.filter(s => new Date(s.created_at) >= monthAgo);

    const calcStats = (sales) => ({
      count: sales.length,
      revenue: sales.reduce((sum, s) => sum + s.sale_price, 0),
      profit: sales.reduce((sum, s) => sum + s.profit, 0)
    });

    const stockByStatus = (status) => this.data.accounts.filter(a => a.status === status).length;

    const clientsByTag = (tag) => this.data.clients.filter(c => c.tag === tag).length;

    // Vendas por dia (últimos 7 dias)
    const salesByDay = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const daySales = this.data.sales.filter(s => s.created_at.startsWith(dateStr));
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
        total: this.data.accounts.length
      },
      clients: {
        total: this.data.clients.length,
        new: clientsByTag('novo'),
        recurring: clientsByTag('recorrente'),
        vip: clientsByTag('vip')
      },
      expiringAccounts: this.getExpiringAccounts().slice(0, 10),
      recentSales: this.getAllSales().slice(0, 5),
      salesByDay
    };
  }
}

export const db = new Database();

export function initDatabase() {
  console.log('✅ Banco de dados JSON inicializado!');
  console.log(`📁 Arquivo: ${dbPath}`);
}

// Webhook Service - Envia notificações para n8n
// Configure a variável de ambiente N8N_WEBHOOK_URL no .env.local

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'https://makemoneyer.app.n8n.cloud/webhook/new-sale';

/**
 * Envia um evento para o n8n
 * @param {string} event - Tipo do evento (account_sold, account_added, account_expiring, etc)
 * @param {object} data - Dados do evento
 * @param {string} [overrideUrl] - URL específica para este evento (opcional)
 */
export async function sendWebhook(event, data, overrideUrl = null) {
    const url = overrideUrl || N8N_WEBHOOK_URL;

    if (!url) {
        console.log(`⚠️ Webhook URL não configurada. Evento ${event} não enviado.`);
        return null;
    }

    try {
        const payload = {
            event,
            timestamp: new Date().toISOString(),
            data
        };

        console.log(`📤 Enviando webhook para n8n: ${event} (${url})`);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            console.log(`✅ Webhook ${event} enviado com sucesso!`);
            return await response.json().catch(() => ({ success: true }));
        } else {
            console.error(`❌ Erro ao enviar webhook ${event}: ${response.status}`);
            return null;
        }
    } catch (error) {
        console.error(`❌ Erro ao enviar webhook ${event}:`, error.message);
        return null;
    }
}

// Eventos específicos
export const webhookEvents = {
    /**
     * Chamado quando uma conta é vendida
     */
    async accountSold(account, client, sale, extraData = {}) {
        return sendWebhook('account_sold', {
            // Flat structure for n8n
            client_name: client.name,
            client_email: client.email,
            client_phone: client.whatsapp,
            plan_type: 'monthly', // Default or derived if possible
            payment_method: extraData.payment_method || 'pix',
            payment_id: extraData.payment_id || `TRANS-${sale.id}`,
            amount: sale.sale_price || sale.amount || 0,
            transaction_date: sale.date || sale.created_at || new Date().toISOString()
        }, process.env.N8N_SALES_WEBHOOK);
    },

    /**
     * Chamado quando uma nova conta é adicionada ao estoque
     */
    async accountAdded(account) {
        return sendWebhook('account_added', {
            account: {
                id: account.id,
                email: account.email,
                expiry_date: account.expiry_date,
                cost: account.cost,
                status: account.status
            }
        });
    },

    /**
     * Chamado quando uma conta está prestes a expirar (7 dias ou menos)
     */
    async accountExpiring(account, client, daysLeft) {
        return sendWebhook('account_expiring', {
            account: {
                id: account.id,
                email: account.email,
                expiry_date: account.expiry_date,
                status: account.status
            },
            client: client ? {
                id: client.id,
                name: client.name,
                email: client.email,
                whatsapp: client.whatsapp
            } : null,
            days_left: daysLeft
        });
    },

    /**
     * Chamado quando uma conta expira
     */
    async accountExpired(account, client) {
        return sendWebhook('account_expired', {
            account: {
                id: account.id,
                email: account.email,
                expiry_date: account.expiry_date,
                status: account.status
            },
            client: client ? {
                id: client.id,
                name: client.name,
                email: client.email,
                whatsapp: client.whatsapp
            } : null
        });
    },

    /**
     * Chamado quando um cliente é criado
     */
    async clientCreated(client) {
        return sendWebhook('client_created', {
            client: {
                id: client.id,
                name: client.name,
                email: client.email,
                whatsapp: client.whatsapp,
                tag: client.tag
            }
        });
    }
};

export default webhookEvents;

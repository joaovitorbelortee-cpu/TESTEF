// Webhook Service - Envia notificações para n8n
// Configure a variável de ambiente N8N_WEBHOOK_URL no .env.local

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || '';

/**
 * Envia um evento para o n8n
 * @param {string} event - Tipo do evento (account_sold, account_added, account_expiring, etc)
 * @param {object} data - Dados do evento
 * @param {string} [overrideUrl] - URL específica para este evento (opcional)
 */
export async function sendWebhook(event, data, overrideUrl = null) {
    const url = overrideUrl || N8N_WEBHOOK_URL;

    if (!url) {
        console.warn(`⚠️ Webhook URL não configurada. Evento ${event} não enviado.`);
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
const webhookEvents = {
    /**
     * Chamado quando uma conta é vendida
     */
    async accountSold(account, client, sale, extraData = {}) {
        return sendWebhook('account_sold', {
            client_name: client.name,
            client_email: client.email,
            client_phone: client.whatsapp,
            plan_type: 'monthly',
            payment_method: extraData.payment_method || 'pix',
            payment_id: extraData.payment_id || `TRANS-${sale.id}`,
            amount: sale.sale_price || sale.amount || 0,
            transaction_date: sale.created_at || new Date().toISOString()
        }, process.env.N8N_SALES_WEBHOOK || 'https://makemoneyer2.app.n8n.cloud/webhook/new-sale');
    },

    /**
     * Chamado quando nova conta é adicionada
     */
    async accountAdded(account) {
        return sendWebhook('account_added', {
            account: {
                id: account.id,
                email: account.email,
                expiry_date: account.expiry_date,
                status: account.status
            }
        });
    },

    /**
     * Chamado quando conta expira
     */
    async accountExpiring(account, client, daysLeft) {
        const clientData = client ? {
            name: client.name,
            email: client.email,
            whatsapp: client.whatsapp
        } : null;

        return sendWebhook('account_expiring', {
            account_email: account.email,
            expiry_date: account.expiry_date,
            days_left: daysLeft,
            ...clientData
        });
    }
};

export default webhookEvents;

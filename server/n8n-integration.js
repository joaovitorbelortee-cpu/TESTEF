// N8N Integration Service
// Connects to GamePass Sales and Renewal Management System - v2

const N8N_SALES_WEBHOOK = process.env.N8N_SALES_WEBHOOK || 'https://makemoneyer2.app.n8n.cloud/webhook/new-sale';
const N8N_RENEWAL_WEBHOOK = process.env.N8N_RENEWAL_WEBHOOK || '';

/**
 * Envia dados de uma nova venda/pagamento para o n8n
 * @param {Object} saleData - Dados da venda
 */
async function processSale(saleData) {
    try {
        const response = await fetch(N8N_SALES_WEBHOOK, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'new_sale',
                ...saleData,
                timestamp: new Date().toISOString()
            })
        });

        if (!response.ok) {
            throw new Error(`N8N webhook error: ${response.status}`);
        }

        const result = await response.json();
        console.log('[N8N] Sale processed:', result);
        return result;
    } catch (error) {
        console.error('[N8N] Error processing sale:', error);
        throw error;
    }
}

/**
 * Envia solicitação de renovação para o n8n
 * @param {Object} renewalData - Dados da renovação
 */
async function processRenewal(renewalData) {
    try {
        const response = await fetch(N8N_RENEWAL_WEBHOOK, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'renewal',
                ...renewalData,
                timestamp: new Date().toISOString()
            })
        });

        if (!response.ok) {
            throw new Error(`N8N webhook error: ${response.status}`);
        }

        const result = await response.json();
        console.log('[N8N] Renewal processed:', result);
        return result;
    } catch (error) {
        console.error('[N8N] Error processing renewal:', error);
        throw error;
    }
}

/**
 * Notifica o n8n sobre uma conta que está expirando
 * @param {Object} accountData - Dados da conta
 */
async function notifyExpiring(accountData) {
    try {
        const response = await fetch(N8N_SALES_WEBHOOK, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'expiring_notification',
                ...accountData,
                timestamp: new Date().toISOString()
            })
        });

        if (!response.ok) {
            throw new Error(`N8N webhook error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('[N8N] Error notifying expiring:', error);
        throw error;
    }
}

module.exports = {
    processSale,
    processRenewal,
    notifyExpiring,
    N8N_SALES_WEBHOOK,
    N8N_RENEWAL_WEBHOOK
};

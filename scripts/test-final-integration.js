
import webhookEvents from '../server/webhook-service.js';

// Mock data to simulate a real sale
const mockClient = {
    name: "Final Integration User",
    email: `final.100percent.test.${Math.floor(Math.random() * 999999)}@gmail.com`,
    whatsapp: "+55 11 98888-7777"
};

const mockSale = {
    id: 99999,
    sale_price: 100.00,
    created_at: new Date().toISOString()
};

const mockAccount = {
    id: 1,
    email: "gamepass.acc@test.com"
};

console.log("=== INICIANDO TESTE FINAL DE INTEGRAÇÃO (BACKEND -> N8N -> SUPABASE) ===");
console.log(`Cliente Mock: ${mockClient.email}`);

async function runTest() {
    try {
        console.log("Simulando venda...");
        console.log("URL Alvo:", webhookEvents.N8N_SALES_WEBHOOK || process.env.N8N_SALES_WEBHOOK || 'https://makemoneyer2.app.n8n.cloud/webhook/new-sale');
        const result = await webhookEvents.accountSold(mockAccount, mockClient, mockSale, { payment_method: 'test_script' });

        console.log("\nResultado do Webhook Service:");
        console.log(JSON.stringify(result, null, 2));

        if (result && (result.success || result.action)) {
            console.log("\n✅ SUCESSO: O Backend enviou o webhook corretamente.");
            console.log("Agora verifique o banco de dados para confirmar se o registro foi criado.");
        } else {
            console.error("\n❌ ERRO: O Webhook falhou ou não retornou sucesso.");
        }

    } catch (error) {
        console.error("\n❌ ERRO FATAL NO SCRIPT:", error);
    }
}

runTest();

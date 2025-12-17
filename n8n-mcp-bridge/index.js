#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";

// Configuração do Servidor
const server = new Server(
    { name: "n8n-bridge", version: "1.0.0" },
    { capabilities: { tools: {} } }
);

// URL do seu Webhook no n8n (Nova Venda)
const N8N_NEW_SALE_WEBHOOK = "https://makemoneyer2.app.n8n.cloud/webhook/new-sale";

// 1. Listar as ferramentas disponíveis (O que vai aparecer no Antigravity)
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "n8n_new_sale",
                description: "Registra uma nova venda no n8n. Envia dados do cliente e pagamento para o workflow de vendas.",
                inputSchema: {
                    type: "object",
                    properties: {
                        client_name: { type: "string", description: "Nome do cliente" },
                        client_email: { type: "string", description: "Email do cliente" },
                        client_whatsapp: { type: "string", description: "WhatsApp do cliente" },
                        payment_id: { type: "string", description: "ID do pagamento" },
                        payment_method: { type: "string", description: "Método de pagamento (pix, cartao, etc)" },
                        amount: { type: "number", description: "Valor da venda" },
                    },
                    required: ["client_name", "client_email"],
                },
            },
            {
                name: "n8n_custom_action",
                description: "Executa uma ação customizada no n8n enviando dados para um webhook específico.",
                inputSchema: {
                    type: "object",
                    properties: {
                        webhook_url: { type: "string", description: "URL do webhook n8n" },
                        data: { type: "object", description: "Dados a serem enviados" },
                    },
                    required: ["webhook_url", "data"],
                },
            },
        ],
    };
});

// 2. Executar a ferramenta (Chama o n8n)
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    if (name === "n8n_new_sale") {
        try {
            const payload = {
                event: "account_sold",
                timestamp: new Date().toISOString(),
                data: {
                    client_name: args.client_name,
                    client_email: args.client_email,
                    client_phone: args.client_whatsapp || "",
                    plan_type: "monthly",
                    payment_method: args.payment_method || "pix",
                    payment_id: args.payment_id || `MCP-${Date.now()}`,
                    amount: args.amount || 0,
                    transaction_date: new Date().toISOString(),
                },
            };

            const response = await axios.post(N8N_NEW_SALE_WEBHOOK, payload, {
                headers: { "Content-Type": "application/json" },
            });

            return {
                content: [{ type: "text", text: `✅ Venda registrada no n8n com sucesso! Resposta: ${JSON.stringify(response.data)}` }],
            };
        } catch (error) {
            return {
                content: [{ type: "text", text: `❌ Erro ao conectar com n8n: ${error.message}` }],
            };
        }
    }

    if (name === "n8n_custom_action") {
        try {
            const response = await axios.post(args.webhook_url, args.data, {
                headers: { "Content-Type": "application/json" },
            });
            return {
                content: [{ type: "text", text: `✅ Ação executada! Resposta: ${JSON.stringify(response.data)}` }],
            };
        } catch (error) {
            return {
                content: [{ type: "text", text: `❌ Erro ao conectar com n8n: ${error.message}` }],
            };
        }
    }

    throw new Error(`Ferramenta "${name}" não encontrada`);
});

// Inicia o servidor via Stdio
const transport = new StdioServerTransport();
await server.connect(transport);

console.error("🚀 n8n-bridge MCP Server iniciado!");

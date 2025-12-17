# Integração n8n - GamePass Manager

## Endpoints para o n8n chamar

URL Base: `http://seu-servidor:3001/api/webhook/n8n`

### 1. Registrar Venda
**POST** `https://makemoneyer2.app.n8n.cloud/webhook/new-sale`

Quando um cliente pagar, o gateway de pagamento deve chamar este endpoint para registrar a venda automaticamente.

```json
{
  "client_email": "cliente@email.com",
  "client_name": "Nome do Cliente",
  "client_whatsapp": "11999999999",
  "sale_price": 69.90,
  "account_email": "conta@gamepass.com"
}
```

---

## Configurar Webhook de Retorno (Sistema -> n8n)

Para o sistema notificar o n8n quando eventos ocorrerem, configure a variável de ambiente:

```
N8N_WEBHOOK_URL=https://makemoneyer2.app.n8n.cloud/webhook/new-sale
```

O sistema enviará POSTs com a estrutura:
```json
{
  "event": "account_sold",
  "timestamp": "2025-01-10T12:00:00Z",
  "data": { ... }
}
```

**Eventos disponíveis:**
- `account_sold` - Conta vendida
- `account_added` - Nova conta no estoque
- `account_expiring` - Conta prestes a vencer
- `account_expired` - Conta venceu
- `client_created` - Novo cliente cadastrado

# Integração n8n - GamePass Manager

## Endpoints para o n8n chamar

URL Base: `http://seu-servidor:3001/api/webhook/n8n`

### 1. Registrar Venda
**POST** `/api/webhook/n8n/sale`

Quando um cliente pagar, o n8n chama este endpoint para registrar a venda automaticamente.

```json
{
  "client_email": "cliente@email.com",
  "client_name": "Nome do Cliente",
  "client_whatsapp": "11999999999",
  "sale_price": 69.90,
  "account_email": "conta@gamepass.com"
}
```

**Resposta:**
```json
{
  "success": true,
  "sale": {
    "id": 1,
    "client_name": "Nome",
    "account_email": "conta@gamepass.com",
    "account_password": "senha123",
    "expiry_date": "2025-01-15"
  }
}
```

---

### 2. Adicionar Conta ao Estoque
**POST** `/api/webhook/n8n/add-account`

Adiciona uma nova conta GamePass ao estoque.

```json
{
  "email": "novaconta@gamepass.com",
  "password": "senha123",
  "expiry_date": "2025-02-15",
  "cost": 35
}
```

---

### 3. Renovar Conta
**POST** `/api/webhook/n8n/renew`

Renova a conta de um cliente (estende prazo ou troca por nova conta).

**Opção A - Estender prazo:**
```json
{
  "client_email": "cliente@email.com",
  "new_expiry_date": "2025-03-15"
}
```

**Opção B - Trocar conta:**
```json
{
  "client_email": "cliente@email.com",
  "new_account_email": "novaconta@gamepass.com",
  "new_account_password": "novasenha"
}
```

---

### 4. Consultar Contas Expirando
**GET** `/api/webhook/n8n/expiring`

Retorna contas que vencem em até 7 dias. Use isso em um Schedule do n8n para verificar diariamente.

```json
{
  "success": true,
  "count": 3,
  "accounts": [
    {
      "id": 1,
      "email": "conta@gamepass.com",
      "expiry_date": "2025-01-18",
      "days_left": 5,
      "client_name": "João",
      "client_email": "joao@email.com",
      "client_whatsapp": "11999999999"
    }
  ]
}
```

---

### 5. Consultar Contas Expiradas
**GET** `/api/webhook/n8n/expired`

Retorna contas que já expiraram e precisam de renovação.

---

### 6. Consultar Estoque
**GET** `/api/webhook/n8n/stock`

Retorna contas disponíveis para venda.

---

## Configurar Webhook de Retorno (Sistema -> n8n)

Para o sistema notificar o n8n quando eventos ocorrerem, configure a variável de ambiente:

```
N8N_WEBHOOK_URL=https://seu-n8n.com/webhook/gamepass-events
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

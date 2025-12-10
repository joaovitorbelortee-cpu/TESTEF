# 🧪 GUIA DE TESTE DO PORTAL

## ✅ Servidores Verificados
- ✅ Backend rodando na porta 3001
- ✅ Frontend rodando na porta 3000
- ✅ Dados de teste criados

## 🔑 Credenciais de Teste

**Email:** `teste@email.com`  
**Senha:** `senha123`

## 📋 Passo a Passo

### 1. Acesse o Portal
Abra no navegador: **http://localhost:3000/portal**

### 2. Faça Login
- Email: `teste@email.com`
- Senha: `senha123`
- Clique em "Entrar"

### 3. Você Deve Ver
- Nome: João Silva
- Email da conta: `gamepass.teste@outlook.com`
- Senha da conta: `SenhaSegura123`
- Validade: até 15/01/2026
- Dias restantes: ~36 dias
- Botão "Renovar Conta" (abre WhatsApp)

## 🐛 Se Não Funcionar

### Verifique no Console do Navegador (F12)
- Erros de CORS?
- Erros 404?
- Erros 401?

### Teste a API Diretamente
```bash
# Teste de login
curl -X POST http://localhost:3001/api/portal/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@email.com","password":"senha123"}'
```

### Verifique os Logs
- Terminal do backend deve mostrar as requisições
- Terminal do frontend deve mostrar erros de compilação

## 📞 Dados da Conta de Teste
- **Cliente:** João Silva
- **Email cliente:** teste@email.com
- **WhatsApp:** 11999999999
- **Conta GamePass:** gamepass.teste@outlook.com
- **Senha conta:** SenhaSegura123
- **Status:** Vendida e vinculada



# ⚙️ Configurar Git - Comandos Corretos

## 📋 Comandos para Executar

**⚠️ IMPORTANTE:** O Git não está instalado no seu sistema. 

### Opção 1: Instalar Git Primeiro

1. Baixe e instale o Git: https://git-scm.com/download/win
2. **Reinicie o terminal** após instalar
3. Execute os comandos abaixo

### Opção 2: Usar GitHub Desktop

Se preferir interface gráfica:
1. Baixe: https://desktop.github.com/
2. Faça login
3. Configure nome e email nas configurações

---

## ✅ Comandos Corretos (Após Instalar Git)

### 1. Configurar Email
```bash
git config --global user.email "joaovitorbelortee@gmail.com"
```

### 2. Configurar Nome
```bash
git config --global user.name "belorte"
```

### 3. Verificar
```bash
git config --global --list
```

---

## 🔍 O que você digitou vs. o correto

❌ **Você digitou:**
```bash
git config --global user.email "joaovitorbelortee@gmail.com"
git config --global user.email "belorte"  # ❌ ERRADO (duplicado e nome errado)
```

✅ **Correto:**
```bash
git config --global user.email "joaovitorbelortee@gmail.com"
git config --global user.name "belorte"   # ✅ CORRETO (user.name, não user.email)
```

---

## 📝 Resumo

- **Email:** `joaovitorbelortee@gmail.com`
- **Nome:** `belorte`

---

**Execute os comandos após instalar o Git! 🚀**


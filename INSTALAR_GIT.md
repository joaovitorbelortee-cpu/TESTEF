# 📥 Como Instalar Git no Windows

## Opção 1: Instalar Git (Recomendado)

### Passo 1: Baixar Git

1. Acesse: https://git-scm.com/download/win
2. O download começará automaticamente
3. Execute o instalador `.exe` baixado

### Passo 2: Instalar

1. **Next** em todas as telas (configurações padrão são boas)
2. **Importante**: Na tela "Choosing the default editor", escolha:
   - **"Use Visual Studio Code"** (se tiver VS Code)
   - Ou **"Nano editor"** (mais simples)
3. Continue clicando **Next**
4. Na tela "Adjusting your PATH environment":
   - Selecione **"Git from the command line and also from 3rd-party software"**
5. Continue e clique **Install**
6. Aguarde a instalação
7. Clique **Finish**

### Passo 3: Verificar Instalação

1. Abra um **novo** PowerShell ou CMD
2. Digite:
```bash
git --version
```

Se aparecer algo como `git version 2.x.x`, está instalado! ✅

---

## Opção 2: Usar GitHub Desktop (Mais Fácil)

Se preferir uma interface gráfica:

1. Baixe: https://desktop.github.com/
2. Instale e faça login com sua conta GitHub
3. Use a interface visual para fazer commits e push

---

## 🚀 Depois de Instalar Git

Siga o guia em `GITHUB_SETUP.md` para publicar seu projeto!

---

## ⚡ Comandos Rápidos (Depois de Instalar)

```bash
# Verificar se Git está instalado
git --version

# Configurar seu nome e email (fazer uma vez)
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@exemplo.com"

# Inicializar repositório
git init

# Adicionar todos os arquivos
git add .

# Fazer primeiro commit
git commit -m "Initial commit"

# Conectar ao GitHub (substitua SEU-USUARIO)
git remote add origin https://github.com/SEU-USUARIO/gamepass-manager.git

# Enviar para GitHub
git push -u origin main
```

---

**Pronto! Agora você pode usar Git! 🎉**



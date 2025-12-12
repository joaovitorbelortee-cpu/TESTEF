# ⚡ Solução Rápida: Branch "main" não aparece no Netlify

## 🎯 Solução Mais Rápida

### Se você já tem código no GitHub:

1. **No Netlify, ao conectar o repositório:**
   - Em **"Branch to deploy"**, **DIGITE MANUALMENTE**: `main`
   - Não precisa selecionar do dropdown, apenas digite!

2. **Ou selecione qualquer branch que aparecer** (geralmente funciona mesmo que não seja "main")

---

## 🔍 Verificar no GitHub qual branch você tem:

1. Acesse: `https://github.com/SEU-USUARIO/gamepass-manager`
2. Olhe no canto superior esquerdo - qual branch está selecionada?
   - Se for **"master"** → Use `master` no Netlify
   - Se for **"main"** → Use `main` no Netlify
   - Se for outra → Use o nome dessa branch

---

## ✅ Criar branch "main" no GitHub (se não existir):

### Opção 1: Via Interface (Mais Fácil)

1. No GitHub, clique no nome da branch atual (canto superior esquerdo)
2. Digite: `main`
3. Clique em **"Create branch: main from..."**
4. Pronto! Agora "main" existe

### Opção 2: Renomear branch atual

1. No GitHub: **Settings** → **Branches**
2. Em **"Default branch"**, clique no ícone de editar
3. Selecione ou crie "main"
4. Clique em **"Update"**

---

## 📋 Configuração no Netlify:

Quando conectar o repositório, configure assim:

```
Branch to deploy: main (ou digite manualmente)
Base directory: (deixe vazio)
Build command: npm run build
Publish directory: dist
```

---

## 🚨 Se ainda não funcionar:

1. **Verifique se tem commits no GitHub:**
   - O repositório precisa ter pelo menos 1 commit
   - Se estiver vazio, faça push do código primeiro

2. **Tente conectar novamente:**
   - No Netlify, desconecte o repositório
   - Conecte novamente
   - Agora deve aparecer as branches

3. **Use o arquivo `netlify.toml`:**
   - Já foi criado no projeto
   - Ele ajuda o Netlify a detectar as configurações

---

## 💡 Dica:

**Se você não tem Git instalado localmente**, você pode:

1. Usar **GitHub Desktop** (mais fácil)
2. Ou fazer tudo direto no GitHub via interface web
3. Ou usar o **GitHub Codespaces** (editor online)

---

**Resumo: Digite "main" manualmente no campo "Branch to deploy" no Netlify! 🎯**







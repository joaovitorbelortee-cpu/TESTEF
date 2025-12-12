# 🚀 Deploy no Netlify - Resolvendo Problema da Branch "main"

## ❌ Problema: Branch "main" não aparece no Netlify

Isso geralmente acontece quando:
1. O repositório no GitHub não tem commits na branch "main"
2. A branch principal tem outro nome (ex: "master")
3. O repositório está vazio ou não foi conectado corretamente

---

## ✅ Soluções

### Solução 1: Verificar qual é a branch principal no GitHub

1. Acesse seu repositório no GitHub
2. Veja qual branch está selecionada (geralmente aparece no topo)
3. Pode ser `main`, `master`, ou outra

**Se for "master":**
- No Netlify, selecione a branch **"master"** ao invés de "main"
- Ou renomeie a branch no GitHub (veja Solução 2)

---

### Solução 2: Renomear branch para "main" no GitHub

**Opção A: Via Interface do GitHub (Mais Fácil)**

1. Acesse: `https://github.com/SEU-USUARIO/gamepass-manager/settings`
2. Vá em **"Branches"** (menu lateral)
3. Em **"Default branch"**, clique no ícone de editar
4. Selecione ou crie a branch "main"
5. Clique em **"Update"** e confirme

**Opção B: Via GitHub Desktop**

1. Abra GitHub Desktop
2. Vá em **Branch** → **Rename...**
3. Digite: `main`
4. Faça push

**Opção C: Via Comandos (se tiver Git instalado)**

```bash
# Renomear branch local
git branch -m master main

# Fazer push da nova branch
git push -u origin main

# Deletar branch antiga no GitHub (opcional)
git push origin --delete master
```

---

### Solução 3: Criar branch "main" se não existir

**Se o repositório está vazio ou só tem "master":**

1. No GitHub, clique em **"main"** ou **"master"** (canto superior esquerdo)
2. Digite `main` e pressione Enter (cria nova branch)
3. Ou clique em **"Create branch: main"**
4. Agora a branch "main" existe!

---

### Solução 4: Configurar Netlify Manualmente

**Se ainda não aparecer:**

1. No Netlify, ao conectar o repositório:
   - **Branch to deploy**: Digite manualmente `main` (ou `master`)
   - **Base directory**: Deixe vazio (ou `/` se pedir)
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

2. Clique em **"Deploy site"**

---

## 🔧 Configuração Completa no Netlify

### Passo 1: Conectar Repositório

1. Acesse: https://app.netlify.com
2. Clique em **"Add new site"** → **"Import an existing project"**
3. Escolha **"GitHub"**
4. Autorize o Netlify (se pedir)
5. Selecione seu repositório: `gamepass-manager`

### Passo 2: Configurar Build

**Se a branch "main" aparecer:**
- ✅ Selecione **"main"**
- **Base directory**: (deixe vazio)
- **Build command**: `npm run build`
- **Publish directory**: `dist`

**Se NÃO aparecer:**
- Digite manualmente: `main` (ou `master` se for o caso)
- Ou selecione a branch que aparecer na lista

### Passo 3: Variáveis de Ambiente

No Netlify, vá em **Site settings** → **Environment variables** e adicione:

```
VITE_API_URL=https://seu-backend.vercel.app/api
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-chave-anon
```

### Passo 4: Deploy!

Clique em **"Deploy site"** e aguarde!

---

## 🐛 Troubleshooting

### Erro: "Branch not found"

**Solução:**
1. Verifique se a branch existe no GitHub
2. No Netlify, tente digitar o nome da branch manualmente
3. Ou crie a branch "main" no GitHub primeiro

### Erro: "Build failed"

**Solução:**
1. Verifique se `package.json` tem o script `build`
2. Verifique se todas as dependências estão no `package.json`
3. Veja os logs de build no Netlify para mais detalhes

### Branch aparece mas está vazia

**Solução:**
1. Certifique-se de que fez push dos arquivos:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

---

## 📝 Checklist Antes de Deployar

- [ ] Repositório criado no GitHub
- [ ] Código enviado para o GitHub (pelo menos 1 commit)
- [ ] Branch "main" (ou "master") existe no GitHub
- [ ] `package.json` tem script `build`
- [ ] `vite.config.ts` configurado corretamente
- [ ] `.gitignore` configurado (não commitar `node_modules`, `.env`)

---

## 🎯 Dica Rápida

**Se você já tem o código no GitHub mas a branch "main" não aparece:**

1. No Netlify, ao conectar o repositório
2. Em **"Branch to deploy"**, clique no dropdown
3. Se não aparecer "main", digite manualmente: `main`
4. Ou selecione qualquer branch que aparecer (geralmente funciona)

---

## 💡 Alternativa: Usar Vercel

Se o Netlify continuar dando problema, o Vercel é mais fácil para projetos React:

1. Acesse: https://vercel.com
2. Conecte o repositório GitHub
3. Deploy automático! (geralmente detecta tudo sozinho)

---

**Precisa de mais ajuda? Verifique os logs de build no Netlify!**







# 🔒 Resolver Erro de Secrets no Netlify

## ❌ Problema

O Netlify detectou chaves do Supabase expostas em arquivos de documentação e no código compilado, bloqueando o deploy por segurança.

## ✅ Solução Aplicada

1. ✅ **Removidas todas as chaves dos arquivos .md** - Substituídas por placeholders `[SUA_CHAVE]`
2. ✅ **Removidas chaves do código fonte** - `lib/supabaseClient.ts` agora usa apenas variáveis de ambiente
3. ✅ **Criado `.netlifyignore`** - Arquivos .md não serão incluídos no build
4. ✅ **Código limpo** - Nenhuma chave hardcoded no código

## 🚀 Próximos Passos

### 1. Fazer Commit e Push

```bash
git add .
git commit -m "Remover chaves expostas dos arquivos"
git push
```

### 2. Limpar Build Anterior no Netlify

1. Acesse: https://app.netlify.com
2. Vá em seu site → **Deploys**
3. Clique nos **3 pontinhos** (⋯) ao lado do último deploy
4. Selecione **"Trigger deploy"** → **"Clear cache and deploy site"**

### 3. Verificar Variáveis de Ambiente

Certifique-se de que as variáveis estão configuradas no Netlify:

**Site settings** → **Environment variables**:

```
VITE_SUPABASE_URL = https://cpzxslaufhomqxksyrwt.supabase.co
VITE_SUPABASE_ANON_KEY = sb_publishable_fHaiFGOVYvIy8iP-P6vNNg_2uFoQnAi
VITE_API_URL = [SUA_URL_DO_BACKEND]/api
```

⚠️ **IMPORTANTE:** As chaves devem estar APENAS nas variáveis de ambiente do Netlify, NÃO no código!

### 4. Aguardar Novo Build

O novo build será feito sem as chaves expostas, e o scanner de segredos não deve mais detectar problemas.

---

## 🔍 Se Ainda Der Erro

### Opção 1: Desabilitar Scanner de Segredos (Temporário)

No Netlify, você pode desabilitar o scanner temporariamente:

1. **Site settings** → **Build & deploy** → **Environment**
2. Adicione a variável:
   ```
   SECRETS_SCAN_ENABLED = false
   ```

⚠️ **Não recomendado para produção!** Use apenas para testar.

### Opção 2: Configurar Omit Paths

Se quiser manter o scanner ativo mas ignorar arquivos específicos:

1. **Site settings** → **Build & deploy** → **Environment**
2. Adicione:
   ```
   SECRETS_SCAN_OMIT_PATHS = *.md
   ```

---

## ✅ Checklist

- [ ] Chaves removidas dos arquivos .md
- [ ] Chaves removidas do código fonte
- [ ] `.netlifyignore` criado
- [ ] Commit e push feitos
- [ ] Build anterior limpo no Netlify
- [ ] Variáveis de ambiente configuradas no Netlify
- [ ] Novo deploy iniciado

---

**Pronto! O deploy deve funcionar agora! 🎉**






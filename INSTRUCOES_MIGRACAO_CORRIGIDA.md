# 🚀 INSTRUÇÕES PARA APLICAR MIGRAÇÃO NO SUPABASE (VERSÃO CORRIGIDA)

## ⚠️ IMPORTANTE: Use o arquivo corrigido!

O erro `ERROR: 42846: cannot cast type jsonb to uuid[]` foi corrigido. Use agora o arquivo **`database/apply_migrations_fixed.sql`** ao invés do anterior.

## 🔧 O que foi corrigido:

1. **Erro de cast JSONB → UUID[]**: Criada função auxiliar `is_campaign_member()` que trata corretamente campos JSONB
2. **Políticas RLS**: Reformuladas para usar a função auxiliar
3. **Verificação de membros**: Agora funciona com `members @> to_jsonb(user_uuid::text)`

## 📋 Passo a Passo

### 1. Acesse o Dashboard do Supabase
1. Vá para [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Faça login na sua conta
3. Selecione o projeto **ElariaSheet**

### 2. Abra o SQL Editor
1. No menu lateral, clique em **SQL Editor**
2. Clique em **New query** para criar uma nova consulta

### 3. Execute a Migração Corrigida
1. Abra o arquivo **`database/apply_migrations_fixed.sql`** (não o anterior!)
2. **Copie TODO o conteúdo** do arquivo
3. **Cole no SQL Editor** do Supabase
4. Clique em **Run** para executar

### 4. Verificar se deu certo
Após executar, você deve ver:
- ✅ Mensagens de sucesso para criação das tabelas
- ✅ Criação da função `is_campaign_member()`
- ✅ Políticas RLS criadas sem erros
- ✅ Tabela de verificação mostrando as 5 novas tabelas

## 🔧 Principais correções implementadas:

### Função auxiliar criada:
```sql
CREATE OR REPLACE FUNCTION is_campaign_member(campaign_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.campaigns 
        WHERE id = campaign_uuid 
        AND (
            owner_id = user_uuid OR
            members @> to_jsonb(user_uuid::text)
        )
    );
END;
$$ LANGUAGE plpgsql;
```

### Políticas RLS corrigidas:
- Agora usam `is_campaign_member()` ao invés de cast direto
- Tratam corretamente campos JSONB
- Sem erros de tipo

## 🚨 Se algo der errado

Se você encontrar algum erro durante a execução:

1. **Erro de função já existe**: Normal, o script usa `CREATE OR REPLACE`
2. **Erro de tabela já existe**: Normal, o script remove e recria
3. **Erro de permissão**: Certifique-se de estar logado como proprietário

## ✅ Depois de aplicar a migração

1. Volte para o aplicativo React
2. Recarregue a página (F5)
3. Tente acessar a seção "Campanhas"
4. Os erros 400/404 devem ter sumido!

## 🆘 Precisa de ajuda?

Se ainda houver problemas após aplicar a migração corrigida, me avise e eu ajudo a debugar!

---

**Arquivo de migração CORRIGIDO:** `database/apply_migrations_fixed.sql`
**Status:** ✅ Erro de cast JSONB→UUID[] corrigido, pronto para execução 
# 🗄️ Configuração do Banco de Dados - Elaria RPG

Este documento contém as instruções para configurar o banco de dados Supabase para o projeto Elaria RPG.

## 📋 Pré-requisitos

- Conta no [Supabase](https://supabase.com)
- Acesso ao painel de administração do projeto

## 🚀 Passo a Passo

### 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Faça login ou crie uma conta
3. Clique em "New Project"
4. Preencha os dados:
   - **Name**: `ElariaRPG`
   - **Database Password**: (escolha uma senha forte)
   - **Region**: (escolha a região mais próxima)
5. Clique em "Create new project"

### 2. Configurar Autenticação

1. No painel do projeto, vá em **Authentication > Settings**
2. Configure as seguintes opções:
   - **Site URL**: `http://localhost:3000` (desenvolvimento)
   - **Redirect URLs**: 
     - `http://localhost:3000/auth/callback`
     - `http://localhost:3000/reset-password`
3. Em **Email Templates**, personalize as mensagens se desejar

### 3. Executar Script SQL

1. No painel do projeto, vá em **SQL Editor**
2. Clique em "New Query"
3. Copie e cole o conteúdo do arquivo `schema.sql`
4. Clique em "Run" para executar o script

### 4. Configurar Row Level Security (RLS)

O script SQL já configura automaticamente as políticas de segurança. Verifique se estão ativas:

1. Vá em **Table Editor**
2. Para cada tabela (`profiles`, `characters`, `campaigns`, `activity_logs`):
   - Clique na tabela
   - Verifique se "RLS" está habilitado
   - Verifique se as políticas estão criadas

### 5. Obter Credenciais da API

1. Vá em **Settings > API**
2. Copie as seguintes informações:
   - **Project URL**
   - **anon public** key

### 6. Configurar Variáveis de Ambiente

1. No projeto React, crie o arquivo `.env.local`:
```bash
cp env.example .env.local
```

2. Edite o arquivo `.env.local` e adicione suas credenciais:
```env
REACT_APP_SUPABASE_URL=sua_project_url_aqui
REACT_APP_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

### 7. Testar Configuração

1. Execute o projeto React:
```bash
npm start
```

2. Teste o registro de um usuário
3. Verifique se o perfil foi criado automaticamente na tabela `profiles`

## 📊 Estrutura das Tabelas

### `profiles`
- Armazena informações dos usuários
- Criada automaticamente quando um usuário se registra
- Contém preferências e estatísticas

### `characters`
- Armazena todos os personagens
- Cada personagem pertence a um usuário
- Suporta versionamento e backup automático

### `campaigns`
- Armazena campanhas/grupos de jogo
- Permite múltiplos membros
- Configurações personalizáveis

### `activity_logs`
- Registra todas as atividades dos usuários
- Útil para auditoria e analytics
- Automático via triggers

## 🔒 Segurança

### Row Level Security (RLS)
- Todas as tabelas têm RLS habilitado
- Usuários só podem acessar seus próprios dados
- Personagens públicos podem ser vistos por todos

### Políticas Implementadas
- **profiles**: Usuários só podem ver/editar seu próprio perfil
- **characters**: Usuários só podem gerenciar seus personagens + ver públicos
- **campaigns**: Mestres gerenciam suas campanhas, jogadores veem campanhas que participam
- **activity_logs**: Usuários só veem seus próprios logs

## 🔧 Triggers e Funções

### Triggers Automáticos
- `on_auth_user_created`: Cria perfil automaticamente no registro
- `on_auth_user_login`: Atualiza last_login automaticamente
- `update_*_updated_at`: Atualiza timestamps automaticamente

### Funções
- `handle_new_user()`: Cria perfil de usuário
- `update_last_login()`: Atualiza último login
- `update_updated_at_column()`: Atualiza timestamps

## 📈 Índices de Performance

### Personagens
- `idx_characters_user_id`: Busca por usuário
- `idx_characters_is_public`: Filtro de visibilidade
- `idx_characters_tags`: Busca por tags (GIN)
- `idx_characters_created_at`: Ordenação por data

### Campanhas
- `idx_campaigns_owner_id`: Busca por proprietário
- `idx_campaigns_is_active`: Filtro de status

### Logs
- `idx_activity_logs_user_id`: Busca por usuário
- `idx_activity_logs_timestamp`: Ordenação por data
- `idx_activity_logs_action`: Filtro por ação

## 🚨 Troubleshooting

### Erro: "Variáveis de ambiente não configuradas"
- Verifique se o arquivo `.env.local` existe
- Confirme se as variáveis estão corretas
- Reinicie o servidor de desenvolvimento

### Erro: "Perfil não encontrado"
- Verifique se o trigger `on_auth_user_created` foi criado
- Aguarde alguns segundos após o registro
- Verifique se a tabela `profiles` existe

### Erro: "Acesso negado"
- Verifique se as políticas RLS estão ativas
- Confirme se o usuário está autenticado
- Verifique se as políticas estão corretas

### Erro: "Tabela não existe"
- Execute novamente o script SQL
- Verifique se não há erros de sintaxe
- Confirme se todas as tabelas foram criadas

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs no console do navegador
2. Consulte a documentação do Supabase
3. Verifique se todas as etapas foram seguidas
4. Teste com um projeto novo se necessário

---

**Nota**: Este banco de dados é otimizado para o sistema Elaria RPG e inclui todas as funcionalidades necessárias para autenticação, gerenciamento de personagens, campanhas e logs de atividade. 
<div align="center">

# 🎲 ELARIA RPG - Sistema de Fichas

*Sistema completo de gerenciamento de personagens para RPG Elaria com autenticação Google*

[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com/)

[![Deploy Status](https://img.shields.io/badge/Deploy-✅%20Live-brightgreen?style=flat-square)](https://elaria-react-sheet.vercel.app/)
[![Build Status](https://img.shields.io/badge/Build-✅%20Passing-brightgreen?style=flat-square)](https://github.com/BielTeles/ElariaReactSheet)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.2.0-orange?style=flat-square)](package.json)

</div>

---

## 📋 **Sobre o Projeto**

O **Elaria RPG** é um sistema completo de gerenciamento de fichas de personagens para RPG, desenvolvido especificamente para o sistema Elaria. Oferece uma interface intuitiva e moderna para criação, edição e gerenciamento de personagens, com sistema de autenticação Google integrado e armazenamento em nuvem via Supabase.

### 🌟 **Principais Características**

- 🔐 **Autenticação Google**: Login seguro com conta Google
- ☁️ **Armazenamento em Nuvem**: Dados salvos no Supabase
- 🎨 **Interface Moderna**: UI/UX responsiva com Tailwind CSS
- 💾 **Auto-salvamento**: Sistema inteligente de salvamento automático
- 📱 **Mobile-First**: Totalmente responsivo para todos os dispositivos
- 🔄 **Sincronização**: Dados sincronizados entre dispositivos
- 🎲 **Sistema de Dados**: Rolador de dados integrado com histórico
- 📝 **Sistema de Notas**: Notas organizadas por categoria
- 🛒 **Sistema de Loja**: Compra e venda de equipamentos
- 🖼️ **Upload de Imagens**: Suporte a drag & drop para retratos
- 🔒 **Páginas Protegidas**: Acesso restrito a usuários autenticados
- ♿ **Acessibilidade**: Componentes com suporte completo a leitores de tela
- 🔧 **Código Limpo**: Arquitetura baseada em boas práticas de desenvolvimento

---

## 🚀 **Demo Online**

🌐 **[Acesse a aplicação](https://elaria-sheet.vercel.app)**

> **Nota**: É necessário fazer login com uma conta Google para acessar as funcionalidades completas.

---

## 🔐 **Sistema de Autenticação**

### **Funcionalidades de Autenticação**
- ✅ **Login com Google**: Autenticação OAuth2 via Google
- ✅ **Perfil de Usuário**: Informações automáticas do Google
- ✅ **Proteção de Rotas**: Páginas restritas a usuários logados
- ✅ **Logout Seguro**: Desconexão completa da sessão
- ✅ **Persistência**: Sessão mantida entre visitas

### **Páginas Protegidas**
- 🔒 **Criação de Personagem** (`/characters/new`)
- 🔒 **Lista de Personagens** (`/characters`)
- 🔒 **Ficha de Personagem** (`/characters/:id`)
- 🔒 **Editor de Personagem** (`/character-sheet`)

### **Páginas Públicas**
- 🌐 **Página Inicial** (`/`)
- 🌐 **Guia de Referência** (`/reference`)

---

## 🛠️ **Tecnologias Utilizadas**

### **Frontend**
- **React 18** - Biblioteca principal
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework de CSS utilitário
- **Lucide React** - Ícones modernos
- **React Router DOM** - Roteamento

### **Backend & Autenticação**
- **Supabase** - Backend as a Service
- **Google OAuth2** - Autenticação
- **PostgreSQL** - Banco de dados (via Supabase)
- **Row Level Security** - Segurança de dados

### **Funcionalidades**
- **Real-time Sync** - Sincronização em tempo real
- **Auto-salvamento** - Sistema inteligente de salvamento
- **File API** - Upload de imagens
- **Service Workers** - Cache e performance
- **Responsive Design** - Design responsivo

### **Qualidade de Código**
- **ESLint** - Linting de código
- **Prettier** - Formatação automática
- **Hooks Personalizados** - Lógica reutilizável
- **Error Boundaries** - Tratamento de erros
- **TypeScript Strict** - Tipagem rigorosa

---

## 📦 **Instalação e Execução**

### **Pré-requisitos**
- Node.js 16+ 
- npm ou yarn

### **Configuração do Ambiente**

1. **Clone o repositório**
   ```bash
   git clone https://github.com/BielTeles/ElariaReactSheet.git
   cd ElariaReactSheet
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```


6. **Execute em desenvolvimento**
   ```bash
   npm start
   ```
   A aplicação estará disponível em `http://localhost:3000`

7. **Build para produção**
   ```bash
   npm run build
   ```

---

## 🎮 **Como Usar**

### **1. Primeiro Acesso**
- Acesse a aplicação
- Clique em "Entrar com Google"
- Autorize as permissões necessárias
- Seu perfil será criado automaticamente

### **2. Criação de Personagem**
- Acesse "Criar Personagem" (requer login)
- Siga o wizard passo a passo:
  - Detalhes pessoais
  - Raça e origem
  - Classe e subclasse
  - Atributos e perícias
  - Equipamentos
  - Revisão final
- Finalize e salve o personagem

### **3. Gerenciamento de Personagens**
- Visualize todos os seus personagens na lista
- Edite informações em tempo real
- Use o sistema de auto-salvamento
- Dados sincronizados automaticamente

### **4. Funcionalidades Avançadas**
- **Sistema de Dados**: Role dados com modificadores
- **Notas**: Organize informações por categorias
- **Loja**: Gerencie inventário e transações
- **Sincronização**: Acesse de qualquer dispositivo

---

## 🏗️ **Estrutura do Projeto**

```
src/
├── components/           # Componentes React
│   ├── CharacterWizard/ # Criação de personagens
│   ├── CharacterSheet/  # Ficha de personagem
│   ├── DiceRoller/      # Sistema de dados
│   ├── NotesSystem/     # Sistema de notas
│   ├── ShopSystem/      # Sistema de loja
│   ├── Header.tsx       # Cabeçalho com auth
│   ├── ErrorBoundary.tsx # Tratamento de erros
│   └── ui/              # Componentes base
├── contexts/            # Context API
│   ├── AuthContext.tsx  # Contexto de autenticação
│   ├── AlertContext.tsx # Sistema de alertas
│   └── ToastContext.tsx # Sistema de notificações
├── hooks/               # Hooks personalizados
│   ├── useAutoSave.ts   # Auto-salvamento
│   ├── useCharacterCalculations.ts # Cálculos
│   └── useDebounce.ts   # Debounce
├── services/            # Serviços
│   └── supabase.ts      # Cliente Supabase
├── pages/               # Páginas principais
│   ├── Home.tsx         # Página inicial
│   ├── CharacterCreation.tsx # Criação
│   ├── CharacterList.tsx # Lista
│   ├── CharacterSheet.tsx # Ficha
│   └── ReferenceGuide.tsx # Guia
├── utils/               # Utilitários
├── constants/           # Constantes
├── types/               # Tipagens TypeScript
│   ├── character.ts     # Tipos de personagem
│   ├── auth.ts          # Tipos de autenticação
│   └── database.ts      # Tipos do banco
└── data/                # Dados estáticos
```

---

## 🗄️ **Banco de Dados**

### **Tabelas Principais**
- **profiles**: Perfis de usuário
- **characters**: Personagens dos usuários
- **campaigns**: Campanhas (futuro)
- **activity_logs**: Logs de atividade

### **Políticas de Segurança (RLS)**
- Usuários só acessam seus próprios dados
- Autenticação obrigatória para operações
- Logs de auditoria para todas as ações

---

## 🔧 **Scripts Disponíveis**

| Comando | Descrição |
|---------|-----------|
| `npm start` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera build de produção |
| `npm test` | Executa os testes |
| `npm run eject` | Ejeta a configuração do Create React App |

---


## 🤝 **Contribuição**

Contribuições são sempre bem-vindas! Para contribuir:

1. **Fork** o projeto
2. Crie uma **branch** para sua feature (`git checkout -b feature/MinhaFeature`)
3. **Commit** suas mudanças (`git commit -m 'feat: Adiciona MinhaFeature'`)
4. **Push** para a branch (`git push origin feature/MinhaFeature`)
5. Abra um **Pull Request**

### **Diretrizes de Contribuição**
- Siga as convenções de código estabelecidas
- Adicione testes para novas funcionalidades
- Mantenha a documentação atualizada
- Use commits semânticos (feat, fix, docs, etc.)
- Teste a autenticação antes de enviar PR

---

## 📝 **Roadmap**

### **v1.3.0 - Próximas Funcionalidades**
- [ ] Sistema de campanhas compartilhadas
- [ ] Convites para campanhas
- [ ] Chat em tempo real
- [ ] Notificações push
- [ ] Temas personalizáveis

### **v1.4.0 - Futuro**
- [ ] Exportação para PDF
- [ ] Integração com Discord
- [ ] Sistema de mapas
- [ ] Automação de regras
- [ ] Modo offline

---

## 🔒 **Segurança**

### **Medidas Implementadas**
- ✅ **OAuth2 Google**: Autenticação segura
- ✅ **Row Level Security**: Isolamento de dados
- ✅ **HTTPS**: Comunicação criptografada
- ✅ **Validação de Entrada**: Sanitização de dados
- ✅ **Sessões Seguras**: Tokens JWT
- ✅ **Auditoria**: Logs de todas as ações

### **Políticas de Privacidade**
- Dados armazenados apenas no Supabase
- Informações do Google limitadas ao necessário
- Nenhum dado compartilhado com terceiros
- Usuário pode deletar conta a qualquer momento

---

## 📄 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 **Autor**

**Gabriel Teles**
- GitHub: [@BielTeles](https://github.com/BielTeles)
- LinkedIn: [Gabriel Teles](https://linkedin.com/in/gabrieltelesrosa)
- Email: contato@gabrielteles.dev

---

## 📞 **Suporte**

Encontrou um bug ou tem uma sugestão? 

- 🐛 **Bugs**: Abra uma [issue](https://github.com/BielTeles/ElariaReactSheet/issues)
- 💡 **Sugestões**: Use as [discussions](https://github.com/BielTeles/ElariaReactSheet/discussions)
- 📧 **Contato**: contato@gabrielteles.dev

---

<div align="center">

**⭐ Se você gostou do projeto, não esqueça de dar uma estrela!**

[![Stars](https://img.shields.io/github/stars/BielTeles/ElariaReactSheet?style=social)](https://github.com/BielTeles/ElariaReactSheet/stargazers)
[![Forks](https://img.shields.io/github/forks/BielTeles/ElariaReactSheet?style=social)](https://github.com/BielTeles/ElariaReactSheet/network/members)
[![Issues](https://img.shields.io/github/issues/BielTeles/ElariaReactSheet?style=social)](https://github.com/BielTeles/ElariaReactSheet/issues)

**🎲 Desenvolvido com ❤️ por Gabriel Teles**

</div>

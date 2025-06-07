<div align="center">

# 🎲 ELARIA RPG - Sistema de Fichas

*Sistema completo de gerenciamento de personagens para RPG Elaria*

[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com/)

[![Deploy Status](https://img.shields.io/badge/Deploy-✅%20Live-brightgreen?style=flat-square)](https://elaria-react-sheet.vercel.app/)
[![Build Status](https://img.shields.io/badge/Build-✅%20Passing-brightgreen?style=flat-square)](https://github.com/BielTeles/ElariaReactSheet)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.1.0-orange?style=flat-square)](package.json)

</div>

---

## 📋 **Sobre o Projeto**

O **Elaria RPG** é um sistema completo de gerenciamento de fichas de personagens para RPG, desenvolvido especificamente para o sistema Elaria. Oferece uma interface intuitiva e moderna para criação, edição e gerenciamento de personagens, com funcionalidades avançadas como auto-salvamento, sistema de backup, e experiência mobile-first.

### 🌟 **Principais Características**

- 🎨 **Interface Moderna**: UI/UX responsiva com Tailwind CSS
- 💾 **Auto-salvamento**: Sistema inteligente de salvamento automático
- 📱 **Mobile-First**: Totalmente responsivo para todos os dispositivos
- 🔄 **Backup Automático**: Sistema de backup e recuperação de dados
- 🎲 **Sistema de Dados**: Rolador de dados integrado com histórico
- 📝 **Sistema de Notas**: Notas organizadas por categoria
- 🛒 **Sistema de Loja**: Compra e venda de equipamentos
- 🖼️ **Upload de Imagens**: Suporte a drag & drop para retratos
- ♿ **Acessibilidade**: Componentes com suporte completo a leitores de tela
- 🔧 **Código Limpo**: Arquitetura baseada em boas práticas de desenvolvimento

---

## 🚀 **Demo Online**

🌐 **[Acesse a aplicação](https://elaria-react-sheet.vercel.app/)**

---

## 📸 **Screenshots**

<div align="center">

### 🏠 Tela Inicial
*Interface principal com navegação intuitiva*

### ⚔️ Criação de Personagem
*Wizard completo para criação de personagens*

### 📊 Ficha de Personagem
*Visualização completa com todas as informações*

### 📱 Versão Mobile
*Interface totalmente responsiva*

</div>

---

## 🛠️ **Tecnologias Utilizadas**

### **Frontend**
- **React 18** - Biblioteca principal
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework de CSS utilitário
- **Lucide React** - Ícones modernos
- **React Router DOM** - Roteamento

### **Funcionalidades**
- **LocalStorage** - Persistência de dados
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

### **Passo a Passo**

1. **Clone o repositório**
   ```bash
   git clone https://github.com/BielTeles/ElariaReactSheet.git
   cd ElariaReactSheet
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Execute em desenvolvimento**
   ```bash
   npm start
   ```
   A aplicação estará disponível em `http://localhost:3000`

4. **Build para produção**
   ```bash
   npm run build
   ```

---

## 🎮 **Como Usar**

### **1. Criação de Personagem**
- Acesse "Criar Personagem" na tela inicial
- Siga o wizard passo a passo
- Configure atributos, raça, classe e detalhes
- Finalize e salve o personagem

### **2. Gerenciamento**
- Visualize todos os personagens na lista
- Edite informações em tempo real
- Use o sistema de auto-salvamento
- Exporte/importe personagens

### **3. Funcionalidades Avançadas**
- **Sistema de Dados**: Role dados com modificadores
- **Notas**: Organize informações por categorias
- **Loja**: Gerencie inventário e transações
- **Backup**: Faça backup automático dos dados

---

## 🏗️ **Estrutura do Projeto**

```
src/
├── components/           # Componentes React
│   ├── CharacterWizard/ # Criação de personagens
│   ├── CharacterSheet/  # Ficha de personagem
│   ├── CharacterList/   # Lista de personagens
│   ├── DiceRoller/      # Sistema de dados
│   ├── NotesSystem/     # Sistema de notas
│   ├── ShopSystem/      # Sistema de loja
│   └── ui/              # Componentes base
├── hooks/               # Hooks personalizados
├── utils/               # Utilitários e validações
├── constants/           # Constantes centralizadas
├── types/               # Tipagens TypeScript
└── styles/              # Estilos globais
```

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
3. **Commit** suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. **Push** para a branch (`git push origin feature/MinhaFeature`)
5. Abra um **Pull Request**

### **Diretrizes de Contribuição**
- Siga as convenções de código estabelecidas
- Adicione testes para novas funcionalidades
- Mantenha a documentação atualizada
- Use commits semânticos (feat, fix, docs, etc.)

---

## 📝 **Roadmap**

### **v1.2.0 - Próximas Funcionalidades**
- [ ] Sistema de campanhas
- [ ] Compartilhamento de personagens
- [ ] Temas personalizáveis
- [ ] Exportação para PDF
- [ ] Sistema de chat integrado

### **v1.3.0 - Futuro**
- [ ] Multiplayer em tempo real
- [ ] Integração com Discord
- [ ] Sistema de mapas
- [ ] Automação de regras

---

## 📄 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 **Autor**

**Gabriel Teles**
- GitHub: [@BielTeles](https://github.com/BielTeles)
- LinkedIn: [Gabriel Teles](https://linkedin.com/in/gabriel-teles)

---

## 🙏 **Agradecimentos**

- **Sistema Elaria** - Sistema de RPG que inspirou este projeto
- **React Team** - Pela excelente biblioteca
- **Tailwind CSS** - Pelo framework CSS incrível
- **Vercel** - Pela hospedagem gratuita

---

<div align="center">

**⭐ Se você gostou do projeto, não esqueça de dar uma estrela!**

[![Stars](https://img.shields.io/github/stars/BielTeles/ElariaReactSheet?style=social)](https://github.com/BielTeles/ElariaReactSheet/stargazers)
[![Forks](https://img.shields.io/github/forks/BielTeles/ElariaReactSheet?style=social)](https://github.com/BielTeles/ElariaReactSheet/network/members)

</div>

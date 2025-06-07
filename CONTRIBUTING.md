# 🤝 Contribuindo para o Elaria RPG

Primeiro, obrigado por considerar contribuir para o Elaria RPG! 🎉

## 📋 Índice

- [🤝 Contribuindo para o Elaria RPG](#-contribuindo-para-o-elaria-rpg)
  - [📋 Índice](#-índice)
  - [🚀 Como Começar](#-como-começar)
  - [🔄 Processo de Contribuição](#-processo-de-contribuição)
  - [📝 Diretrizes de Código](#-diretrizes-de-código)
  - [🐛 Reportando Bugs](#-reportando-bugs)
  - [✨ Sugerindo Funcionalidades](#-sugerindo-funcionalidades)
  - [📚 Melhorando a Documentação](#-melhorando-a-documentação)
  - [🎨 Diretrizes de Design](#-diretrizes-de-design)
  - [📱 Considerações Mobile](#-considerações-mobile)
  - [🏷️ Convenções de Commit](#️-convenções-de-commit)
  - [🧪 Testando](#-testando)
  - [❓ Dúvidas](#-dúvidas)

## 🚀 Como Começar

1. **Fork** o repositório
2. **Clone** seu fork localmente:
   ```bash
   git clone https://github.com/seu-usuario/ElariaReactSheet.git
   cd ElariaReactSheet
   ```
3. **Instale** as dependências:
   ```bash
   npm install
   ```
4. **Execute** o projeto:
   ```bash
   npm start
   ```

## 🔄 Processo de Contribuição

1. **Crie uma branch** para sua contribuição:
   ```bash
   git checkout -b feature/minha-contribuicao
   ```

2. **Faça suas mudanças** seguindo as diretrizes de código

3. **Teste** suas mudanças:
   ```bash
   npm run build
   npm start
   ```

4. **Commit** suas mudanças com mensagem descritiva:
   ```bash
   git commit -m "feat: adiciona nova funcionalidade X"
   ```

5. **Push** para sua branch:
   ```bash
   git push origin feature/minha-contribuicao
   ```

6. **Abra um Pull Request** com descrição detalhada

## 📝 Diretrizes de Código

### **Estrutura de Arquivos**
- Componentes em `src/components/`
- Hooks personalizados em `src/hooks/`
- Utilitários em `src/utils/`
- Tipos em `src/types/`
- Constantes em `src/constants/`

### **Nomenclatura**
- **Componentes**: PascalCase (`CharacterSheet.tsx`)
- **Hooks**: camelCase com prefixo `use` (`useCharacterData.ts`)
- **Utilitários**: camelCase (`characterStorage.ts`)
- **Constantes**: UPPER_SNAKE_CASE (`MAX_ATTRIBUTE_VALUE`)

### **TypeScript**
- Use tipagem estrita
- Crie interfaces para props de componentes
- Documente tipos complexos
- Evite `any` - use tipos específicos

### **React**
- Use componentes funcionais com hooks
- Implemente `memo` quando necessário para performance
- Use `useCallback` e `useMemo` apropriadamente
- Mantenha componentes pequenos e focados

### **CSS/Styling**
- Use classes do Tailwind CSS
- Mantenha consistência com o design system
- Priorize responsividade (mobile-first)
- Use variáveis CSS para cores/espaçamentos customizados

## 🐛 Reportando Bugs

Use o template de bug report e inclua:
- Descrição clara do problema
- Passos para reproduzir
- Comportamento esperado vs atual
- Screenshots (se aplicável)
- Informações do sistema/browser

## ✨ Sugerindo Funcionalidades

Use o template de feature request e inclua:
- Descrição da funcionalidade
- Justificativa/motivação
- Como deveria funcionar
- Mockups ou exemplos (opcional)

## 📚 Melhorando a Documentação

Documentação é sempre bem-vinda:
- Corrija erros de digitação
- Melhore explicações
- Adicione exemplos
- Traduza conteúdo
- Atualize informações desatualizadas

## 🎨 Diretrizes de Design

### **Paleta de Cores**
- Primária: Azul (#2563EB)
- Secundária: Amarelo (#F59E0B)
- Sucesso: Verde (#10B981)
- Erro: Vermelho (#EF4444)
- Neutros: Escala de cinza

### **Tipografia**
- Headers: Font fantasy para títulos RPG
- Body: Font sans padrão do sistema
- Code: Font mono para código

### **Espaçamento**
- Use escala do Tailwind (4, 8, 16, 24, 32px)
- Mantenha consistência entre seções
- Priorize hierarquia visual

## 📱 Considerações Mobile

- Teste em diferentes tamanhos de tela
- Use breakpoints responsivos do Tailwind
- Garanta touch targets de pelo menos 44px
- Otimize para orientação portrait e landscape
- Considere limitações de performance mobile

## 🏷️ Convenções de Commit

Use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` nova funcionalidade
- `fix:` correção de bug
- `docs:` mudanças na documentação
- `style:` formatação, espaços, etc.
- `refactor:` refatoração de código
- `perf:` melhoria de performance
- `test:` adição/correção de testes
- `chore:` tarefas de build, dependências, etc.

**Exemplos:**
```bash
feat: adiciona sistema de backup automático
fix: corrige cálculo de HP em personagens de nível alto
docs: atualiza README com instruções de deploy
style: aplica formatação Prettier em todos os arquivos
```

## 🧪 Testando

### **Testes Manuais Essenciais**
- [ ] Criar novo personagem (fluxo completo)
- [ ] Editar personagem existente
- [ ] Salvar/carregar dados
- [ ] Responsividade mobile
- [ ] Diferentes navegadores
- [ ] Performance com múltiplos personagens

### **Áreas Críticas**
- Sistema de salvamento
- Cálculos de atributos
- Validação de formulários
- Upload de imagens
- Navegação entre páginas

## ❓ Dúvidas

Se você tem dúvidas:

1. **Verifique** a documentação existente
2. **Procure** por issues similares
3. **Abra uma issue** com tag "question"
4. **Entre em contato** via GitHub Discussions

---

## 🙏 Agradecimentos

Obrigado por contribuir para tornar o Elaria RPG melhor! Cada contribuição, por menor que seja, faz diferença. 🚀

---

**Lembre-se**: O objetivo é criar uma ferramenta incrível para mestres e jogadores de RPG. Mantenha isso em mente ao contribuir! 🎲✨ 
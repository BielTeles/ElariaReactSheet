# 🎲 Sistema de Rolagem Avançado - Elaria RPG

## 📋 **Visão Geral**

O Sistema de Rolagem Avançado é uma evolução completa do DiceRoller original, oferecendo múltiplas funcionalidades para enriquecer a experiência de jogo.

## ✨ **Novas Funcionalidades**

### **1. Interface com Abas Organizadas**
- **Perícias & Atributos**: Rolagens tradicionais do sistema Elaria
- **Rolagens Personalizadas**: Criação e salvamento de rolagens customizadas
- **Dano & Combate**: Ferramentas específicas para combate e dano
- **Histórico**: Visualização detalhada de todas as rolagens

### **2. Rolagens Personalizadas**
```typescript
// Exemplos de formatos suportados:
"1d20"     // 1 dado de 20 lados
"3d6+2"    // 3 dados de 6 lados + 2
"2d8-1"    // 2 dados de 8 lados - 1
"1d4"      // 1 dado de 4 lados
```

#### **Funcionalidades:**
- ✅ Parser inteligente de dados
- ✅ Modificadores dinâmicos (+/-)
- ✅ Salvamento de rolagens favoritas
- ✅ Categorização (combate, perícia, dano, utilitário)
- ✅ Notas e descrições personalizadas

### **3. Sistema de Dano e Combate**

#### **Armas Pré-configuradas:**
| Arma | Dano | Tipo |
|------|------|------|
| Adaga | 1d4 | Perfuração/Corte |
| Espada Curta | 1d6 | Corte |
| Espada Longa | 1d8 | Corte |
| Machado Grande | 1d8 | Corte |
| Arco Longo | 1d6 | Perfuração |
| Maça Leve | 1d6 | Impacto |
| Lança Curta | 1d6 | Perfuração |
| Besta Leve | 1d4 | Perfuração |

#### **Tipos de Dano:**
- Físico: Corte, Perfuração, Impacto
- Elemental: Fogo, Gelo, Elétrico, Ácido
- Especial: Psíquico

#### **Rolagens Especiais:**
- **Iniciativa**: 1d20 + modificadores
- **Cura Básica**: 1d4 de recuperação

### **4. Histórico Detalhado**

#### **Informações Registradas:**
- 🕐 Timestamp preciso
- 🎯 Tipo de rolagem (perícia, dano, personalizada)
- 🎲 Dados rolados individuais
- 📊 Cálculo detalhado (breakdown)
- ✅ Nível de sucesso (quando aplicável)
- 📝 Notas e observações

#### **Visualização:**
- Dados destacados (maior/menor conforme vantagem/desvantagem)
- Códigos de cor por tipo de rolagem
- Indicadores visuais de sucesso/fracasso

### **5. Configurações Avançadas**

#### **Animação:**
- 🔧 **Ativação**: Liga/desliga animações
- ⚡ **Velocidade**: Rápida (500ms), Normal (1000ms), Lenta (1500ms)
- 🎵 **Som**: Habilitação de efeitos sonoros (preparado)

#### **Funcionalidades:**
- 💾 **Auto-salvamento**: Salva rolagens personalizadas automaticamente
- 🔄 **Scroll automático**: Interface sempre atualizada

## 🛠️ **Como Usar**

### **Rolagens de Perícia/Atributo:**
1. Configure o valor da perícia (1-20)
2. Configure o valor do atributo (-1 a 12+)
3. Adicione modificadores se necessário
4. Clique em "Teste de Perícia" ou "Teste de Atributo"

### **Rolagens Personalizadas:**
1. Digite o formato dos dados (ex: "3d6+2")
2. Adicione modificadores extras
3. Nomeie a rolagem
4. Adicione notas (opcional)
5. Clique em "Rolar" ou "Salvar" para usar depois

### **Rolagens de Dano:**
1. Configure o modificador (FOR/DES)
2. Selecione o tipo de dano
3. Clique em uma arma pré-configurada
4. Ou use as rolagens especiais

## 📊 **Sistema de Vantagem/Desvantagem**

Baseado no livro oficial do Elaria RPG:

| Valor do Atributo | Dados | Resultado |
|------------------|-------|-----------|
| -1 ou menos | 2d20 | **Menor** (Desvantagem) |
| 0 a 1 | 1d20 | **Único** (Normal) |
| 2 a 3 | 2d20 | **Maior** (Vantagem) |
| 4 a 5 | 3d20 | **Maior** |
| 6 a 7 | 4d20 | **Maior** |
| 8 a 9 | 5d20 | **Maior** |
| 10 a 11 | 6d20 | **Maior** |
| 12+ | 7d20 | **Maior** |

## 🔧 **Arquitetura Técnica**

### **Componentes Principais:**
- `DiceRoller.tsx`: Componente principal com gerenciamento de estado
- `SkillRollPanel`: Interface para rolagens de perícia/atributo
- `CustomRollPanel`: Criação e gerenciamento de rolagens personalizadas
- `DamageRollPanel`: Sistema de combate e dano
- `HistoryPanel`: Visualização do histórico
- `ResultsPanel`: Exibição de resultados e configurações

### **Tipos TypeScript:**
```typescript
interface DiceRoll {
  id: string;
  timestamp: Date;
  type: 'attribute' | 'skill' | 'damage' | 'custom' | 'initiative' | 'resistance';
  name: string;
  attributeValue?: number;
  skillValue?: number;
  diceRolled: number[];
  finalResult: number;
  successLevel: 'failure-extreme' | 'failure-normal' | 'success-normal' | 'success-good' | 'success-extreme' | null;
  modifier?: number;
  customDice?: string;
  damageType?: string;
  notes?: string;
  rollPurpose?: string;
}

interface CustomRoll {
  id: string;
  name: string;
  dice: string;
  description?: string;
  category: 'combat' | 'skill' | 'damage' | 'utility' | 'custom';
}

interface RollSettings {
  showAnimation: boolean;
  animationSpeed: 'fast' | 'normal' | 'slow';
  autoSave: boolean;
  soundEnabled: boolean;
}
```

### **Funções Utilitárias:**
- `parseDiceString()`: Analisa strings de dados (ex: "3d6+2")
- `rollCustomDice()`: Executa rolagens personalizadas
- `getDiceCount()` e `getTakeType()`: Lógica de vantagem/desvantagem
- `determineSuccess()`: Calcula níveis de sucesso

## 🚀 **Melhorias Futuras Planejadas**

### **Próximas Funcionalidades:**
- 🎵 Sistema de som completo
- 📱 Interface responsiva para mobile
- 🌐 Sincronização entre jogadores
- 📊 Estatísticas de rolagem
- 🎨 Temas visuais personalizáveis
- 🤖 Macros automatizadas
- 📋 Templates de personagem

### **Integrações:**
- 🔗 Conexão direta com fichas de personagem
- ⚔️ Sistema de combate automático
- 🎯 Calculadora de modificadores situacionais
- 📚 Integração com compêndio de regras

## 📝 **Changelog**

### **v2.0.0 - Sistema Avançado**
- ✅ Interface com abas
- ✅ Rolagens personalizadas com parser
- ✅ Sistema de dano e combate
- ✅ Histórico detalhado
- ✅ Configurações avançadas
- ✅ Rolagens salvas
- ✅ Modificadores dinâmicos
- ✅ Múltiplos tipos de dados

### **v1.0.0 - Sistema Básico**
- ✅ Rolagens de perícia/atributo
- ✅ Sistema de vantagem/desvantagem
- ✅ Tabela de sucessos
- ✅ Histórico simples

---

**Desenvolvido para o Elaria RPG** 🌟  
*"Onde cada rolagem conta uma história"* 
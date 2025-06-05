# Sistema de Salvamento - Elaria

Este documento explica o sistema de salvamento avançado implementado no jogo Elaria, que oferece funcionalidades robustas para gerenciar personagens dos jogadores.

## 🚀 Funcionalidades Principais

### 1. Auto-salvamento
- **Salvamento automático** em intervalos configuráveis (10s - 5min)
- **Detecção inteligente** de mudanças significativas
- **Configuração personalizada** por usuário
- **Backup automático** a cada salvamento

### 2. Histórico de Versões
- **Múltiplas versões** de cada personagem (3-20 versões)
- **Restauração de versões** anteriores
- **Rastreamento de mudanças** com motivos
- **Limpeza automática** de versões antigas

### 3. Backup e Recuperação
- **Backup automático** de todos os dados
- **Exportação completa** em formato JSON
- **Importação** de personagens individuais ou completos
- **Validação de dados** na importação

### 4. Interface Intuitiva
- **Indicador visual** de status de salvamento
- **Configurações acessíveis** na interface
- **Estatísticas detalhadas** do sistema
- **Notificações** de sucesso/erro

## 📋 Como Usar

### Configurando Auto-salvamento

```typescript
// Usar o hook personalizado
import { useAutoSave } from '../hooks/useAutoSave';

const MyComponent = () => {
  const autoSave = useAutoSave({
    characterId: 'meu-personagem-id',
    enabled: true,
    onSaveSuccess: (id) => console.log(`Salvo: ${id}`),
    onSaveError: (error) => console.error('Erro:', error)
  });

  // Atualizar dados para auto-save
  useEffect(() => {
    autoSave.updateData(characterData, characterState);
  }, [characterData, characterState]);

  // Salvar manualmente
  const handleSave = () => {
    autoSave.saveNow(characterData, characterState, 'Salvamento manual');
  };
};
```

### Usando o Indicador de Salvamento

```typescript
import SaveIndicator from '../components/SaveIndicator';

<SaveIndicator
  status="saving" // 'idle' | 'saving' | 'saved' | 'error' | 'auto-saving'
  lastSaved={new Date()}
  error="Erro ao conectar"
  autoSaveEnabled={true}
/>
```

### Configurações do Sistema

```typescript
import { CharacterStorage } from '../utils/characterStorage';

// Obter configuração atual
const config = CharacterStorage.getConfig();

// Atualizar configuração
CharacterStorage.updateConfig({
  enabled: true,
  interval: 30000, // 30 segundos
  maxVersions: 10
});
```

## 🔧 API do CharacterStorage

### Métodos Principais

```typescript
// Salvar personagem
CharacterStorage.saveCharacter(data, state, 'Motivo da alteração');

// Carregar personagem
const character = CharacterStorage.loadCharacter('character-id');

// Obter histórico de versões
const versions = CharacterStorage.getVersionHistory('character-id');

// Restaurar versão anterior
CharacterStorage.restoreVersion('character-id', versionIndex);

// Exportar personagem
const jsonData = CharacterStorage.exportCharacter('character-id');

// Importar personagem
const imported = CharacterStorage.importCharacter(jsonData);
```

### Auto-salvamento

```typescript
// Configurar auto-save
CharacterStorage.setupAutoSave('character-id', () => {
  return { data: characterData, state: characterState };
});

// Parar auto-save
CharacterStorage.stopAutoSave('character-id');
```

### Backup e Estatísticas

```typescript
// Exportar todos os personagens
const fullBackup = CharacterStorage.exportAllCharacters();

// Restaurar backup
CharacterStorage.restoreBackup();

// Obter estatísticas
const stats = CharacterStorage.getStats();
```

## 📊 Estruturas de Dados

### Interface SavedCharacter
```typescript
interface SavedCharacter {
  id: string;
  name: string;
  data: CharacterCreation;
  state: CharacterState;
  createdAt: Date;
  lastModified: Date;
  version: string;
}
```

### Interface CharacterVersion
```typescript
interface CharacterVersion {
  timestamp: Date;
  data: CharacterCreation;
  state: CharacterState;
  changeReason?: string;
}
```

### Interface AutoSaveConfig
```typescript
interface AutoSaveConfig {
  enabled: boolean;
  interval: number; // em millisegundos
  maxVersions: number; // máximo de versões no histórico
}
```

## 🛡️ Validação e Segurança

### Validação Automática
- **Nome obrigatório** do personagem
- **Atributos válidos** (1-20)
- **Recursos não negativos** (HP, MP, Vigor)
- **Estrutura de dados** consistente

### Backup de Segurança
- **Backup automático** a cada salvamento
- **Histórico de versões** preservado
- **Recuperação em caso de erro**
- **Validação na importação**

## 🔄 Fluxo de Salvamento

1. **Detecção de Mudança** → Sistema detecta alteração significativa
2. **Validação** → Dados são validados antes do salvamento
3. **Histórico** → Versão anterior é salva no histórico
4. **Salvamento** → Nova versão é salva no storage
5. **Backup** → Backup automático é atualizado
6. **Notificação** → Usuário é notificado do sucesso/erro

## 🎯 Boas Práticas

### Para Desenvolvedores
- Use o hook `useAutoSave` para componentes com dados de personagem
- Implemente o `SaveIndicator` em interfaces de edição
- Configure callbacks de sucesso/erro para feedback ao usuário
- Teste a restauração de versões regularmente

### Para Usuários
- Configure intervalos de auto-save adequados ao seu uso
- Faça backups regulares antes de grandes alterações
- Use o histórico de versões para desfazer mudanças
- Mantenha no máximo 10 versões para otimizar performance

## 📱 Responsividade

O sistema funciona em:
- **Desktop** - Interface completa com todas as funcionalidades
- **Tablet** - Layout adaptado para telas médias
- **Mobile** - Interface simplificada com funcionalidades essenciais

## 🐛 Solução de Problemas

### Erro de Salvamento
1. Verifique a validade dos dados
2. Confirme se há espaço no localStorage
3. Tente salvar manualmente
4. Restaure o último backup se necessário

### Performance
1. Reduza o número de versões no histórico
2. Aumente o intervalo de auto-save
3. Limpe dados antigos periodicamente

### Recuperação de Dados
1. Use a função de restaurar backup
2. Importe backup externo se disponível
3. Verifique o histórico de versões do personagem

---

## 🎮 Exemplo Completo

```typescript
import React, { useState, useEffect } from 'react';
import { useAutoSave } from '../hooks/useAutoSave';
import SaveIndicator, { SaveStatus } from '../components/SaveIndicator';
import { CharacterCreation } from '../types/character';
import { CharacterState } from '../types/interactive';

const CharacterEditor: React.FC = () => {
  const [characterData, setCharacterData] = useState<CharacterCreation>({});
  const [characterState, setCharacterState] = useState<CharacterState>({});
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const autoSave = useAutoSave({
    characterId: characterData.personalDetails?.name?.toLowerCase().replace(/\s+/g, '-'),
    enabled: true,
    onSaveSuccess: (id) => {
      setSaveStatus('saved');
      setLastSaved(new Date());
      console.log(`Personagem ${id} salvo com sucesso`);
    },
    onSaveError: (error) => {
      setSaveStatus('error');
      console.error('Erro ao salvar:', error);
    }
  });

  // Atualizar dados para auto-save sempre que mudarem
  useEffect(() => {
    autoSave.updateData(characterData, characterState);
  }, [characterData, characterState]);

  const handleManualSave = async () => {
    setSaveStatus('saving');
    try {
      await autoSave.saveNow(characterData, characterState, 'Salvamento manual');
    } catch (error) {
      // Erro já tratado pelo callback
    }
  };

  return (
    <div className="character-editor">
      {/* Seu formulário de edição aqui */}
      
      {/* Indicador de salvamento */}
      <SaveIndicator
        status={saveStatus}
        lastSaved={lastSaved}
        autoSaveEnabled={autoSave.isAutoSaveEnabled}
        className="fixed bottom-4 right-4"
      />
      
      {/* Botão de salvamento manual */}
      <button 
        onClick={handleManualSave}
        disabled={saveStatus === 'saving'}
        className="save-button"
      >
        {saveStatus === 'saving' ? 'Salvando...' : 'Salvar'}
      </button>
    </div>
  );
};

export default CharacterEditor;
```

Este sistema fornece uma base sólida e extensível para o gerenciamento de dados de personagens no Elaria, garantindo que nenhum progresso seja perdido e oferecendo aos jogadores controle total sobre seus dados. 

## Visão Geral
Sistema completo de salvamento automático e manual para personagens do RPG Elaria, incluindo versionamento, backup e configurações avançadas.

## Funcionalidades Implementadas

### 1. Classe CharacterStorage
**Arquivo**: `src/utils/characterStorage.ts`

#### Recursos principais:
- **Auto-save inteligente**: Salvamento automático em intervalos configuráveis (10s a 5min)
- **Versionamento**: Histórico de 3 a 20 versões por personagem
- **Backup automático**: Sistema de backup com restauração
- **Validação**: Validação completa dos dados do personagem
- **Detecção de mudanças**: Apenas salva quando há mudanças significativas

#### Métodos principais:
```typescript
// Salvamento
saveCharacter(character: Character): void
saveCharacterVersion(character: Character): void

// Carregamento
loadCharacter(id: string): Character | null
loadCharacters(): Character[]

// Versionamento
getCharacterVersions(characterId: string): CharacterVersion[]
restoreCharacterVersion(characterId: string, versionId: string): Character | null

// Backup
createBackup(): void
restoreFromBackup(): boolean
```

### 2. Componente SaveSettings
**Arquivo**: `src/components/CharacterSaving/SaveSettings.tsx`

Interface completa para configurar o sistema de salvamento:

#### Configurações disponíveis:
- **Auto-save**: Liga/desliga o salvamento automático
- **Intervalo**: 10s, 30s, 1min, 2min, 5min
- **Versões**: Quantidade de versões a manter (3-20)
- **Backup**: Configurações de backup automático
- **Validação**: Níveis de validação rigorosa

#### Recursos visuais:
- Interface moderna com indicadores visuais
- Validação em tempo real
- Confirmação de mudanças
- Status de salvamento

### 3. Componente SaveIndicator
**Arquivo**: `src/components/CharacterSaving/SaveIndicator.tsx`

Indicador visual do status de salvamento:

#### Estados visuais:
- **Salvando**: Spinner animado durante salvamento
- **Salvo**: Ícone de check verde após sucesso
- **Erro**: Ícone de alerta em caso de falha
- **Modificado**: Ponto laranja quando há mudanças não salvas

#### Informações exibidas:
- Última modificação
- Próximo auto-save
- Status atual
- Versão atual

### 4. Hook useAutoSave
**Arquivo**: `src/hooks/useAutoSave.ts`

Hook React para integração fácil do auto-save:

```typescript
const { 
  autoSaveStatus, 
  lastSaved, 
  nextAutoSave,
  isModified,
  saveNow 
} = useAutoSave(character);
```

#### Recursos:
- Integração automática com localStorage
- Detecção inteligente de mudanças
- Configuração reativa
- Status em tempo real

### 5. Integração com CharacterList
**Arquivo**: `src/pages/CharacterList.tsx`

#### Melhorias implementadas:
- Botão de configurações de salvamento
- Indicadores visuais de status
- Acesso direto às configurações
- Feedback visual de ações

## Configurações Técnicas

### Storage Keys
```typescript
const STORAGE_KEY = 'elaria-characters';
const HISTORY_KEY = 'elaria-character-history';
const BACKUP_KEY = 'elaria-characters-backup';
const CONFIG_KEY = 'elaria-save-config';
```

### Configuração Padrão
```typescript
{
  autoSave: true,
  autoSaveInterval: 30000, // 30 segundos
  maxVersions: 10,
  enableValidation: true,
  autoBackup: true
}
```

### Validação de Dados
O sistema valida:
- Estrutura básica do personagem
- Valores de atributos (-1 a 20) ✅ **Corrigido conforme regras do livro**
- Faixas de HP, MP e Vigor
- Referências de equipamentos

## Uso nos Componentes

### Salvamento Manual
```typescript
import { CharacterStorage } from '../utils/characterStorage';

const storage = new CharacterStorage();
storage.saveCharacter(character);
```

### Componente com Auto-save
```typescript
import { useAutoSave } from '../hooks/useAutoSave';
import SaveIndicator from '../components/CharacterSaving/SaveIndicator';

function CharacterEditor({ character }) {
  const autoSave = useAutoSave(character);
  
  return (
    <div>
      <SaveIndicator {...autoSave} />
      {/* Resto do componente */}
    </div>
  );
}
```

### Configurações
```typescript
import SaveSettings from '../components/CharacterSaving/SaveSettings';

<SaveSettings 
  isOpen={showSettings}
  onClose={() => setShowSettings(false)}
/>
```

## Sistema de Loja Simplificado

### Mudanças Implementadas (Baseadas no livro `livro.md`)

#### ✅ **Simplificações Realizadas:**

1. **Remoção de Raridades Complexas**
   - Antes: 5 níveis de raridade (comum, incomum, raro, épico, lendário)
   - Agora: Apenas "comum" conforme o livro

2. **Categorias Reduzidas**
   - Antes: 6 categorias (armas, armaduras, itens, consumíveis, ferramentas, diversos)
   - Agora: 3 categorias básicas (armas, armaduras, itens)

3. **Preços Conforme o Livro**
   - Todos os preços agora seguem exatamente a tabela do `livro.md`
   - Armas simples: 5 Ef
   - Armas marciais: 5-10 Ef
   - Armaduras: 5-85 Ef conforme tipo
   - Itens básicos: preços realistas

4. **Interface Simplificada**
   - Removido: Sistema de carrinho
   - Removido: Filtros complexos de raridade e preço
   - Removido: Aba de histórico de transações
   - Mantido: Busca simples e filtro por categoria
   - Mantido: Inventário básico com venda

5. **Mecânica de Compra Direta**
   - Compra instantânea com um clique
   - Venda por 70% do valor de compra
   - Verificação simples de fundos

#### **Equipamentos Disponíveis:**

**Armas Simples (5 Ef):**
- Adaga, Maça Leve, Lança Curta, Besta Leve

**Armas Marciais:**
- Espada Curta, Machado de Mão (5 Ef)
- Espada Longa, Machado Grande, Arco Longo (10 Ef)

**Armaduras:**
- Leves (5 Ef): Couro, Couro Batido, Gibão de Peles
- Médias (50 Ef): Cota de Malha, Brunea  
- Pesadas (85 Ef): Armadura Completa

**Itens Básicos:**
- Corda (3 Ef), Tocha (2 EfP), Ração (5 EfP)
- Kit de Cura (50 Ef), Mochila (3 Ef), Cantil (1 Ef), Pederneira (5 EfP)

### **Coesão com o Sistema:**
- Moeda: Elfen (Ef) e Elfen Prata (EfP) - 1 Ef = 10 EfP
- Equipamento inicial: 4d6 Elfens para compras
- Simplicidade: Foco na narrativa, não na complexidade de inventário

## Benefícios do Sistema

### Para o Usuário
- **Tranquilidade**: Nunca perde progresso do personagem
- **Flexibilidade**: Pode voltar a versões anteriores
- **Controle**: Configurações personalizáveis
- **Feedback**: Status visual constante

### Para o Desenvolvimento
- **Modular**: Componentes independentes e reutilizáveis
- **Configurável**: Fácil de ajustar comportamentos
- **Robusto**: Tratamento de erros e validação
- **Performático**: Salvamento inteligente apenas quando necessário

## Status: ✅ Completo e Funcional

O sistema está totalmente implementado e testado, proporcionando uma experiência de salvamento robusta e amigável para o usuário, com interface intuitiva e funcionalidades avançadas. A loja foi simplificada conforme solicitado para manter coesão com as regras do livro Elaria. 
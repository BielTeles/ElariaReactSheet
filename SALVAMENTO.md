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
# 🏗️ Arquitetura Modular - Maven Dependencies Checker

## 📋 Visão Geral

Este projeto usa uma arquitetura modular com Alpine.js. Cada componente tem responsabilidade única e comunicação via eventos customizados.

## 🗂️ Estrutura do Projeto

```
maven-dependencies-checker/
├── index.html                    # Arquivo principal (apenas HTML)
├── js/
│   ├── utils/                    # Utilitários reutilizáveis
│   │   ├── notification.js       # Sistema de notificações
│   │   ├── version-utils.js      # Comparação de versões
│   │   └── storage.js           # Gerenciamento localStorage
│   └── components/               # Componentes Alpine.js
│       ├── header.js             # Cabeçalho
│       ├── search.js             # Busca de dependências
│       ├── disclaimer.js         # Disclaimer
│       ├── results.js            # Exibição de resultados
│       ├── comparator.js         # Comparação de JSONs
│       ├── filter.js             # Gerenciamento de filtros
│       ├── comparison-results.js # Resultados da comparação
│       ├── results-tables.js     # Tabelas de resultados
│       ├── footer.js             # Rodapé
│       └── app.js               # Componente principal (coordenação)
```

## 🧩 Padrões de Componente

### Estrutura de Componente Alpine.js
```javascript
window.componentName = function() {
    return {
        // 1. Estado (dados reativos)
        data: '',
        loading: false,
        
        // 2. Computed properties
        get computedValue() {
            return this.data.toUpperCase();
        },
        
        // 3. Métodos
        init() {
            // Inicialização do componente
            console.log('Component initialized');
        },
        
        handleAction() {
            // Lógica do componente
            NotificationUtils.success('Action completed!');
        }
    };
};
```

### Estrutura de Utilitário
```javascript
window.UtilityName = {
    /**
     * Descrição da função
     * @param {string} param - Descrição do parâmetro
     * @returns {string} - Descrição do retorno
     */
    functionName(param) {
        // Implementação
        return result;
    }
};
```

## 🔄 Comunicação Entre Componentes

### Eventos Customizados
```javascript
// Emitir evento
this.$dispatch('event-name', { data: 'value' });

// Escutar evento (no app.js)
handleEventName(event) {
    const { data } = event.detail;
    // Processar dados
}
```

### Utilitários Compartilhados
```javascript
// Sempre use utilitários existentes
NotificationUtils.success('Sucesso!');
NotificationUtils.error('Erro!');
NotificationUtils.info('Informação!');

VersionUtils.compareVersions('1.2.3', '1.2.4');
VersionUtils.getVersionChangeType('1.2.3', '1.2.4');

StorageUtils.addRecentSearch(url, displayName);
StorageUtils.getRecentSearches();
```

## 📝 Convenções de Nomenclatura

### Componentes
- **Nome**: camelCase + Component
- **Exemplo**: `searchComponent`, `comparatorComponent`
- **Arquivo**: camelCase.js
- **Exemplo**: `search.js`, `comparator.js`

### Utilitários
- **Nome**: PascalCase + Utils
- **Exemplo**: `NotificationUtils`, `VersionUtils`
- **Arquivo**: kebab-case.js
- **Exemplo**: `notification.js`, `version-utils.js`

### Funções e Variáveis
- **Funções**: camelCase
- **Variáveis**: camelCase
- **Constantes**: UPPER_SNAKE_CASE
- **Eventos**: kebab-case

## 🎯 Responsabilidades por Componente

### searchComponent
- **Responsabilidade**: Busca e extração de dependências
- **Estado**: `mavenUrl`, `loading`, `results`, `jsonOutput`, `recentSearches`
- **Métodos**: `fetchDependencies()`, `clearResults()`, `loadRecentSearch()`

### comparatorComponent
- **Responsabilidade**: Comparação de JSONs
- **Estado**: `jsonOld`, `jsonNew`, `depsOld`, `depsNew`
- **Métodos**: `compareJsons()`, `swapJsons()`

### filterComponent
- **Responsabilidade**: Gerenciamento de filtros
- **Estado**: `filters` (objeto com todas as configurações)
- **Métodos**: `selectAllFilters()`, `deselectAllFilters()`, `selectOnlyChanges()`

### comparisonResultsComponent
- **Responsabilidade**: Exibição de resultados filtrados
- **Computed**: `activeFilters`, `filteredResults`, `hasVisibleChanges`
- **Métodos**: `getVersionChangeType()`, `getVersionBadgeClass()`

## 🔧 Boas Práticas

### ✅ Faça
- Use utilitários existentes em vez de reimplementar
- Mantenha responsabilidade única em cada componente
- Documente funções com JSDoc
- Use eventos customizados para comunicação
- Teste componentes isoladamente

### ❌ Não Faça
- Não misture responsabilidades em um componente
- Não duplique código - use utilitários
- Não acesse diretamente outros componentes
- Não ignore a estrutura de pastas
- Não quebre a compatibilidade com GitHub Pages

## 🚀 Adicionando Novos Recursos

### 1. Novo Componente
```javascript
// js/components/new-feature.js
window.newFeatureComponent = function() {
    return {
        data: '',
        
        init() {
            console.log('New feature initialized');
        },
        
        processData() {
            // Lógica do componente
            NotificationUtils.success('Data processed!');
        }
    };
};
```

### 2. Novo Utilitário
```javascript
// js/utils/new-utility.js
window.NewUtility = {
    /**
     * Processa dados
     * @param {string} data - Dados para processar
     * @returns {string} - Dados processados
     */
    processData(data) {
        return data.trim().toUpperCase();
    }
};
```

### 3. Adicionar ao HTML
```html
<!-- Adicionar script -->
<script src="js/components/new-feature.js"></script>

<!-- Usar no HTML -->
<div x-data="newFeatureComponent()" x-init="init()">
    <input x-model="data" placeholder="Enter data...">
    <button @click="processData()">Process</button>
</div>
```

## 🐛 Debugging

### Identificar Componente Responsável
1. **Busca**: Problemas de busca → `search.js`
2. **Comparação**: Problemas de comparação → `comparator.js`
3. **Filtros**: Problemas de filtros → `filter.js`
4. **Notificações**: Problemas de UI → `notification.js`

### Debugging de Eventos
```javascript
// Adicione logs para debug
this.$dispatch('debug-event', { data: 'debug info' });

// No app.js
handleDebugEvent(event) {
    console.log('Debug event:', event.detail);
}
```

## 📚 Documentação

### JSDoc para Funções
```javascript
/**
 * Descrição da função
 * @param {string} param1 - Descrição do primeiro parâmetro
 * @param {number} param2 - Descrição do segundo parâmetro
 * @returns {boolean} - Descrição do retorno
 * @example
 * const result = functionName('test', 123);
 */
function functionName(param1, param2) {
    // Implementação
}
```

### JSDoc para Componentes
```javascript
/**
 * Componente de exemplo
 * @description Responsável por processar dados
 * @example
 * <div x-data="exampleComponent()">
 *   <input x-model="data">
 * </div>
 */
window.exampleComponent = function() {
    return {
        // Implementação
    };
};
```

## 🔄 Refatoração

### Quando Refatorar
- Componente com mais de 100 linhas
- Função com mais de 20 linhas
- Código duplicado em múltiplos lugares
- Responsabilidades misturadas

### Como Refatorar
1. **Identifique** a responsabilidade principal
2. **Extraia** utilitários reutilizáveis
3. **Separe** em componentes menores
4. **Teste** cada parte isoladamente
5. **Documente** as mudanças

## 🎯 Checklist para Mudanças

### ✅ Antes de Commitar
- [ ] Código segue padrões de nomenclatura
- [ ] Usa utilitários existentes
- [ ] Documentação JSDoc atualizada
- [ ] Testado localmente
- [ ] Compatível com GitHub Pages
- [ ] Não quebra funcionalidades existentes

### ✅ Para Novos Recursos
- [ ] Criado componente específico
- [ ] Adicionado script no index.html
- [ ] Usado x-data no HTML
- [ ] Implementado comunicação via eventos
- [ ] Documentado no README

---

**Mantenha a arquitetura modular e o código organizado! 🏗️** 
# 📖 Exemplo de Uso - Arquitetura Modular

## 🎯 Como a Nova Arquitetura Funciona

### 1. **Estrutura Modular**

A aplicação agora está organizada em módulos reutilizáveis:

```javascript
// Antes: 916 linhas em um único arquivo
function mavenDependencies() {
    return {
        // 900+ linhas de código misturado
    }
}

// Agora: Módulos organizados
// js/utils/notification.js
window.NotificationUtils = {
    show(message, type) { /* ... */ },
    success(message) { /* ... */ },
    error(message) { /* ... */ }
};

// js/components/search.js
window.searchComponent = function() {
    return {
        mavenUrl: '',
        loading: false,
        async fetchDependencies() { /* ... */ }
    };
};
```

### 2. **Comunicação Entre Componentes**

#### Eventos Customizados
```javascript
// Componente emite evento
this.$dispatch('comparison-completed', { 
    added, 
    removed, 
    changed 
});

// App principal escuta evento
handleComparisonCompleted(event) {
    const { added, removed, changed } = event.detail;
    this.comparisonResults = { added, removed, changed };
}
```

#### Utilitários Compartilhados
```javascript
// Qualquer componente pode usar
NotificationUtils.success('Operação realizada com sucesso!');
VersionUtils.compareVersions('1.2.3', '1.2.4');
StorageUtils.addRecentSearch(url, displayName);
```

### 3. **Exemplo de Adição de Novo Componente**

#### Passo 1: Criar Componente
```javascript
// js/components/new-feature.js
window.newFeatureComponent = function() {
    return {
        data: '',
        
        init() {
            console.log('Novo componente inicializado');
        },
        
        processData() {
            // Lógica do componente
            NotificationUtils.success('Dados processados!');
        }
    };
};
```

#### Passo 2: Adicionar ao HTML
```html
<!-- Adicionar script -->
<script src="js/components/new-feature.js"></script>

<!-- Usar no HTML -->
<div x-data="newFeatureComponent()" x-init="init()">
    <input x-model="data" placeholder="Digite algo...">
    <button @click="processData()">Processar</button>
</div>
```

### 4. **Exemplo de Adição de Novo Utilitário**

#### Passo 1: Criar Utilitário
```javascript
// js/utils/validation.js
window.ValidationUtils = {
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },
    
    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    },
    
    sanitizeInput(input) {
        return input.trim().replace(/[<>]/g, '');
    }
};
```

#### Passo 2: Usar nos Componentes
```javascript
// Em qualquer componente
if (!ValidationUtils.isValidUrl(this.mavenUrl)) {
    NotificationUtils.error('URL inválida!');
    return;
}
```

## 🔄 Migração do Código Antigo

### Antes (Monolítico)
```javascript
function mavenDependencies() {
    return {
        // 900+ linhas misturadas
        mavenUrl: '',
        loading: false,
        results: null,
        jsonOutput: '',
        jsonOld: '',
        jsonNew: '',
        comparisonResults: false,
        results: { added: [], removed: [], changed: [] },
        filters: { /* ... */ },
        recentSearches: [],
        
        // Métodos misturados
        isValidUrl(url) { /* ... */ },
        async fetchDependencies() { /* ... */ },
        compareJsons() { /* ... */ },
        compareVersions() { /* ... */ },
        showNotification() { /* ... */ },
        addRecentSearch() { /* ... */ },
        // ... mais 50+ métodos
    }
}
```

### Depois (Modular)
```javascript
// js/utils/notification.js
window.NotificationUtils = { /* ... */ };

// js/utils/version-utils.js  
window.VersionUtils = { /* ... */ };

// js/utils/storage.js
window.StorageUtils = { /* ... */ };

// js/components/search.js
window.searchComponent = function() {
    return {
        mavenUrl: '',
        loading: false,
        async fetchDependencies() { /* ... */ }
    };
};

// js/components/comparator.js
window.comparatorComponent = function() {
    return {
        jsonOld: '',
        jsonNew: '',
        compareJsons() { /* ... */ }
    };
};
```

## 🎨 Benefícios Práticos

### 1. **Manutenibilidade**
```javascript
// Antes: Encontrar um bug em 900+ linhas
// Agora: Ir direto ao componente responsável
// js/components/search.js - linha 45
async fetchDependencies() {
    // Lógica específica de busca
}
```

### 2. **Reutilização**
```javascript
// Utilitário usado em múltiplos lugares
NotificationUtils.success('Sucesso!'); // Em search.js
NotificationUtils.error('Erro!');      // Em comparator.js
NotificationUtils.info('Info!');       // Em filter.js
```

### 3. **Testabilidade**
```javascript
// Testar componente isolado
const searchComponent = searchComponent();
searchComponent.mavenUrl = 'https://mvnrepository.com/...';
await searchComponent.fetchDependencies();
// Verificar resultados
```

### 4. **Extensibilidade**
```javascript
// Adicionar nova funcionalidade sem afetar existente
// js/components/export.js
window.exportComponent = function() {
    return {
        exportToCSV() { /* ... */ },
        exportToExcel() { /* ... */ }
    };
};
```

## 🚀 Padrões de Desenvolvimento

### 1. **Nomenclatura**
```javascript
// Utilitários: PascalCase + Utils
window.NotificationUtils = { /* ... */ };
window.VersionUtils = { /* ... */ };

// Componentes: camelCase + Component
window.searchComponent = function() { /* ... */ };
window.comparatorComponent = function() { /* ... */ };
```

### 2. **Estrutura de Componente**
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
            // Inicialização
        },
        
        handleAction() {
            // Lógica do componente
        }
    };
};
```

### 3. **Comunicação**
```javascript
// Emitir evento
this.$dispatch('event-name', { data: 'value' });

// Escutar evento
this.$watch('property', (value) => {
    // Reagir a mudanças
});
```

## 📋 Checklist para Novos Desenvolvedores

### ✅ Entendimento Básico
- [ ] Conhecer estrutura de pastas (`js/utils/`, `js/components/`)
- [ ] Entender padrão de nomenclatura
- [ ] Saber usar utilitários compartilhados
- [ ] Compreender comunicação entre componentes

### ✅ Desenvolvimento
- [ ] Criar componente em `js/components/`
- [ ] Adicionar script no `index.html`
- [ ] Usar `x-data="componentName()"` no HTML
- [ ] Testar isoladamente

### ✅ Boas Práticas
- [ ] Documentar com JSDoc
- [ ] Usar utilitários existentes
- [ ] Manter responsabilidade única
- [ ] Emitir eventos para comunicação

### ✅ Manutenção
- [ ] Identificar componente responsável
- [ ] Usar debugger para rastrear
- [ ] Verificar dependências
- [ ] Testar após mudanças

---

**A nova arquitetura torna o código mais organizado, manutenível e escalável! 🎉** 
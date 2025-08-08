# 🏗️ Arquitetura Modular - Maven Dependencies Checker

## 📋 Visão Geral

O projeto foi refatorado para uma arquitetura modular usando **Alpine.js** com componentes organizados, mantendo a funcionalidade estática para GitHub Pages.

## 🗂️ Estrutura de Arquivos

```
maven-dependencies-checker/
├── index.html                    # Arquivo principal da aplicação
├── js/
│   ├── utils/                    # Utilitários reutilizáveis
│   │   ├── notification.js       # Sistema de notificações
│   │   ├── version-utils.js      # Utilitários de comparação de versões
│   │   └── storage.js           # Gerenciamento de localStorage
│   └── components/               # Componentes Alpine.js
│       ├── header.js             # Componente do cabeçalho
│       ├── search.js             # Componente de busca
│       ├── disclaimer.js         # Componente de disclaimer
│       ├── results.js            # Componente de resultados
│       ├── comparator.js         # Componente do comparador
│       ├── filter.js             # Componente de filtros
│       ├── comparison-results.js # Componente de resultados da comparação
│       ├── results-tables.js     # Componente das tabelas
│       ├── footer.js             # Componente do rodapé
│       └── app.js               # Componente principal (coordenação)
├── README.md                     # Documentação principal
├── ARCHITECTURE.md              # Esta documentação
└── LICENSE                      # Licença do projeto
```

## 🧩 Componentes

### 📦 Utilitários (`js/utils/`)

#### `notification.js`
- **Responsabilidade**: Sistema de notificações toast
- **Métodos**:
  - `show(message, type)` - Exibe notificação
  - `success(message)` - Notificação de sucesso
  - `error(message)` - Notificação de erro
  - `info(message)` - Notificação informativa

#### `version-utils.js`
- **Responsabilidade**: Comparação e análise de versões
- **Métodos**:
  - `compareVersions(version1, version2)` - Compara duas versões
  - `getVersionChangeType(version1, version2)` - Tipo de mudança
  - `getVersionBadgeClass(version1, version2)` - Classes CSS para badge
  - `getVersionIcon(version1, version2)` - Ícone da comparação

#### `storage.js`
- **Responsabilidade**: Gerenciamento de localStorage
- **Métodos**:
  - `getRecentSearches()` - Busca pesquisas recentes
  - `saveRecentSearches(searches)` - Salva pesquisas
  - `addRecentSearch(url, displayName)` - Adiciona pesquisa
  - `removeRecentSearch(index)` - Remove pesquisa
  - `clearRecentSearches()` - Limpa todas as pesquisas
  - `getDisplayName(url)` - Extrai nome de exibição da URL

### 🎯 Componentes (`js/components/`)

#### `app.js` - Componente Principal
- **Responsabilidade**: Coordenação global e comunicação entre componentes
- **Estado Global**:
  - `searchResults` - Resultados da busca
  - `comparisonResults` - Resultados da comparação
  - `filters` - Filtros globais
- **Eventos**:
  - `handleCopyToField()` - Copia JSON para campos
  - `handleComparisonCompleted()` - Processa resultados da comparação
  - `handleClearComparison()` - Limpa resultados

#### `search.js` - Componente de Busca
- **Responsabilidade**: Busca e extração de dependências
- **Estado**:
  - `mavenUrl` - URL do Maven
  - `loading` - Estado de carregamento
  - `results` - Resultados da busca
  - `jsonOutput` - JSON gerado
  - `recentSearches` - Pesquisas recentes
- **Métodos**:
  - `fetchDependencies()` - Busca dependências
  - `clearResults()` - Limpa resultados
  - `loadRecentSearch(url)` - Carrega pesquisa recente

#### `comparator.js` - Componente do Comparador
- **Responsabilidade**: Comparação de JSONs
- **Estado**:
  - `jsonOld` - JSON antigo
  - `jsonNew` - JSON novo
  - `depsOld` - Dependências antigas
  - `depsNew` - Dependências novas
- **Métodos**:
  - `compareJsons()` - Compara os JSONs
  - `swapJsons()` - Troca os JSONs

#### `filter.js` - Componente de Filtros
- **Responsabilidade**: Gerenciamento de filtros
- **Estado**:
  - `filters` - Configuração dos filtros
- **Métodos**:
  - `selectAllFilters()` - Seleciona todos os filtros
  - `deselectAllFilters()` - Deseleciona todos os filtros
  - `selectOnlyChanges()` - Seleciona apenas mudanças

#### `comparison-results.js` - Resultados da Comparação
- **Responsabilidade**: Exibição dos resultados filtrados
- **Computed Properties**:
  - `activeFilters` - Filtros ativos
  - `filteredResults` - Resultados filtrados
  - `hasVisibleChanges` - Se há mudanças visíveis
- **Métodos**:
  - `getVersionChangeType()` - Tipo de mudança de versão
  - `getVersionBadgeClass()` - Classes do badge

## 🔄 Comunicação Entre Componentes

### Eventos Customizados
- `copy-to-field` - Copia JSON para campos
- `comparison-completed` - Resultados da comparação
- `clear-comparison` - Limpa comparação
- `update-results` - Atualiza resultados
- `update-comparison-results` - Atualiza resultados da comparação

### Padrão de Comunicação
1. **Componente → App**: Eventos customizados
2. **App → Componente**: Atualização de estado global
3. **Componente ↔ Componente**: Via App (mediator pattern)

## 🎨 Benefícios da Nova Arquitetura

### ✅ Organização
- **Separação de responsabilidades**: Cada componente tem uma função específica
- **Código modular**: Fácil manutenção e extensão
- **Reutilização**: Utilitários podem ser usados em múltiplos componentes

### ✅ Manutenibilidade
- **Arquivos menores**: Cada arquivo tem uma responsabilidade clara
- **Documentação**: Cada módulo tem documentação JSDoc
- **Testabilidade**: Componentes isolados são mais fáceis de testar

### ✅ Escalabilidade
- **Novos componentes**: Fácil adição de novos componentes
- **Funcionalidades**: Extensão sem afetar outros componentes
- **Performance**: Carregamento modular de JavaScript

### ✅ Estática
- **GitHub Pages**: Mantém compatibilidade total
- **Sem build**: Não requer processo de build
- **CDN**: Usa CDNs para dependências

## 🚀 Como Usar

### Desenvolvimento Local
1. Clone o repositório
2. Abra `index.html` no navegador
3. Não requer servidor local

### Adicionando Novos Componentes
1. Crie arquivo em `js/components/`
2. Defina função `window.componentName`
3. Adicione script no `index.html`
4. Use `x-data="componentName()"` no HTML

### Adicionando Novos Utilitários
1. Crie arquivo em `js/utils/`
2. Defina objeto `window.UtilityName`
3. Adicione script no `index.html`
4. Use `UtilityName.method()` nos componentes

## 🔧 Configuração

### Dependências Externas
- **Alpine.js**: Framework JavaScript reativo
- **Tailwind CSS**: Framework CSS utilitário
- **Font Awesome**: Ícones

### Estrutura de Carregamento
```html
<!-- Utilitários primeiro -->
<script src="js/utils/notification.js"></script>
<script src="js/utils/version-utils.js"></script>
<script src="js/utils/storage.js"></script>

<!-- Componentes depois -->
<script src="js/components/header.js"></script>
<script src="js/components/search.js"></script>
<!-- ... outros componentes ... -->

<!-- App principal por último -->
<script src="js/app.js"></script>
```

## 📈 Melhorias Futuras

### Possíveis Extensões
- **Testes unitários**: Para cada componente
- **Lazy loading**: Carregamento sob demanda
- **Service Workers**: Cache offline
- **PWA**: Progressive Web App
- **TypeScript**: Tipagem estática
- **Bundler**: Webpack/Vite para produção

### Otimizações
- **Minificação**: Para produção
- **Compressão**: Gzip/Brotli
- **Cache**: Headers de cache
- **CDN**: Distribuição global

---

**Desenvolvido com ❤️ usando Alpine.js e arquitetura modular** 
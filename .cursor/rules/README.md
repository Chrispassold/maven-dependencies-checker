# 🏗️ Regras do Cursor - Maven Dependencies Checker

## 📋 Visão Geral

Esta pasta contém as regras do Cursor para facilitar o desenvolvimento e manutenção do projeto Maven Dependencies Checker. As regras seguem o formato MDC (Markdown + Code) e são organizadas por responsabilidade.

## 📁 Estrutura das Regras

```
.cursor/rules/
├── README.md                    # Este arquivo
├── architecture.md              # Arquitetura modular e padrões
├── coding-standards.md          # Padrões de código e convenções
├── debugging.md                 # Debugging e troubleshooting
├── development-workflow.md      # Workflow de desenvolvimento
└── quick-reference.md          # Referência rápida
```

## 🎯 Como Usar as Regras

### 1. **architecture.md** - Arquitetura Modular
- **Quando usar**: Ao criar novos componentes ou modificar estrutura
- **Conteúdo**: Padrões de componente, comunicação, responsabilidades
- **Exemplo**: "Como criar um novo componente seguindo a arquitetura"

### 2. **coding-standards.md** - Padrões de Código
- **Quando usar**: Ao escrever código novo ou refatorar
- **Conteúdo**: Convenções de nomenclatura, formatação, JSDoc
- **Exemplo**: "Como nomear variáveis e funções corretamente"

### 3. **debugging.md** - Debugging e Troubleshooting
- **Quando usar**: Ao encontrar bugs ou problemas
- **Conteúdo**: Mapeamento de problemas, logs, ferramentas de debug
- **Exemplo**: "Como debugar problemas de busca de dependências"

### 4. **development-workflow.md** - Workflow de Desenvolvimento
- **Quando usar**: Ao iniciar novo desenvolvimento
- **Conteúdo**: Processo de desenvolvimento, cenários, deploy
- **Exemplo**: "Como adicionar nova funcionalidade seguindo o workflow"

### 5. **quick-reference.md** - Referência Rápida
- **Quando usar**: Para consulta rápida durante desenvolvimento
- **Conteúdo**: Comandos, padrões, utilitários, checklist
- **Exemplo**: "Como criar novo componente rapidamente"

## 🚀 Benefícios das Regras

### ✅ **Consistência**
- Todos os desenvolvedores seguem os mesmos padrões
- Código mais legível e manutenível
- Arquitetura consistente

### ✅ **Produtividade**
- Referência rápida para tarefas comuns
- Templates prontos para uso
- Workflow otimizado

### ✅ **Qualidade**
- Padrões de código estabelecidos
- Documentação integrada
- Debugging estruturado

### ✅ **Onboarding**
- Novos desenvolvedores se adaptam rapidamente
- Documentação clara e organizada
- Exemplos práticos

## 🔧 Como Aplicar as Regras

### 1. **Durante o Desenvolvimento**
```bash
# Ao criar novo componente
# 1. Consultar architecture.md para estrutura
# 2. Usar coding-standards.md para padrões
# 3. Seguir development-workflow.md para processo
```

### 2. **Ao Encontrar Problemas**
```bash
# Ao debugar
# 1. Consultar debugging.md para mapeamento
# 2. Usar quick-reference.md para comandos
# 3. Aplicar soluções documentadas
```

### 3. **Ao Refatorar**
```bash
# Ao refatorar código
# 1. Verificar architecture.md para responsabilidades
# 2. Seguir coding-standards.md para padrões
# 3. Usar development-workflow.md para processo
```

## 📝 Exemplos de Uso

### Exemplo 1: Criar Novo Componente
```bash
# 1. Consultar architecture.md
# - Estrutura de componente Alpine.js
# - Padrões de nomenclatura
# - Responsabilidades

# 2. Usar template
cp templates/component-template.js js/components/new-component.js

# 3. Seguir coding-standards.md
# - Documentação JSDoc
# - Convenções de nomenclatura
# - Formatação

# 4. Adicionar ao HTML
# - Script tag
# - x-data usage
```

### Exemplo 2: Debuggar Problema
```bash
# 1. Identificar componente responsável
# - Usar mapeamento em debugging.md
# - Adicionar logs apropriados

# 2. Usar ferramentas de debug
# - Console logs estruturados
# - Network tab
# - Application tab

# 3. Aplicar solução
# - Seguir padrões estabelecidos
# - Documentar mudanças
```

### Exemplo 3: Adicionar Nova Funcionalidade
```bash
# 1. Seguir development-workflow.md
# - Análise do problema
# - Planejamento
# - Implementação
# - Teste
# - Documentação

# 2. Usar quick-reference.md
# - Comandos rápidos
# - Checklist
# - Padrões de commit
```

## 🎯 Integração com Cursor

### Configuração
As regras são automaticamente carregadas pelo Cursor quando você trabalha no projeto. O Cursor usa estas regras para:

- **Sugestões de código**: Baseadas nos padrões estabelecidos
- **Autocompletar**: Seguindo convenções de nomenclatura
- **Refatoração**: Aplicando padrões de arquitetura
- **Debugging**: Usando mapeamento de problemas

### Comandos Úteis
```bash
# No Cursor, você pode usar:
# - Ctrl+Shift+P: Comandos do Cursor
# - Ctrl+Space: Autocompletar baseado nas regras
# - F1: Ajuda contextual
```

## 📚 Manutenção das Regras

### Atualização
- Mantenha as regras atualizadas com mudanças no projeto
- Adicione novos padrões conforme necessário
- Documente soluções para problemas comuns

### Feedback
- Use as regras como base para melhorias
- Identifique gaps na documentação
- Sugira novas regras quando necessário

## 🔄 Fluxo de Trabalho com Regras

### 1. **Início de Desenvolvimento**
```bash
# 1. Consultar development-workflow.md
# 2. Seguir processo estabelecido
# 3. Usar templates quando apropriado
```

### 2. **Durante o Desenvolvimento**
```bash
# 1. Seguir coding-standards.md
# 2. Usar architecture.md para estrutura
# 3. Consultar quick-reference.md para comandos
```

### 3. **Debugging**
```bash
# 1. Usar debugging.md para mapeamento
# 2. Aplicar ferramentas de debug
# 3. Seguir processo de resolução
```

### 4. **Finalização**
```bash
# 1. Seguir checklist em quick-reference.md
# 2. Usar development-workflow.md para commit
# 3. Documentar mudanças se necessário
```

---

**Use estas regras para desenvolvimento consistente e eficiente! 🚀**

*As regras são atualizadas conforme o projeto evolui. Mantenha-as sempre atualizadas.* 
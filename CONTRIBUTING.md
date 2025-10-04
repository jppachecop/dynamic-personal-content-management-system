# 🤝 Guia de Contribuição

Obrigado por considerar contribuir para o SGCPD! Este documento fornece diretrizes para contribuições efetivas.

## 📋 Índice

- [Código de Conduta](#código-de-conduta)
- [Como Posso Contribuir?](#como-posso-contribuir)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Processo de Desenvolvimento](#processo-de-desenvolvimento)
- [Guidelines de Código](#guidelines-de-código)
- [Processo de Pull Request](#processo-de-pull-request)

## 📜 Código de Conduta

Este projeto segue o [Contributor Covenant](https://www.contributor-covenant.org/). Ao participar, você concorda em manter este código.

## 🎯 Como Posso Contribuir?

### 🐛 Reportando Bugs

Antes de criar um bug report:

- Verifique se o bug já foi reportado
- Verifique se você está usando a versão mais recente
- Colete informações sobre o ambiente

**Template para Bug Report:**

```markdown
**Descrição do Bug**
Uma descrição clara e concisa do bug.

**Passos para Reproduzir**

1. Vá para '...'
2. Clique em '....'
3. Role para baixo até '....'
4. Veja o erro

**Comportamento Esperado**
Uma descrição clara do que você esperava que acontecesse.

**Screenshots**
Se aplicável, adicione screenshots para ajudar a explicar o problema.

**Ambiente:**

- OS: [ex. Windows 10]
- Browser: [ex. Chrome 95.0]
- Node.js: [ex. 18.17.0]
```

### 💡 Sugerindo Melhorias

**Template para Sugestão de Feature:**

```markdown
**A sua solicitação de feature está relacionada a um problema?**
Uma descrição clara e concisa do problema. Ex: Estou sempre frustrado quando [...]

**Descreva a solução que você gostaria**
Uma descrição clara e concisa do que você quer que aconteça.

**Descreva alternativas que você considerou**
Uma descrição clara e concisa de qualquer solução ou feature alternativa que você considerou.

**Contexto adicional**
Adicione qualquer outro contexto ou screenshots sobre a solicitação de feature aqui.
```

### 🔧 Contribuindo com Código

1. **Fork** o repositório
2. **Clone** seu fork
3. **Crie** uma branch para sua feature
4. **Implemente** suas mudanças
5. **Teste** suas mudanças
6. **Commit** com mensagens descritivas
7. **Push** para sua branch
8. **Abra** um Pull Request

## ⚙️ Configuração do Ambiente

### Pré-requisitos

```bash
# Node.js 18+
node --version

# npm ou yarn
npm --version
```

### Setup Local

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/dynamic-personal-content-management-system.git
cd dynamic-personal-content-management-system

# Instale dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev

# Execute linting
npm run lint
```

## 🛠️ Processo de Desenvolvimento

### 1. Branching Strategy

```bash
# Para novas features
git checkout -b feature/nome-da-feature

# Para correções de bug
git checkout -b fix/nome-do-bug

# Para documentação
git checkout -b docs/nome-da-doc

# Para refatoração
git checkout -b refactor/nome-da-refatoracao
```

### 2. Estrutura de Commits

Use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Features
git commit -m "feat: adiciona busca avançada de notas"

# Bug fixes
git commit -m "fix: corrige erro de salvamento automático"

# Documentação
git commit -m "docs: atualiza README com instruções de deploy"

# Estilo/formatação
git commit -m "style: aplica formatação consistente nos componentes"

# Refatoração
git commit -m "refactor: melhora estrutura do hook useIndexedDB"

# Testes
git commit -m "test: adiciona testes para componente NoteEditor"

# Tarefas de build/CI
git commit -m "chore: atualiza dependências do projeto"
```

## 📏 Guidelines de Código

### TypeScript

```typescript
// ✅ BOM: Tipos explícitos e interfaces bem definidas
interface Note {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
}

const createNote = (
  data: Omit<Note, "id" | "createdAt" | "updatedAt">,
): Note => {
  return {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

// ❌ RUIM: Uso de any
const createNote = (data: any): any => {
  // ...
}
```

### React Components

```tsx
// ✅ BOM: Componente funcional com TypeScript
interface ButtonProps {
  variant?: "primary" | "secondary"
  size?: "sm" | "md" | "lg"
  onClick?: () => void
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  onClick,
  children,
}) => {
  return (
    <button
      className={cn("rounded-lg font-medium transition-colors", {
        "bg-blue-500 text-white": variant === "primary",
        "bg-gray-200 text-gray-800": variant === "secondary",
        "px-3 py-1 text-sm": size === "sm",
        "px-4 py-2 text-base": size === "md",
        "px-6 py-3 text-lg": size === "lg",
      })}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
```

### Hooks Customizados

```typescript
// ✅ BOM: Hook bem tipado e com cleanup
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setStoredValue = useCallback(
    (newValue: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          newValue instanceof Function ? newValue(value) : newValue
        setValue(valueToStore)
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key, value],
  )

  return [value, setStoredValue] as const
}
```

### CSS/Tailwind

```tsx
// ✅ BOM: Classes organizadas e responsivas
<div className={cn(
  // Base styles
  "flex items-center gap-2 p-4",
  // Responsive
  "md:gap-4 md:p-6",
  // Interactive states
  "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500",
  // Conditional
  isActive && "bg-blue-100 border-blue-500"
)} />

// ❌ RUIM: Classes desordenadas
<div className="p-4 hover:bg-gray-50 flex md:p-6 gap-2 items-center focus:outline-none md:gap-4 focus:ring-2 focus:ring-blue-500" />
```

### Estrutura de Arquivos

```
src/
├── components/
│   ├── ui/           # Componentes base reutilizáveis
│   ├── layout/       # Componentes de layout
│   └── features/     # Componentes específicos de features
├── hooks/            # Custom hooks
├── contexts/         # React contexts
├── types/            # Definições TypeScript
├── lib/              # Utilitários e helpers
└── pages/            # Componentes de página
```

## 🔄 Processo de Pull Request

### Checklist Antes do PR

- [ ] O código segue as guidelines do projeto
- [ ] Todos os testes passam
- [ ] ESLint não reporta erros
- [ ] Documentação foi atualizada se necessário
- [ ] Commits seguem o padrão conventional

### Template de Pull Request

```markdown
## 📝 Descrição

Breve descrição das mudanças incluídas neste PR.

## 🎯 Tipo de Mudança

- [ ] Bug fix (mudança que corrige um issue)
- [ ] Nova feature (mudança que adiciona funcionalidade)
- [ ] Breaking change (mudança que quebra compatibilidade)
- [ ] Documentação (mudanças apenas na documentação)

## ✅ Checklist

- [ ] Meu código segue as guidelines do projeto
- [ ] Eu fiz uma auto-revisão do meu código
- [ ] Comentei o código, especialmente em áreas difíceis de entender
- [ ] Fiz mudanças correspondentes na documentação
- [ ] Minhas mudanças não geram novos warnings
- [ ] Testei que minha feature funciona corretamente

## 🧪 Como Testar

Descreva os passos para testar suas mudanças:

1. Vá para '...'
2. Clique em '...'
3. Veja que '...'

## 📷 Screenshots (se aplicável)

Adicione screenshots para ajudar a explicar suas mudanças.
```

## 🎯 Áreas de Contribuição

### 🐛 Fácil (Good First Issue)

- Correções de typos na documentação
- Melhorias de acessibilidade
- Pequenos bugs de UI
- Adição de testes simples

### 🔧 Médio

- Novas funcionalidades pequenas
- Refatoração de componentes
- Otimizações de performance
- Melhorias de UX

### 🚀 Difícil

- Arquitetura e design patterns
- Features complexas
- Integrações com APIs externas
- Implementação de PWA

## 📞 Contato

Tem dúvidas sobre contribuição? Entre em contato:

- 💬 **Discussions**: Use as GitHub Discussions para perguntas gerais
- 🐛 **Issues**: Para bugs e feature requests

---

**Obrigado por contribuir! 🎉**

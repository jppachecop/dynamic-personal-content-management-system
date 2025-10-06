# 🎨 SGCPD Frontend - Interface React

<div align="center">

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-5.90-FF4154?style=for-the-badge&logo=react-query&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-Latest-000000?style=for-the-badge&logo=shadcnui&logoColor=white)

_Interface frontend moderna e responsiva para o Sistema de Gestão de Conteúdo Pessoal Dinâmico, construída com **React + TypeScript + Vite**._

</div>

---

## 🎯 **Visão Geral**

Este é o frontend do **SGCPD** - uma interface web moderna, intuitiva e completamente responsiva que oferece uma experiência excepcional para gerenciamento de notas pessoais. Desenvolvida com **React 18**, **TypeScript** e **Vite**, proporciona performance máxima e experiência de usuário otimizada.

### **🌟 Características Principais**

- **⚡ Performance Máxima**: Vite + React 18 com renderização otimizada
- **🔧 TypeScript Completo**: Type safety em 100% do código
- **🎨 Design System Moderno**: shadcn/ui + Tailwind CSS
- **📱 Mobile-First**: Interface totalmente responsiva e touch-friendly
- **🔄 Estado Inteligente**: TanStack Query para cache e sincronização
- **♿ Acessibilidade Total**: WCAG 2.1 compliant
- **🎭 Multi-tema**: Suporte a modo claro e escuro
- **🚀 Deployment Ready**: Otimizado para produção
- **🧩 Componentes Reutilizáveis**: Arquitetura modular e escalável
- **📊 Real-time Updates**: Sincronização em tempo real com a API

---

## 🛠️ **Stack Tecnológica Completa**

### **⚛️ Core Framework**

| Tecnologia       | Versão | Propósito               |
| ---------------- | ------ | ----------------------- |
| **React**        | 18.3.1 | Biblioteca UI principal |
| **TypeScript**   | 5.6.3  | Tipagem estática        |
| **Vite**         | 6.x    | Build tool e dev server |
| **React Router** | 6.30.1 | Roteamento SPA          |

### **🎨 UI & Design**

| Tecnologia       | Versão | Propósito                 |
| ---------------- | ------ | ------------------------- |
| **Tailwind CSS** | 3.4.x  | Framework CSS utilitário  |
| **shadcn/ui**    | Latest | Biblioteca de componentes |
| **Radix UI**     | Várias | Componentes acessíveis    |
| **Lucide React** | Latest | Ícones SVG modernos       |
| **Sonner**       | Latest | Sistema de notificações   |

### **🔄 Estado & Dados**

| Tecnologia          | Versão | Propósito                    |
| ------------------- | ------ | ---------------------------- |
| **TanStack Query**  | 5.90.2 | Gerenciamento de estado      |
| **React Hook Form** | 7.54.2 | Gerenciamento de formulários |
| **Zod**             | Latest | Validação de schemas         |
| **React Context**   | Nativo | Estado global da aplicação   |

### **🔧 Ferramentas de Desenvolvimento**

| Tecnologia       | Versão | Propósito                |
| ---------------- | ------ | ------------------------ |
| **ESLint**       | 9.x    | Linting de código        |
| **PostCSS**      | 8.x    | Processamento CSS        |
| **Autoprefixer** | Latest | Prefixos CSS automáticos |

---

## ⚡ **Instalação e Configuração**

### **📋 Pré-requisitos**

- **Node.js** v18 ou superior
- **npm**, **yarn** ou **pnpm**
- **Backend API** rodando em `http://localhost:3001`

### **🚀 Instalação Rápida**

#### **1. Navegue para o diretório frontend:**

```bash
cd frontend
```

#### **2. Instale as dependências:**

```bash
npm install
```

#### **3. Configure as variáveis de ambiente:**

```bash
cp .env.example .env
```

**Edite o arquivo `.env` com suas configurações:**

```env
# URL da API Backend
VITE_API_URL=http://localhost:3001

# Configurações da Aplicação
VITE_APP_NAME="SGCPD"
VITE_APP_VERSION="1.0.0"

# Configurações de Desenvolvimento
VITE_DEV_MODE=true
```

#### **4. Inicie o servidor de desenvolvimento:**

```bash
npm run dev
```

#### **5. Acesse a aplicação:**

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001 (deve estar rodando)

### **🔧 Scripts Disponíveis**

#### **⚡ Desenvolvimento**

```bash
npm run dev              # Servidor de desenvolvimento com HMR
npm run build            # Build de produção otimizado
npm run preview          # Preview do build de produção
npm run build:dev        # Build de desenvolvimento
npm run build:analyze    # Análise do bundle
```

#### **📋 Qualidade**

```bash
npm run lint             # ESLint para análise de código
npm run lint:fix         # Correção automática de problemas
npm run type-check       # Verificação de tipos TypeScript
npm run clean            # Limpeza de cache e build
```

---

## 🏗️ **Estrutura do Projeto**

```
frontend/
├── 📁 public/                   # Assets estáticos
│   ├── favicon.ico              # Ícone da aplicação
│   ├── placeholder.svg          # Imagens placeholder
│   └── robots.txt               # Configuração SEO
├── 📁 src/                      # Código fonte TypeScript/React
│   ├── 📁 components/           # Componentes React organizados
│   │   ├── 📁 layout/          # Componentes de layout
│   │   │   ├── AppLayout.tsx           # Layout principal da aplicação
│   │   │   ├── AppSidebar.tsx          # Sidebar para desktop
│   │   │   ├── AuthenticatedLayout.tsx # Layout para usuários logados
│   │   │   ├── MobileLayout.tsx        # Layout responsivo mobile
│   │   │   ├── MobileNavigation.tsx    # Navegação mobile
│   │   │   └── UnauthenticatedLayout.tsx # Layout para login
│   │   ├── 📁 notes/           # Componentes de notas
│   │   │   ├── NotesList.tsx           # Lista de notas com filtros
│   │   │   ├── NoteEditor.tsx          # Editor WYSIWYG de notas
│   │   │   └── DeleteNoteDialog.tsx    # Modal de confirmação
│   │   ├── 📁 ui/              # Componentes base (shadcn/ui)
│   │   │   ├── button.tsx              # Componente de botão
│   │   │   ├── input.tsx               # Componente de input
│   │   │   ├── card.tsx                # Componente de card
│   │   │   ├── dialog.tsx              # Sistema de modais
│   │   │   ├── CategoryDialog.tsx      # Modal para categorias
│   │   │   ├── LoadingScreen.tsx       # Tela de carregamento
│   │   │   ├── sonner.tsx              # Notificações toast
│   │   │   └── resizable.tsx           # Painéis redimensionáveis
│   │   └── 📁 users/           # Componentes de usuário
│   ├── 📁 contexts/            # Contextos React
│   │   ├── AppContext.tsx              # Contexto principal da aplicação
│   │   └── AuthContext.tsx             # Contexto de autenticação
│   ├── 📁 hooks/               # Custom hooks
│   │   ├── useNotesAPI.ts              # Hook para API de notas
│   │   ├── useCategoriesAPI.ts         # Hook para API de categorias
│   │   ├── useUsersAPI.ts              # Hook para API de usuários
│   │   ├── use-mobile.tsx              # Hook para detecção mobile
│   │   ├── useLocalStorage.ts          # Hook para localStorage
│   │   ├── useNotesEditorSplit.ts      # Hook para painéis
│   │   └── use-toast.ts                # Hook para notificações
│   ├── 📁 lib/                 # Utilitários e configurações
│   │   ├── api.ts                      # Cliente HTTP para API
│   │   ├── queryClient.ts              # Configuração TanStack Query
│   │   └── utils.ts                    # Funções auxiliares
│   ├── 📁 pages/               # Páginas da aplicação
│   │   ├── Index.tsx                   # Página principal (dashboard)
│   │   └── NotFound.tsx                # Página 404
│   ├── 📁 types/               # Definições TypeScript
│   │   └── index.ts                    # Tipos principais da aplicação
│   ├── App.tsx                 # Componente raiz da aplicação
│   ├── App.css                 # Estilos específicos da aplicação
│   ├── main.tsx                # Ponto de entrada React
│   ├── index.css               # Estilos globais + Tailwind
│   └── vite-env.d.ts           # Tipos do Vite
├── 📄 components.json          # Configuração shadcn/ui
├── 📄 eslint.config.js         # Configuração ESLint
├── 📄 index.html               # Template HTML
├── 📄 package.json             # Dependências e scripts
├── 📄 postcss.config.js        # Configuração PostCSS
├── 📄 tailwind.config.ts       # Configuração Tailwind CSS
├── 📄 tsconfig.json            # Configuração TypeScript
├── 📄 vite.config.ts           # Configuração Vite
└── 📄 README.md                # Esta documentação
```

### **🔧 Arquitetura Componentizada**

```
┌─────────────────────────────────────────┐
│              🎨 UI Layer                │  ← React Components + shadcn/ui
├─────────────────────────────────────────┤
│           📊 State Management           │  ← TanStack Query + React Context
├─────────────────────────────────────────┤
│            🔗 API Integration           │  ← HTTP Client + Custom Hooks
├─────────────────────────────────────────┤
│           🌐 Backend API                │  ← REST API (Node.js + Express)
└─────────────────────────────────────────┘
```

---

## 🚀 **Funcionalidades Implementadas**

### **📝 Gestão Avançada de Notas**

- ✅ **Editor WYSIWYG**: Interface intuitiva para criação e edição
- ✅ **Auto-save**: Salvamento automático de alterações
- ✅ **Sistema de Categorias**: Organização flexível com cores personalizadas
- ✅ **Busca Inteligente**: Pesquisa em tempo real por título, conteúdo e categorias
- ✅ **Filtros Dinâmicos**: Filtrar por categoria, favoritos e data
- ✅ **Favoritos**: Sistema de marcação de notas importantes
- ✅ **Timestamps**: Visualização de datas de criação e modificação

### **🗂️ Sistema de Categorias**

- ✅ **Categorias Personalizadas**: Criação com cores customizáveis
- ✅ **Gestão Completa**: CRUD completo de categorias
- ✅ **Contadores Visuais**: Estatísticas de uso de cada categoria
- ✅ **Validação**: Prevenção de conflitos e dados duplicados

### **👤 Gerenciamento de Usuários**

- ✅ **Autenticação**: Sistema de login/logout
- ✅ **Perfil de Usuário**: Gerenciamento de informações pessoais
- ✅ **Avatar Personalizado**: Upload e exibição de imagem de perfil
- ✅ **Multi-usuário**: Isolamento de dados entre usuários

### **📱 Interface Responsiva Premium**

- ✅ **Mobile-First Design**: Otimizado para dispositivos móveis
- ✅ **Touch Gestures**: Interações naturais em dispositivos touch
- ✅ **Painéis Redimensionáveis**: Interface adaptável no desktop
- ✅ **Navigation Drawer**: Menu lateral deslizante no mobile
- ✅ **Breakpoints Inteligentes**: Layouts adaptativos automáticos


### **♿ Acessibilidade (A11y)**

- ✅ **WCAG 2.1 Compliant**: Cumprimento completo dos padrões
- ✅ **Navegação por Teclado**: Suporte total a navigation por tab
- ✅ **Screen Readers**: Labels e descrições para leitores de tela
- ✅ **Alto Contraste**: Paleta de cores acessível
- ✅ **Focus Management**: Gerenciamento inteligente de foco

---

## 🔌 **Integração com Backend**

### **🌐 Comunicação com API**

O frontend se comunica com a API backend através de:

- **Base URL**: `http://localhost:3001/api`
- **Formato**: REST API com JSON
- **Autenticação**: Headers de autorização
- **Cache**: TanStack Query para otimização

### **📡 Endpoints Consumidos**

#### **👤 Usuários**

```typescript
GET    /api/users              // Listar usuários
POST   /api/users              // Criar usuário
GET    /api/users/:id          // Buscar usuário
PUT    /api/users/:id          // Atualizar usuário
DELETE /api/users/:id          // Deletar usuário
```

#### **📝 Notas**

```typescript
GET    /api/notes              // Listar notas com filtros
POST   /api/notes              // Criar nova nota
GET    /api/notes/:id          // Buscar nota específica
PUT    /api/notes/:id          // Atualizar nota
PATCH  /api/notes/:id/favorite // Toggle favorito
DELETE /api/notes/:id          // Deletar nota
```

#### **🗂️ Categorias**

```typescript
GET    /api/categories         // Listar categorias
POST   /api/categories         // Criar categoria
GET    /api/categories/:id     // Buscar categoria
PUT    /api/categories/:id     // Atualizar categoria
DELETE /api/categories/:id     // Deletar categoria
```

### **🔄 Gerenciamento de Estado**

```typescript
// Exemplo de hook personalizado para notas
const useNotes = (filters?: NotesFilters) => {
  return useQuery({
    queryKey: ["notes", filters],
    queryFn: () => notesAPI.getAll(filters),
    staleTime: 1000 * 60 * 5, // 5 minutos
    cacheTime: 1000 * 60 * 10, // 10 minutos
  })
}

// Mutação para criar nota
const useCreateNote = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: notesAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries(["notes"])
      toast.success("Nota criada com sucesso!")
    },
    onError: (error) => {
      toast.error("Erro ao criar nota")
    },
  })
}
```

---

## 📱 **Responsividade e Design**

### **📐 Breakpoints Utilizados**

```css
/* Sistema de breakpoints mobile-first */
/* Mobile */ /* 0px - 479px */
/* Tablet */ /* 480px - 767px */
/* Desktop */ /* 768px+ */

@media (min-width: 480px) {
  /* Tablet */
}
@media (min-width: 768px) {
  /* Desktop */
}
@media (min-width: 1024px) {
  /* Desktop Large */
}
```

### **🎨 Design System**

#### **Paleta de Cores**

```css
:root {
  /* Cores Primárias */
  --primary: 220 14% 96%;
  --primary-foreground: 220 9% 46%;

  /* Cores de Background */
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;

  /* Cores de Componentes */
  --card: 0 0% 100%;
  --border: 240 5.9% 90%;
  --muted: 240 4.8% 95.9%;
  --accent: 240 4.8% 95.9%;

  /* Estados */
  --destructive: 0 84% 60%;
  --success: 142 76% 36%;
  --warning: 48 96% 53%;
}
```

#### **Tipografia**

```css
/* Sistema de fontes */
.font-sans {
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
}

/* Escala tipográfica */
.text-xs {
  font-size: 0.75rem;
} /* 12px */
.text-sm {
  font-size: 0.875rem;
} /* 14px */
.text-base {
  font-size: 1rem;
} /* 16px */
.text-lg {
  font-size: 1.125rem;
} /* 18px */
.text-xl {
  font-size: 1.25rem;
} /* 20px */
.text-2xl {
  font-size: 1.5rem;
} /* 24px */
```

#### **Espaçamento**

```css
/* Sistema baseado em 0.25rem (4px) */
.space-1 {
  margin: 0.25rem;
} /* 4px */
.space-2 {
  margin: 0.5rem;
} /* 8px */
.space-4 {
  margin: 1rem;
} /* 16px */
.space-6 {
  margin: 1.5rem;
} /* 24px */
.space-8 {
  margin: 2rem;
} /* 32px */
```

### **📱 Estratégia Mobile-First**

- **Design iniciado para mobile** e expandido para desktop
- **Progressive enhancement** para tablets e desktop
- **Touch targets** de mínimo 44px para elementos interativos
- **Navegação por gestos** em dispositivos móveis
- **Componentes adaptativos** que se ajustam automaticamente

---

## 🧪 **Desenvolvimento e Testes**

### **📋 Padrões de Código**

#### **🎯 Convenções de Nomenclatura**

```typescript
// ✅ Componentes: PascalCase
const NoteCard: React.FC<NoteCardProps> = ({ note }) => { ... };

// ✅ Hooks: camelCase com prefixo "use"
const useNotesAPI = () => { ... };

// ✅ Tipos: PascalCase com sufixo apropriado
interface NoteCardProps { ... }
type NotesFilters = { ... };

// ✅ Constantes: UPPER_SNAKE_CASE
const API_BASE_URL = 'http://localhost:3001';
```

#### **🏗️ Estrutura de Componentes**

```typescript
// ✅ Estrutura padrão de componente
interface ComponentProps {
  // Props tipadas
}

export function Component({ prop1, prop2 }: ComponentProps) {
  // 1. Hooks
  const [state, setState] = useState();
  const query = useQuery();

  // 2. Computações
  const computedValue = useMemo(() => { ... }, [deps]);

  // 3. Handlers
  const handleAction = useCallback(() => { ... }, [deps]);

  // 4. Effects
  useEffect(() => { ... }, [deps]);

  // 5. Early returns
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage />;

  // 6. Render
  return (
    <div className="component-container">
      {/* JSX */}
    </div>
  );
}
```

### **🔧 Ferramentas de Qualidade**

#### **📊 Análise de Código**

```bash
# ESLint para análise estática
npm run lint

# TypeScript para verificação de tipos
npm run type-check

# Análise do bundle
npm run build:analyze
```
---

## 📜 **Licença e Informações**

### **📄 Licença**

Este projeto está licenciado sob a **MIT License** - veja o arquivo [LICENSE](../LICENSE) para detalhes.

### **👥 Equipe de Desenvolvimento**

- 👤 **Iury Tavares** - Frontend Developer & UI/UX Design
- 👤 **João Paulo Pacheco** - Full-Stack Developer & DevOps
- 👤 **Lucas Fernandes Silva** - Backend Developer & Database
- 👤 **Marcos Vinícius de Souza Oliveira** - Frontend Developer & Testing

### **🎓 Contexto Acadêmico**

- **Instituição**: Programa de Residência em TI
- **Disciplina**: Frontend Development
- **Professor**: MSc. Reinaldo de Souza Júnior
- **Período**: 2024.2

---

[⬆ Voltar ao topo](#-sgcpd-frontend---interface-react)

</div>

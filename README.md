# 📝 SGCPD - Sistema de Gestão de Conteúdo Pessoal Dinâmico

<div align="center">

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.18-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.x-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-5.7-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4.19-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-5.90-FF4154?style=for-the-badge&logo=react-query&logoColor=white)

_Sistema full-stack moderno para gerenciamento inteligente de notas pessoais, construído com **React + TypeScript** (frontend) e **Node.js + Express + PostgreSQL + Prisma** (backend)._

</div>

---

## 🎯 **Visão Geral**

O **SGCPD** é uma aplicação web completa e moderna para gerenciamento de notas pessoais, desenvolvido com arquitetura full-stack e foco na **experiência do usuário**, **performance** e **escalabilidade**. O projeto utiliza tecnologias de ponta para oferecer uma solução robusta de organização de conteúdo pessoal.

### **🌟 Características Principais**

- **🏗️ Arquitetura Full-Stack**: Frontend React separado com API REST robusta
- **🎨 Interface Moderna**: Design limpo e intuitivo baseado em shadcn/ui
- **📱 100% Responsivo**: Experiência otimizada para desktop, tablet e mobile
- **⚡ Performance Otimizada**: Vite + React 18 + TanStack Query para máxima velocidade
- **🎯 Acessibilidade**: Implementação completa de padrões WCAG
- **💾 Banco de Dados Robusto**: PostgreSQL com Prisma ORM e migrações
- **🔌 API RESTful Completa**: Express.js com documentação Swagger automática
- **🔄 Gerenciamento de Estado**: TanStack Query para cache e sincronização
- **🔧 TypeScript Full-Stack**: Tipagem forte em todo o projeto
- **🐳 Containerização**: Docker Compose para desenvolvimento e produção

</div>

---

## 🎓 **Contexto Acadêmico**

Este projeto foi desenvolvido como trabalho prático da disciplina de **Frontend** ministrada pelo **Prof. MSc. Reinaldo de Souza Júnior** no programa de **Residência em TI**.

### **📚 Objetivos Educacionais**

- Aplicação prática de tecnologias modernas de frontend e backend
- Desenvolvimento de interfaces responsivas e acessíveis
- Implementação de arquitetura full-stack com API REST
- Experiência com ferramentas de build e desenvolvimento modernas
- Aplicação de princípios de UX/UI design
- Gerenciamento de banco de dados e migrações com Prisma

---

## 🚀 **Funcionalidades Implementadas**

### **👤 Sistema de Usuários**

- ✅ **Cadastro e Login**: Autenticação baseada em email
- ✅ **Perfil de Usuário**: Gerenciamento de informações pessoais
- ⚠️ **Avatar**: Campo disponível no perfil (upload não implementado)

### **📝 Gestão Avançada de Notas**

#### **Criação e Edição**

- ✅ **Editor de Texto**: Interface simples e intuitiva para criação de notas
- ✅ **Salvamento Manual**: Botão de salvar para persistir alterações
- ✅ **Títulos Dinâmicos**: Títulos editáveis inline
- ✅ **Conteúdo de Texto**: Suporte a texto simples com quebras de linha

#### **Organização Inteligente**

- ✅ **Categorias Personalizadas**: Sistema de categorias com cores customizáveis
- ✅ **Sistema de Favoritos**: Marcar notas importantes como favoritas
- ✅ **Busca por Título**: Sistema de busca simples e eficiente
- ✅ **Filtros Dinâmicos**: Filtrar por categoria e favoritos

#### **Visualização e Interface**

- ✅ **Lista Responsiva**: Visualização otimizada para diferentes dispositivos
- ✅ **Painéis Redimensionáveis**: Interface adaptável no desktop
- ✅ **Timestamps Inteligentes**: Data de criação e última modificação
- ✅ **Contadores Visuais**: Quantidade de notas e categorias
- ✅ **Toast Notifications**: Feedback visual para ações do usuário

### **🗂️ Gestão de Categorias**

- ✅ **Criação Dinâmica**: Criar categorias com cores personalizadas
- ✅ **Contagem de Uso**: Visualizar quantas notas pertencem a cada categoria

### **📱 Experiência Mobile Premium**

- ✅ **Design Mobile-First**: Interface otimizada para dispositivos móveis
- ✅ **Layouts Adaptativos**: Componentes que se ajustam automaticamente

### **🎨 Interface e Design System**

- ✅ **Tema Moderno**: Paleta de cores profissional e consistente
- ✅ **Componentes Reutilizáveis**: Baseado em shadcn/ui e Radix UI
- ✅ **Animações Fluidas**: Transições e micro-interações polidas

---

## 🛠️ **Stack Tecnológica Completa**

### **🎯 Frontend**

| Tecnologia           | Versão | Propósito                     |
| -------------------- | ------ | ----------------------------- |
| **React**            | 18.3.1 | Framework UI principal        |
| **TypeScript**       | 5.8.3  | Tipagem estática              |
| **Vite**             | 5.4.19 | Build tool e dev server       |
| **TanStack Query**   | 5.90.2 | Gerenciamento de estado/cache |
| **React Router DOM** | 6.30.1 | Roteamento SPA                |

### **🎨 Design & UI**

| Tecnologia       | Versão | Propósito                 |
| ---------------- | ------ | ------------------------- |
| **Tailwind CSS** | 3.4.x  | Framework CSS utilitário  |
| **shadcn/ui**    | Latest | Biblioteca de componentes |
| **Radix UI**     | Várias | Componentes acessíveis    |
| **Lucide React** | Latest | Ícones modernos           |

### **🔗 Backend**

| Tecnologia     | Versão | Propósito                 |
| -------------- | ------ | ------------------------- |
| **Node.js**    | 20.x   | Runtime JavaScript        |
| **Express.js** | 4.18.2 | Framework web             |
| **TypeScript** | 5.x    | Tipagem estática          |
| **Prisma ORM** | 5.7.1  | ORM e migrations          |
| **PostgreSQL** | 15.x   | Banco de dados relacional |

### **� Documentação & DevTools**

| Tecnologia          | Versão | Propósito            |
| ------------------- | ------ | -------------------- |
| **Swagger/OpenAPI** | 6.2.8  | Documentação da API  |
| **ESLint**          | 9.x    | Linting de código    |
| **Prettier**        | Latest | Formatação de código |
| **Docker Compose**  | 3.8    | Containerização      |

### **🔧 Segurança & Performance**

| Tecnologia      | Versão | Propósito              |
| --------------- | ------ | ---------------------- |
| **Helmet**      | 7.1.0  | Segurança HTTP         |
| **CORS**        | 2.8.5  | Cross-Origin Resource  |
| **Compression** | 1.7.4  | Compressão de resposta |

---

## 🏗️ **Arquitetura do Sistema**

### **📁 Estrutura do Projeto**

```
dynamic-personal-content-management-system/
├── 🎯 frontend/                 # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/          # Componentes React
│   │   │   ├── layout/         # Layouts e navegação
│   │   │   ├── notes/          # Componentes de notas
│   │   │   ├── ui/             # Componentes base (shadcn/ui)
│   │   │   └── users/          # Componentes de usuário
│   │   ├── contexts/           # Contextos React
│   │   ├── hooks/              # Custom hooks
│   │   ├── lib/                # Utilitários e configurações
│   │   ├── pages/              # Páginas da aplicação
│   │   └── types/              # Definições TypeScript
│   ├── public/                 # Assets estáticos
│   └── package.json
├── 🔗 backend/                  # Node.js + Express + PostgreSQL
│   ├── src/
│   │   ├── config/             # Configurações (Prisma, Swagger)
│   │   ├── middleware/         # Middlewares Express
│   │   ├── repositories/       # Camada de dados
│   │   ├── routes/             # Rotas da API
│   │   └── types/              # Tipos TypeScript
│   ├── prisma/                 # Schema e migrações
│   │   ├── schema.prisma       # Definição do banco
│   │   ├── seed.ts             # Dados iniciais
│   │   └── migrations/         # Migrações versionadas
│   └── package.json
├── 🐳 docker-compose.yml        # Orquestração de containers
├── 📖 README.md                 # Documentação principal
└── 📝 *.md                      # Documentação adicional
```

### **🔄 Fluxo de Dados**

```mermaid
graph TB
    subgraph "Frontend (React)"
        A[React Components] --> B[TanStack Query]
        B --> C[API Client]
        C --> D[HTTP Requests]
    end

    subgraph "Backend (Node.js + Express)"
        E[Express Routes] --> F[Middleware Layer]
        F --> G[Repository Pattern]
        G --> H[Prisma ORM]
    end

    subgraph "Database"
        I[PostgreSQL]
        J[Users Table]
        K[Notes Table]
        L[Categories Table]
    end

    D -.->|REST API| E
    H --> I
    I --> J
    I --> K
    I --> L

    subgraph "Development Tools"
        M[Docker Compose]
        N[Swagger Docs]
        O[Prisma Studio]
    end

    style A fill:#3366ff
    style E fill:#339933
    style I fill:#336791
    style M fill:#2496ED
```

---

## ⚡ **Instalação e Configuração**

> **💡 Escolha uma das duas opções abaixo:**
>
> - **🐳 Docker** (Recomendado) - Mais simples e rápido
> - **⚙️ Manual** - Controle total do ambiente

---

## **🐳 Opção 1: Instalação com Docker (Recomendado)**

### **📋 Pré-requisitos**

- **Docker** e **Docker Compose** ([Download](https://docs.docker.com/get-docker/))
- **Git** ([Download](https://git-scm.com/))

### **🚀 Instalação em 2 Passos**

#### **1. Clone e Execute**

```bash
# Clone o repositório
git clone https://github.com/jppachecop/dynamic-personal-content-management-system.git
cd dynamic-personal-content-management-system

# Execute tudo com Docker
docker-compose up --build
```

#### **2. Acesse a Aplicação**

**🎉 Pronto! A aplicação estará rodando em:**

- **🌐 Frontend**: http://localhost:8080
- **🔗 Backend API**: http://localhost:3001
- **📚 Documentação**: http://localhost:3001/api-docs
- **🗄️ Prisma Studio**: http://localhost:5555

### **🛠️ Comandos Docker Úteis**

```bash
# Executar em segundo plano
docker-compose up -d --build

# Ver logs em tempo real
docker-compose logs -f

# Parar todos os serviços
docker-compose down

# Reset completo (remove dados do banco)
docker-compose down -v
```

## **⚙️ Opção 2: Instalação Manual**

### **📋 Pré-requisitos**

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** ou **yarn** ou **pnpm**
- **Git** ([Download](https://git-scm.com/))
- **PostgreSQL** 15+ ([Download](https://www.postgresql.org/download/))

### **🚀 Instalação Passo a Passo**

#### **1. Clone o Repositório**

```bash
git clone https://github.com/jppachecop/dynamic-personal-content-management-system.git
cd dynamic-personal-content-management-system
```

#### **2. Configure o Backend**

```bash
# Navegue para o diretório backend
cd backend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Edite o arquivo .env com suas configurações:
# DATABASE_URL="postgresql://username:password@localhost:5432/sgcpd_database"
# PORT=3001
```

#### **3. Configure o Banco de Dados**

```bash
# Execute as migrações do Prisma
npm run migrate

# Popule o banco com dados iniciais (opcional)
npm run db:seed

# Para visualizar o banco de dados (opcional)
npm run db:studio
```

#### **4. Inicie o Backend**

```bash
# Execute o servidor de desenvolvimento
npm run dev

# O backend estará disponível em: http://localhost:3001
# Documentação da API: http://localhost:3001/api-docs
```

#### **5. Configure o Frontend**

```bash
# Em um novo terminal, navegue para o frontend
cd ../frontend

# Instale as dependências
npm install

# Configure as variáveis de ambiente (se necessário)
cp .env.example .env

# Edite o .env com a URL da API:
# VITE_API_URL=http://localhost:3001
```

#### **6. Inicie o Frontend**

```bash
# Execute o servidor de desenvolvimento
npm run dev

# O frontend estará disponível em: http://localhost:8080
```

**🎉 Aplicação rodando em:**

- **Frontend**: http://localhost:8080
- **Backend**: http://localhost:3001
- **API Docs**: http://localhost:3001/api-docs

---

## **🔐 Configuração de Ambiente**

#### **Backend (.env)**

```bash
# Banco de dados
DATABASE_URL="postgresql://sgcpd_user:sgcpd_password@localhost:5432/sgcpd_database"

# Servidor
PORT=3001
NODE_ENV=development

# Segurança
CORS_ORIGIN="http://localhost:8080"
```

#### **Frontend (.env)**

```bash
# URL da API
VITE_API_URL=http://localhost:3001

```

---

## 📖 **Documentação Técnica**

### **🔄 Fluxo de Dados Detalhado**

#### **1. Requisição do Frontend**

```typescript
// 1. Componente React faz uma ação
const { mutate: createNote } = useCreateNote();

// 2. Hook personalizado usa TanStack Query
const useCreateNote = () => {
  return useMutation({
    mutationFn: (noteData) => notesAPI.create(noteData),
    onSuccess: () => {
      queryClient.invalidateQueries(["notes"]);
      toast.success("Nota criada com sucesso!");
    },
  });
};

// 3. API client faz a requisição HTTP
const notesAPI = {
  create: (data) => api.post("/api/notes", data),
  // ... outras operações
};
```

#### **2. Processamento no Backend**

```typescript
// 1. Rota Express recebe a requisição
app.post("/api/notes", validateNote, createNote);

// 2. Middleware de validação
const validateNote = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// 3. Controller processa a lógica
const createNote = async (req, res) => {
  try {
    const note = await NoteRepository.create(req.body);
    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
};

// 4. Repository acessa o banco via Prisma
const NoteRepository = {
  create: (data) =>
    prisma.note.create({
      data,
      include: { category: true, user: true },
    }),
};
```

### **🗄️ Schema do Banco de Dados**

```sql
-- Tabela de usuários
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  avatar TEXT, -- Campo disponível mas upload não implementado
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de categorias
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  color VARCHAR(7) NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(name, user_id)
);

-- Tabela de notas
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  content TEXT,
  tags TEXT[], -- Tags como array de strings (sem tabela separada)
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_category_id ON notes(category_id);
CREATE INDEX idx_notes_created_at ON notes(created_at DESC);
CREATE INDEX idx_notes_is_favorite ON notes(is_favorite);
CREATE INDEX idx_notes_tags ON notes USING GIN(tags);
```

### **🔌 API Endpoints**

#### **Usuários**

```http
GET    /api/users              # Listar usuários
POST   /api/users              # Criar usuário
GET    /api/users/:id          # Buscar usuário por ID
PUT    /api/users/:id          # Atualizar usuário
DELETE /api/users/:id          # Deletar usuário
```

#### **Categorias**

```http
GET    /api/categories         # Listar categorias do usuário
POST   /api/categories         # Criar categoria
GET    /api/categories/:id     # Buscar categoria por ID
PUT    /api/categories/:id     # Atualizar categoria
DELETE /api/categories/:id     # Deletar categoria
```

#### **Notas**

```http
GET    /api/notes              # Listar notas com filtros
POST   /api/notes              # Criar nota
GET    /api/notes/:id          # Buscar nota por ID
PUT    /api/notes/:id          # Atualizar nota
DELETE /api/notes/:id          # Deletar nota
PATCH  /api/notes/:id/favorite # Toggle favorito
```

### **🎨 Design System**

#### **Paleta de Cores**

```css
:root {
  /* Cores primárias */
  --primary: 220 14% 96%;
  --primary-foreground: 220 9% 46%;

  /* Cores de background */
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;

  /* Cores de componentes */
  --card: 0 0% 100%;
  --card-foreground: 240 10% 3.9%;
  --border: 240 5.9% 90%;

  /* Estados */
  --destructive: 0 84% 60%;
  --muted: 240 4.8% 95.9%;
  --accent: 240 4.8% 95.9%;
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
/* Sistema de espaçamento baseado em 0.25rem (4px) */
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

---

## 🧪 **Testes e Qualidade**

### **📊 Cobertura de Qualidade Implementada**

- ✅ **ESLint**: Análise estática de código com regras personalizadas
- ✅ **TypeScript**: Verificação de tipos em 100% do código
- ✅ **Prettier**: Formatação consistente automática
- ✅ **Swagger/OpenAPI**: Documentação automática da API
- ✅ **Prisma Migrations**: Versionamento do schema do banco
- ✅ **Error Boundaries**: Tratamento robusto de erros
- ✅ **Validation Middleware**: Validação de dados na API

### **🔍 Checklist de Qualidade**

- [x] **Código 100% TypeScript** em frontend e backend
- [x] **Componentes reutilizáveis** com props tipadas
- [x] **Hooks customizados** bem estruturados e documentados
- [x] **Gerenciamento de estado** com TanStack Query
- [x] **Tratamento de erros** adequado em toda aplicação
- [x] **Performance otimizada** com lazy loading e memoization
- [x] **Acessibilidade implementada** seguindo WCAG 2.1
- [x] **API RESTful** com padrões consistentes
- [x] **Documentação completa** da API com Swagger
- [x] **Migrations versionadas** para controle do schema
- [x] **Containerização** com Docker para dev e prod

### **🔧 Ferramentas de Desenvolvimento**

#### **Frontend**

```bash
npm run lint         # ESLint para análise de código
npm run lint:fix     # Correção automática de problemas
npm run type-check   # Verificação de tipos TypeScript
```

#### **Backend**

```bash
npm run type-check   # Verificação de tipos TypeScript
npm run db:studio    # Interface visual do banco (Prisma Studio)
npm run migrate      # Aplicar migrações do banco
npm run db:seed      # Popular banco com dados de teste
```

---

### **👥 Equipe de Desenvolvimento**

**Desenvolvido por:**

- 👤 **Iury Tavares** - Full-Stack Developer & UI/UX
- 👤 **João Paulo Pacheco** - Full-Stack Developer & DevOps
- 👤 **Lucas Fernandes Silva** - Full-Stack Developer & Testing
- 👤 **Marcos Vinícius de Souza Oliveira** - Full-Stack Developer & Testing

### **🎓 Contexto Acadêmico**

**Instituição:** Universidade Federal de Goiás - Programa de Residência em TI  
**Disciplina:** Frontend Development  
**Professor:** MSc. Reinaldo de Souza Júnior

---

### **🌟 Ferramentas de Desenvolvimento**

- **[VS Code](https://code.visualstudio.com/)** - Editor de código
- **[GitHub](https://github.com/)** - Versionamento e colaboração
- **[Docker](https://www.docker.com/)** - Containerização
- **[Figma](https://www.figma.com/)** - Design e prototipagem
- **[Swagger](https://swagger.io/)** - Documentação de API

---

**Links Úteis:**

- 🐛 [Reportar Bug](https://github.com/jppachecop/dynamic-personal-content-management-system/issues)
- 💡 [Sugerir Feature](https://github.com/jppachecop/dynamic-personal-content-management-system/issues)
- 🤝 [Contribuir](./CONTRIBUTING.md)

---

[⬆ Voltar ao topo](#-sgcpd---sistema-de-gestão-de-conteúdo-pessoal-dinâmico)

</div>

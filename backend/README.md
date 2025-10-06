# 🔗 SGCPD Backend - API RESTful

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.18-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.x-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-5.7-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-3.0-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)

_API backend robusta e escalável para o Sistema de Gestão de Conteúdo Pessoal Dinâmico, construída com **TypeScript + Express + PostgreSQL + Prisma**._

</div>

---

## 🎯 **Visão Geral**

Este é o backend do **SGCPD** - uma API RESTful completa e moderna que fornece todos os serviços necessários para o gerenciamento inteligente de notas pessoais. Desenvolvida com **TypeScript**, **Express.js** e **PostgreSQL**, oferece uma solução robusta, escalável e type-safe para armazenamento e gerenciamento de dados.

### **🌟 Características Principais**

- **🔧 TypeScript Completo**: Type safety em 100% do código
- **⚡ Express.js**: Framework web rápido e flexível
- **🗄️ PostgreSQL**: Banco de dados relacional robusto e confiável
- **🔀 Prisma ORM**: ORM moderno com type safety e auto-geração
- **📝 Documentação Swagger**: API totalmente documentada e interativa
- **✅ Validação Robusta**: Validação completa usando express-validator
- **🛡️ Segurança**: Headers de segurança com Helmet.js
- **🔄 CORS Configurável**: Suporte completo a cross-origin requests
- **📊 Logging**: Logging detalhado com Morgan
- **🗜️ Compressão**: Compressão Gzip para otimização de performance
- **🔄 Migrações**: Sistema de migrações versionadas com Prisma

---

## 📚 **Documentação da API**

A API inclui documentação Swagger/OpenAPI completa e interativa que oferece:

- **🔍 Explorador Interativo**: Teste endpoints diretamente no navegador
- **📋 Definições Completas**: Modelos detalhados de request/response
- **🔐 Exemplos de Autenticação**: Requisições e respostas de exemplo
- **⚠️ Tratamento de Erros**: Documentação completa de respostas de erro
- **🧪 Ambiente de Testes**: Teste direto da API através da interface

### **🌐 Acessando a Documentação**

Com o servidor em execução, acesse a documentação em:

- **🎨 Interface Swagger**: `http://localhost:3001/api-docs`
- **📄 Especificação JSON**: `http://localhost:3001/api-docs.json`

### **📋 Recursos Documentados**

- ✅ **API de Usuários**: Operações CRUD completas para gerenciamento de usuários
- ✅ **API de Notas**: Gerenciamento completo com busca, filtros e favoritos
- ✅ **API de Categorias**: Gerenciamento com estatísticas de uso e cores
- ✅ **Health Check**: Status do servidor e monitoramento

---

## ⚡ **Instalação e Configuração**

### **📋 Pré-requisitos**

- **Node.js** v18 ou superior
- **PostgreSQL** v15 ou superior
- **npm** ou **yarn**

### **� Instalação Rápida**

#### **1. Navegue para o diretório backend:**

```bash
cd backend
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
# Configuração do Banco de Dados
DATABASE_URL="postgresql://sgcpd_user:sgcpd_password@localhost:5432/sgcpd_database"

# Configuração do Servidor
PORT=3001
NODE_ENV=development

# Configuração de CORS
CORS_ORIGIN=http://localhost:5173

# Configuração de Segurança (para produção)
JWT_SECRET=seu-jwt-secret-super-seguro
```

#### **4. Configure o banco PostgreSQL:**

**Opção A: Usando Docker (Recomendado)**

```bash
# Na raiz do projeto
docker-compose up postgres -d
```

**Opção B: PostgreSQL Local**

```sql
-- Conecte-se ao PostgreSQL e execute:
CREATE DATABASE sgcpd_database;
CREATE USER sgcpd_user WITH PASSWORD 'sgcpd_password';
GRANT ALL PRIVILEGES ON DATABASE sgcpd_database TO sgcpd_user;
```

#### **5. Execute as migrações do Prisma:**

```bash
# Gera o cliente Prisma
npm run generate

# Executa as migrações
npm run migrate

# Popula o banco com dados iniciais (opcional)
npm run db:seed
```

#### **6. Inicie o servidor:**

**Modo Desenvolvimento:**

```bash
npm run dev
```

**Modo Produção:**

```bash
npm run build
npm start
```

### **🎯 Acesso aos Serviços**

- **🔗 API Base**: `http://localhost:3001/api`
- **📚 Documentação**: `http://localhost:3001/api-docs`
- **💓 Health Check**: `http://localhost:3001/health`
- **🗄️ Prisma Studio**: `http://localhost:5555` (rode `npm run db:studio`)

---

## � **Endpoints da API**

### **🏠 Base URL**

```
http://localhost:3001/api
```

### **💓 Health Check**

- **GET** `/health` - Status de saúde do servidor

### **👤 Usuários**

- **GET** `/users` - Listar todos os usuários
- **GET** `/users/:id` - Buscar usuário por ID
- **POST** `/users` - Criar novo usuário
- **PUT** `/users/:id` - Atualizar usuário
- **DELETE** `/users/:id` - Deletar usuário

**Exemplo de Criação de Usuário:**

```json
POST /api/users
{
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "avatar": "https://exemplo.com/avatar.jpg"
}
```

### **📝 Notas**

- **GET** `/notes` - Listar notas (com parâmetros de query)
- **GET** `/notes/:id` - Buscar nota por ID
- **POST** `/notes` - Criar nova nota
- **PUT** `/notes/:id` - Atualizar nota
- **PATCH** `/notes/:id/favorite` - Alternar status de favorito
- **DELETE** `/notes/:id` - Deletar nota

**Parâmetros de Query para GET `/notes`:**

- `userId` - Filtrar por ID do usuário
- `categoryId` - Filtrar por ID da categoria
- `isFavorite=true` - Buscar apenas notas favoritas
- `search` - Busca no título e conteúdo
- `tags` - Filtrar por tags (array)
- `page` - Número da página (paginação)
- `limit` - Limite de resultados por página

**Exemplo de Criação de Nota:**

```json
POST /api/notes
{
  "title": "Minha Primeira Nota",
  "content": "Conteúdo da nota aqui...",
  "tags": ["importante", "trabalho"],
  "categoryId": "uuid-da-categoria",
  "userId": "uuid-do-usuario",
  "isFavorite": false
}
```

### **🗂️ Categorias**

- **GET** `/categories` - Listar todas as categorias
- **GET** `/categories/:id` - Buscar categoria por ID
- **POST** `/categories` - Criar nova categoria
- **PUT** `/categories/:id` - Atualizar categoria
- **DELETE** `/categories/:id` - Deletar categoria

**Parâmetros de Query para GET `/categories`:**

- `userId` - Filtrar por ID do usuário
- `withUsage=true` - Incluir contagem de uso

**Exemplo de Criação de Categoria:**

```json
POST /api/categories
{
  "name": "Trabalho",
  "color": "#3B82F6",
  "userId": "uuid-do-usuario"
}
```

---

## 🗄️ **Schema do Banco de Dados**

### **👤 Tabela Users**

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **📝 Tabela Notes**

```sql
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  content TEXT,
  tags TEXT[] DEFAULT '{}',
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **🗂️ Tabela Categories**

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  color VARCHAR(7) NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(name, user_id)
);
```

### **🔗 Relacionamentos**

```typescript
// Modelo de dados TypeScript (Prisma)
model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  avatar    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  notes      Note[]     // 1:N
  categories Category[] // 1:N
}

model Note {
  id         String   @id @default(uuid())
  title      String
  content    String?
  tags       String[]
  categoryId String
  userId     String
  isFavorite Boolean  @default(false)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  user     User     @relation(fields: [userId], references: [id])
  category Category @relation(fields: [categoryId], references: [id])
}

model Category {
  id     String @id @default(uuid())
  name   String
  color  String
  userId String

  user  User   @relation(fields: [userId], references: [id])
  notes Note[] // 1:N
}
```

---

## 🏗️ **Estrutura do Projeto**

```
backend/
├── 📁 prisma/                   # Configuração do Prisma
│   ├── schema.prisma            # Schema do banco de dados
│   ├── seed.ts                  # Script de população inicial
│   └── migrations/              # Migrações versionadas
│       ├── migration_lock.toml
│       └── 20251004_*/          # Migrações por data
├── 📁 src/                      # Código fonte TypeScript
│   ├── 📁 config/               # Configurações
│   │   ├── prisma.ts            # Cliente Prisma
│   │   └── swagger.ts           # Configuração Swagger
│   ├── 📁 middleware/           # Middlewares Express
│   │   ├── errorHandler.ts      # Tratamento global de erros
│   │   └── validation.ts        # Validação de entrada
│   ├── 📁 repositories/         # Camada de acesso a dados
│   │   ├── UserRepository.ts    # Operações de usuário
│   │   ├── NoteRepository.ts    # Operações de notas
│   │   ├── CategoryRepository.ts # Operações de categorias
│   │   └── index.ts             # Exports centralizados
│   ├── 📁 routes/               # Definição das rotas
│   │   ├── users.ts             # Rotas de usuários
│   │   ├── notes.ts             # Rotas de notas
│   │   ├── categories.ts        # Rotas de categorias
│   │   └── index.ts             # Agregação de rotas
│   ├── 📁 types/                # Definições TypeScript
│   │   └── index.ts             # Tipos e interfaces
│   └── server.ts                # Ponto de entrada da aplicação
├── 📄 .env.example              # Template de variáveis de ambiente
├── 📄 Dockerfile               # Configuração Docker
├── 📄 package.json             # Dependências e scripts
├── 📄 tsconfig.json            # Configuração TypeScript
└── 📄 README.md                # Esta documentação
```

### **� Arquitetura em Camadas**

```
┌─────────────────────────────────────────┐
│           🌐 API Routes Layer           │  ← Express Routes + Validation
├─────────────────────────────────────────┤
│         📊 Repository Pattern           │  ← Data Access Layer
├─────────────────────────────────────────┤
│           🔀 Prisma ORM                 │  ← Database Abstraction
├─────────────────────────────────────────┤
│          🗄️ PostgreSQL Database         │  ← Persistent Storage
└─────────────────────────────────────────┘
```

---

## 🔧 **Scripts Disponíveis**

### **⚡ Desenvolvimento**

```bash
npm run dev              # Servidor de desenvolvimento com hot reload
npm run build            # Compilar TypeScript para JavaScript
npm run start            # Executar versão compilada
npm run type-check       # Verificação de tipos TypeScript
```

### **🗄️ Banco de Dados**

```bash
npm run migrate          # Executar migrações (development)
npm run migrate:deploy   # Executar migrações (production)
npm run migrate:reset    # Reset completo do banco
npm run db:push          # Push schema sem migração
npm run db:seed          # Popular banco com dados iniciais
npm run db:studio        # Abrir Prisma Studio (GUI do banco)
npm run generate         # Gerar cliente Prisma
```

### **📚 Documentação**

```bash
npm run docs             # Mostrar URL da documentação
```

---

## 🔒 **Recursos de Segurança**

### **🛡️ Medidas Implementadas**

- **🔐 Helmet.js**: Headers de segurança automáticos
- **🌐 CORS Configurável**: Controle de requisições cross-origin
- **✅ Validação de Entrada**: Todos os inputs são validados
- **💉 Prevenção SQL Injection**: Queries parametrizadas via Prisma
- **🚫 Sanitização de Erros**: Nenhum dado sensível em respostas de erro
- **🔑 UUID**: Chaves primárias UUID para prevenir enumeration
- **🛡️ Rate Limiting**: Proteção contra ataques de força bruta
- **📝 Logging**: Registro detalhado de requisições e erros

### **🔐 Headers de Segurança**

```typescript
// Helmet.js automaticamente aplica:
{
  "Content-Security-Policy": "default-src 'self'",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Strict-Transport-Security": "max-age=31536000"
}
```

---

## ⚠️ **Tratamento de Erros**

### **📋 Respostas de Erro Padronizadas**

```json
{
  "success": false,
  "error": "Mensagem de erro clara",
  "code": "ERROR_CODE",
  "details": [] // Erros de validação opcionais
}
```

### **🔢 Códigos HTTP Utilizados**

- **200** - ✅ Sucesso
- **201** - ✅ Criado com sucesso
- **400** - ❌ Erro de validação (Bad Request)
- **404** - ❌ Recurso não encontrado (Not Found)
- **409** - ❌ Conflito (dados duplicados)
- **422** - ❌ Entidade não processável
- **500** - ❌ Erro interno do servidor

### **🧪 Exemplo de Validação**

```typescript
// Validação robusta com express-validator
const noteValidation = [
  body("title")
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage("Título deve ter entre 1 e 500 caracteres"),

  body("content")
    .optional()
    .isLength({ max: 10000 })
    .withMessage("Conteúdo deve ter no máximo 10.000 caracteres"),

  body("tags").isArray({ max: 10 }).withMessage("Máximo 10 tags permitidas"),
]
```

---

## 🚀 **Performance e Otimizações**

### **⚡ Otimizações Implementadas**

- **🔗 Connection Pooling**: Pool de conexões Prisma otimizado
- **🗜️ Compressão Gzip**: Respostas HTTP comprimidas
- **📊 Índices de Banco**: Índices otimizados para queries frequentes
- **📝 Query Optimization**: Joins eficientes e includes seletivos
- **📄 Paginação**: Suporte a paginação em endpoints de listagem
- **🔍 Busca Otimizada**: Índices GIN para arrays e busca full-text

### **📊 Índices do Banco**

```sql
-- Índices para performance
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_category_id ON notes(category_id);
CREATE INDEX idx_notes_created_at ON notes(created_at DESC);
CREATE INDEX idx_notes_is_favorite ON notes(is_favorite);
CREATE INDEX idx_notes_tags ON notes USING GIN(tags);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_categories_user_id ON categories(user_id);
```

---

## 🧪 **Desenvolvimento e Testes**

### **🔄 Migração do IndexedDB**

Esta API substitui a implementação IndexedDB anterior com melhorias significativas:

#### **🔄 Mapeamento IndexedDB → PostgreSQL + Prisma**

- **Stores IndexedDB** → **Tabelas PostgreSQL** (gerenciadas pelo Prisma)
- **Índices IndexedDB** → **Índices PostgreSQL** (definidos no schema Prisma)
- **Operações client-side** → **Endpoints REST API** (com Prisma ORM)

#### **🌟 Principais Diferenças**

1. **🔗 Server-side**: Dados armazenados no servidor em vez do navegador
2. **👥 Multi-usuário**: Suporte a múltiplos usuários com isolamento de dados
3. **📈 Escalável**: Capacidade de lidar com datasets muito maiores
4. **🛡️ Confiável**: Compliance ACID e durabilidade de dados
5. **🔍 Pesquisável**: Capacidades avançadas de busca com PostgreSQL
6. **🔧 Type-safe**: Prisma oferece type safety completo em TypeScript
7. **🤖 Auto-gerado**: Cliente de banco auto-gerado a partir do schema
8. **📝 Sistema de migrações**: Mudanças de schema versionadas e gerenciadas

#### **🎯 Benefícios do Prisma ORM**

- **🔒 Type Safety**: Tipos TypeScript auto-gerados do schema do banco
- **💡 IntelliSense**: Suporte completo da IDE com auto-completar
- **🔨 Query Builder**: Construção de queries intuitiva e type-safe
- **📝 Sistema de Migrações**: Mudanças de schema versionadas
- **🔍 Database Introspection**: Gerar schema de banco existente
- **🔄 Suporte Múltiplos Bancos**: Fácil troca entre provedores de banco
- **🔗 Connection Pooling**: Gerenciamento de conexões integrado
- **🎨 Prisma Studio**: Navegador e editor visual de banco

### **🛠️ Adicionando Novas Funcionalidades**

1. **📝 Criar/atualizar tipos** em `src/types/index.ts`
2. **🗄️ Adicionar métodos no repository** apropriado
3. **🛣️ Criar/atualizar rotas** com validação
4. **🔄 Atualizar schema Prisma** se necessário
5. **📄 Executar migrações** para mudanças de schema

### **🗄️ Operações de Banco de Dados**

```bash
# Gerar cliente Prisma após mudanças no schema
npm run generate

# Executar migrações (desenvolvimento)
npm run migrate

# Executar migrações (produção)
npm run migrate:deploy

# Reset completo do banco (apenas desenvolvimento)
npm run migrate:reset

# Push mudanças de schema sem criar migração
npm run db:push

# Popular banco com dados iniciais
npm run db:seed

# Abrir Prisma Studio (interface gráfica do banco)
npm run db:studio

# Conectar ao banco via psql (se instalado)
psql -h localhost -U sgcpd_user -d sgcpd_database
```

### **🧪 Exemplos de Uso da API**

#### **Criar um usuário:**

```bash
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Silva",
    "email": "maria@exemplo.com",
    "avatar": "https://exemplo.com/avatar.jpg"
  }'
```

#### **Buscar notas com filtros:**

```bash
# Buscar notas favoritas de um usuário
curl "http://localhost:3001/api/notes?userId=uuid-do-usuario&isFavorite=true"

# Buscar notas por categoria
curl "http://localhost:3001/api/notes?categoryId=uuid-da-categoria"

# Busca textual nas notas
curl "http://localhost:3001/api/notes?search=importante"
```

#### **Criar uma nota:**

```bash
curl -X POST http://localhost:3001/api/notes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Reunião importante",
    "content": "Discutir projeto X com a equipe",
    "tags": ["trabalho", "reunião"],
    "categoryId": "uuid-da-categoria",
    "userId": "uuid-do-usuario",
    "isFavorite": true
  }'
```

---

## 🐳 **Deploy e Produção**

### **🏭 Configuração de Produção**

#### **Variáveis de Ambiente de Produção:**

```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@prod-host:5432/sgcpd_prod
PORT=3001
CORS_ORIGIN=https://seu-frontend.com
JWT_SECRET=seu-jwt-super-seguro-para-producao
```

#### **🚀 Deploy com Docker:**

```bash
# Build da imagem
docker build -t sgcpd-backend .

# Executar container
docker run -p 3001:3001 --env-file .env.production sgcpd-backend
```

#### **📊 Health Check para Produção:**

```typescript
// Endpoint de health check robusto
app.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.status(200).json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: "connected",
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version,
    })
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      database: "disconnected",
      error: error.message,
    })
  }
})
```

### **📈 Monitoramento**

#### **Métricas Recomendadas:**

- **Response Time**: Tempo de resposta médio
- **Throughput**: Requisições por segundo
- **Error Rate**: Taxa de erros
- **Database Connections**: Conexões ativas
- **Memory Usage**: Uso de memória
- **CPU Usage**: Uso de CPU

---

## 🤝 **Contribuição**

### **📋 Guidelines de Contribuição**

1. **🔧 Siga as melhores práticas TypeScript**
2. **📝 Adicione definições de tipos adequadas**
3. **✅ Inclua validação de entrada para todos os endpoints**
4. **📄 Escreva mensagens de commit descritivas**
5. **🧪 Teste suas mudanças completamente**
6. **📚 Atualize a documentação quando necessário**

### **🎯 Padrões de Código**

```typescript
// ✅ Bom: Repository pattern bem estruturado
export class NoteRepository {
  static async create(data: CreateNoteData): Promise<Note> {
    return prisma.note.create({
      data,
      include: {
        category: true,
        user: true,
      },
    })
  }

  static async findByUserId(
    userId: string,
    options?: FindOptions,
  ): Promise<Note[]> {
    return prisma.note.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      ...options,
    })
  }
}
```

### **🏷️ Versionamento**

```bash
# Seguir Semantic Versioning
v1.0.0 - Release inicial
v1.1.0 - Novas funcionalidades
v1.1.1 - Correções de bugs
v2.0.0 - Breaking changes
```

---

## � **Licença**

Este projeto está licenciado sob a **MIT License** - veja o arquivo [LICENSE](../LICENSE) para detalhes completos.

---

## 👥 **Equipe de Desenvolvimento**

**Desenvolvido pela equipe SGCPD:**

- 👤 **Iury Tavares** - Frontend Developer & UI/UX
- 👤 **João Paulo Pacheco** - Full-Stack Developer & DevOps
- 👤 **Lucas Fernandes Silva** - Backend Developer & Database
- 👤 **Marcos Vinícius de Souza Oliveira** - Frontend Developer & Testing

### **🎓 Contexto Acadêmico**

- **Instituição**: Programa de Residência em TI
- **Disciplina**: Frontend Development
- **Professor**: MSc. Reinaldo de Souza Júnior
- **Período**: 2024.2

---

<div align="center">

### 🌟 **Links Úteis**

- 📖 [Documentação da API](http://localhost:3001/api-docs)
- 🗄️ [Prisma Studio](http://localhost:5555)
- 💓 [Health Check](http://localhost:3001/health)
- 🐛 [Reportar Issues](https://github.com/jppachecop/dynamic-personal-content-management-system/issues)

---

**⭐ Se este backend te ajudou, considere dar uma estrela no repositório!**

[⬆ Voltar ao topo](#-sgcpd-backend---api-restful)

</div>

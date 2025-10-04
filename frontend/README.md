# 📝 SGCPD - Frontend

Sistema de Gestão de Conteúdo Pessoal Dinâmico - Interface Frontend

## 🚀 Tecnologias

- **React 18.3.1** - Biblioteca para interfaces de usuário
- **TypeScript 5.8.3** - Tipagem estática para JavaScript
- **Vite 5.4.19** - Build tool e dev server
- **Tailwind CSS 3.4.17** - Framework CSS utilitário
- **shadcn/ui** - Componentes de interface modernos
- **Lucide React** - Ícones SVG
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de esquemas

## ⚡ Instalação e Execução

### Pré-requisitos
- Node.js 18+
- npm, yarn ou pnpm

### Instalação

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 🏗️ Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── layout/         # Componentes de layout
│   ├── ui/             # Componentes base (shadcn/ui)
│   └── ...             # Outros componentes
├── contexts/           # Contextos React
├── hooks/              # Custom hooks
├── lib/                # Utilitários e configurações
├── pages/              # Páginas da aplicação
├── types/              # Definições de tipos TypeScript
├── App.tsx             # Componente principal
├── main.tsx            # Ponto de entrada
└── index.css           # Estilos globais
```

## 🎯 Funcionalidades

- **📝 Gestão de Notas**: Criar, editar, excluir e organizar notas
- **🏷️ Sistema de Tags**: Categorização flexível com cores
- **📂 Categorias**: Organização hierárquica do conteúdo
- **🔍 Busca Avançada**: Pesquisa por título, conteúdo e tags
- **⭐ Favoritos**: Marcar notas importantes
- **📱 Responsivo**: Interface adaptável para todos os dispositivos
- **🎨 Temas**: Suporte a modo claro e escuro
- **♿ Acessibilidade**: Implementação de padrões WCAG

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Servidor de desenvolvimento

# Build
npm run build        # Build de produção
npm run preview      # Preview do build

# Qualidade
npm run lint         # Linting com ESLint
npm run type-check   # Verificação de tipos TypeScript
```

## 🌐 Integração com Backend

Este frontend está configurado para se comunicar com a API backend localizada em `../backend/`.

### Configuração da API

O frontend espera que a API esteja rodando em:
- **Desenvolvimento**: `http://localhost:3001`
- **Produção**: Configurável via variáveis de ambiente

### Endpoints Utilizados

- `GET /api/users` - Listar usuários
- `GET /api/notes` - Listar notas com filtros
- `POST /api/notes` - Criar nova nota
- `PUT /api/notes/:id` - Atualizar nota
- `DELETE /api/notes/:id` - Excluir nota
- `GET /api/tags` - Listar tags
- `GET /api/categories` - Listar categorias

## 📱 Responsividade

O projeto foi desenvolvido com abordagem **mobile-first** e suporta:

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: 1024px+

## 🎨 Design System

Baseado no **shadcn/ui** com customizações:

- **Cores**: Paleta moderna com suporte a tema escuro
- **Tipografia**: Inter como fonte principal
- **Espaçamento**: Sistema baseado em múltiplos de 4px
- **Componentes**: Biblioteca consistente e reutilizável

## 🔄 Estado da Aplicação

Gerenciamento de estado através de:

- **React Context**: Estado global da aplicação
- **Custom Hooks**: Lógica reutilizável
- **Local Storage**: Persistência de preferências
- **API Integration**: Sincronização com backend

## 🚀 Deploy

Para fazer deploy da aplicação:

```bash
# Build de produção
npm run build

# Os arquivos estarão em ./dist/
# Faça upload para seu provedor de hospedagem
```

## 📖 Documentação Adicional

- [Componentes UI](./src/components/ui/README.md)
- [Hooks Customizados](./src/hooks/README.md)
- [Guia de Estilo](./STYLE_GUIDE.md)

---

**Desenvolvido com ❤️ usando React + TypeScript + Vite**

# 🐳 Docker - Guia Rápido

## Execução Simples

```bash
# Clonar o repositório
git clone <seu-repositorio>
cd dynamic-personal-content-management-system

# Executar com Docker
docker-compose up --build
```

## Acessar a Aplicação

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3001
- **Documentação da API**: http://localhost:3001/api-docs

## Comandos Úteis

```bash
# Iniciar em background
docker-compose up -d --build

# Ver logs
docker-compose logs -f

# Parar tudo
docker-compose down

# Parar e remover volumes (remove dados do banco)
docker-compose down -v
```

## O que acontece?

1. **PostgreSQL** é iniciado na porta 5432
2. **Backend** aguarda o banco ficar pronto, executa migrações e seed
3. **Frontend** é iniciado com hot-reload na porta 8080

## Dados do Banco

- **Database**: sgcpd_database
- **User**: sgcpd_user
- **Password**: sgcpd_password
- **Port**: 5432

## Problemas Comuns

- **Porta ocupada**: Altere as portas no `docker-compose.yml`
- **Erro de build**: Execute `docker-compose down` e tente novamente
- **Banco não conecta**: Aguarde alguns segundos para inicialização

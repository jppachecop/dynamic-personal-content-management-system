FROM node:18-alpine

WORKDIR /app

# Instalar dependências do sistema
RUN apk add --no-cache postgresql-client

# Copiar package.json
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código
COPY . .

# Gerar Prisma client
RUN npx prisma generate

# Expor porta
EXPOSE 3001

# Script de inicialização
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && npm run dev"]

FROM node:18-alpine

WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código
COPY . .

# Expor porta
EXPOSE 8080

# Iniciar servidor de desenvolvimento
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "8080"]

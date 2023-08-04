# Use a base image com o ambiente Node.js
FROM node:14-alpine as builder

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos de configuração do projeto (package.json e package-lock.json) para o diretório de trabalho
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o código fonte do projeto para o diretório de trabalho
COPY . .

# Compila o TypeScript para JavaScript
RUN npm run build

# Etapa final: criar imagem mais enxuta sem o Node.js e dependências de desenvolvimento
FROM node:14-alpine

WORKDIR /app

# Copia apenas os arquivos necessários da etapa anterior (estágio de construção)
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/.env .env
COPY --from=builder /app/dist ./dist

# Instala apenas as dependências de produção (opcional)
RUN npm install 

# Expõe a porta que o aplicativo está ouvindo (opcional, defina no comando de execução)
EXPOSE ${PORT}

# Comando para iniciar o aplicativo quando o contêiner for iniciado
CMD ["node", "dist/server.js"]

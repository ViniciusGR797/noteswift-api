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

# Expõe a porta que o aplicativo está ouvindo
EXPOSE ${PORT}

# Comando para iniciar o aplicativo quando o contêiner for iniciado
CMD ["node", "dist/server.js"]
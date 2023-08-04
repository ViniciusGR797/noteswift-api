# Estágio de compilação
FROM node:14 as builder

# Configurando o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copiar apenas os arquivos de dependências e o arquivo de bloqueio para aproveitar o cache da camada
COPY package.json package-lock.json ./

# Instalando as dependências
RUN npm install

# Copiar todos os arquivos do projeto
COPY . .

# Compilar o TypeScript para JavaScript
RUN npm run build

# Estágio de produção
FROM node:14-slim

# Configurando o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copiar apenas os arquivos necessários do estágio de compilação
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Expor a porta que o aplicativo está ouvindo
EXPOSE ${PORT}

# Comando para iniciar o servidor
CMD ["node", "dist/server.js"]

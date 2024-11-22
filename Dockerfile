# Etapa 1: Construir a aplicação usando uma imagem leve
FROM node:18-alpine as build

# Diretório de trabalho
WORKDIR /app

# Copiar apenas arquivos necessários para o build
COPY package.json package-lock.json ./

# Instalar apenas dependências de produção
RUN npm install --production

# Copiar o restante do código
COPY . .

# Construir a aplicação
RUN npm run build

# Etapa 2: Servir os arquivos usando o NGINX
FROM nginx:alpine

# Copiar o build otimizado da etapa anterior
COPY --from=build /app/build /usr/share/nginx/html

# Expor a porta 80
EXPOSE 80

# Comando para rodar o NGINX
CMD ["nginx", "-g", "daemon off;"]

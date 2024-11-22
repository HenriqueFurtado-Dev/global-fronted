# Usar uma imagem Node.js como base para o build
FROM node:18 as build

# Configurar o diretório de trabalho
WORKDIR /app

# Copiar os arquivos do projeto para o container
COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# Usar uma imagem NGINX para servir os arquivos estáticos
FROM nginx:alpine

# Copiar os arquivos do build para o diretório padrão do NGINX
COPY --from=build /app/build /usr/share/nginx/html

# Expor a porta 80 para o container
EXPOSE 80

# Comando padrão para iniciar o NGINX
CMD ["nginx", "-g", "daemon off;"]

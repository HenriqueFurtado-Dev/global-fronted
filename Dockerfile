# Etapa 1: Construir a aplicação
FROM node:18-alpine AS build

# Diretório de trabalho
WORKDIR /app

# Copiar apenas os arquivos necessários para instalar dependências
COPY package.json package-lock.json ./

# Instalar apenas dependências de produção
RUN npm install --production

# Copiar todo o restante do código
COPY . .

# Construir a aplicação para produção
RUN npm run build

# Etapa 2: Servir a aplicação com NGINX
FROM nginx:alpine

# Remover a configuração padrão do NGINX
RUN rm -rf /usr/share/nginx/html/*

# Copiar os arquivos estáticos do build para o diretório do NGINX
COPY --from=build /app/build /usr/share/nginx/html

# Expor a porta 80
EXPOSE 80

# Comando para rodar o NGINX em primeiro plano
CMD ["nginx", "-g", "daemon off;"]

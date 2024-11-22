# Etapa 1: Construir a aplicação
FROM node:18-alpine AS build

# Diretório de trabalho
WORKDIR /app

# Copiar apenas os arquivos de dependências
COPY package.json package-lock.json ./

# Instalar todas as dependências (incluindo devDependencies)
RUN npm install && npm cache clean --force

# Copiar o restante do código
COPY . .

# Construir a aplicação para produção
RUN npm run build

# Etapa 2: Servir a aplicação com NGINX
FROM nginx:alpine

# Remover configuração padrão do NGINX
RUN rm -rf /usr/share/nginx/html/*

# Copiar arquivos estáticos do build para o diretório do NGINX
COPY --from=build /app/build /usr/share/nginx/html

# Ajustar permissões (opcional, mas recomendado)
RUN chmod -R 755 /usr/share/nginx/html

# Expor a porta 80
EXPOSE 80

# Comando para rodar o NGINX em primeiro plano
CMD ["nginx", "-g", "daemon off;"]

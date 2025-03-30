# Etapa 1: Build
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Servidor
FROM node:20-alpine

WORKDIR /app
COPY --from=builder /app /app
RUN npm install -g vite

EXPOSE 4173
CMD ["vite", "preview", "--host", "--port", "4173"]

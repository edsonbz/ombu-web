# Etapa 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar package.json y lock
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el código fuente
COPY . .

# Construir la app
RUN npm run build

# Etapa 2: Servidor de preview
FROM node:20-alpine

WORKDIR /app

# Copiar el resultado del build
COPY --from=builder /app /app

# Instalar Vite globalmente para servir el build
RUN npm install -g vite

# Cambiar al puerto 3000 (el que Railway espera)
EXPOSE 3000

# Comando para servir el build
CMD ["vite", "preview", "--host", "--port", "3000"]

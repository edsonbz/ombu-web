# Etapa 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copiamos los archivos necesarios e instalamos dependencias
COPY package*.json ./
RUN npm install

# Copiamos el resto del código y construimos la app
COPY . .
RUN npm run build

# Etapa 2: Servidor (para servir la app con Vite preview)
FROM node:20-alpine
WORKDIR /app

# Copiamos el resultado del build
COPY --from=builder /app /app

# Instalamos vite globalmente para el preview
RUN npm install -g vite

# Railway expone por defecto el puerto 3000
EXPOSE 3000

# Usamos la variable de entorno $PORT que Railway define
CMD ["sh", "-c", "vite preview --host --port $PORT"]

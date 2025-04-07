# Etapa 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: Producción
FROM node:20-alpine
WORKDIR /app

# Instalamos 'serve' globalmente
RUN npm install -g serve

# Copiamos solo los archivos generados por el build
COPY --from=builder /app/dist /app

# Railway usa el puerto 3000 por defecto
ENV PORT=3000
EXPOSE 3000

# Ejecutamos el servidor
CMD ["serve", "-s", "dist", "-l", "$PORT"]

# Etapa 1: Construcción de la app
FROM node:20-alpine AS builder

# Carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copiamos solo los archivos necesarios para instalar dependencias
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del código fuente
COPY . .

# Ejecutamos el build de producción
RUN npm run build

# Etapa 2: Servidor para servir la app estática
FROM node:20-alpine

# Carpeta de trabajo para el servidor
WORKDIR /app

# Copiamos la app construida desde la etapa anterior
COPY --from=builder /app /app

# Instalamos Vite globalmente para usarlo con `vite preview`
RUN npm install -g vite

# Exponemos el puerto 4173 (por defecto de vite preview)
EXPOSE 4173

# Comando de arranque: Servimos la app en modo preview, escuchando en todas las interfaces
CMD ["vite", "preview", "--host", "0.0.0.0", "--port", "4173"]

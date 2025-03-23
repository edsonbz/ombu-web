# Usa una imagen oficial de Node.js como base
FROM node:16-alpine AS build

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos package.json y package-lock.json para instalar las dependencias
COPY package.json package-lock.json ./

# Instala las dependencias de producción
RUN npm install --production

# Copia el resto de los archivos del proyecto al contenedor
COPY . .

# Construye la aplicación para producción
RUN npm run build

# Usa una imagen más ligera para servir la aplicación
FROM nginx:alpine AS production

# Copia los archivos construidos desde la etapa anterior
COPY --from=build /app/dist /usr/share/nginx/html

# Expone el puerto en el que Nginx estará sirviendo la aplicación
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
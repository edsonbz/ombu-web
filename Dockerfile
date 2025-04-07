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

RUN npm install -g serve

COPY --from=builder /app/dist .

ENV PORT=3000
EXPOSE 3000

# ✅ Corrección: usar sh -c para expandir $PORT
CMD ["sh", "-c", "serve -s . -l $PORT"]

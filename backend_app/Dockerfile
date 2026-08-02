FROM node:20-alpine

WORKDIR /app

# Copiamos primero las dependencias para aprovechar la caché de Docker
COPY package*.json ./
RUN npm install

# Copiamos el resto del código del backend
COPY . .

EXPOSE 3000

# Arranca NestJS en modo desarrollo con auto-recarga
CMD ["npm", "run", "start:dev"]
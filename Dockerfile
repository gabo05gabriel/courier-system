FROM node:20

WORKDIR /app

# Instala dependencias primero (mejor caché)
COPY backend/package*.json ./
RUN npm install

# Copia el resto del código
COPY backend/. .

EXPOSE 3000
CMD ["npm", "start"]

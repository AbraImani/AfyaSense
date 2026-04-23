# Étape 1 : Build de l'application React
FROM node:20-slim AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Définir les arguments de build pour Vite
ARG GEMINI_API_KEY
ARG APP_URL
ENV GEMINI_API_KEY=$GEMINI_API_KEY
ENV APP_URL=$APP_URL

RUN npm run build

# Étape 2 : Serveur de production
FROM node:20-slim

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/server.js ./server.js
COPY --from=build /app/package*.json ./

RUN npm install --only=production

EXPOSE 8080

CMD ["npm", "start"]

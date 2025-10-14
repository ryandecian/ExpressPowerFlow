# Étape 1 : Build avec Node + Alpine
FROM node:22-alpine AS build

# Crée un dossier de travail
WORKDIR /app

# Copie uniquement les fichiers nécessaires à l'installation (cache-friendly)
COPY package*.json ./

# Installe les dépendances exactement selon le package-lock.json (plus fiable que npm install)
RUN npm ci

# Copie le reste du projet (sources, config Vite, etc.)
COPY . .

# Variables d'environnement de build (passées en --build-arg par docker-compose)
ARG VITE_NODE_ENV
ARG VITE_DOMAIN_CLIENT
ARG VITE_DOMAIN_API_SERVER

# Injecte les variables dans l'environnement du build Vite
ENV VITE_NODE_ENV=$VITE_NODE_ENV
ENV VITE_DOMAIN_CLIENT=$VITE_DOMAIN_CLIENT
ENV VITE_DOMAIN_API_SERVER=$VITE_DOMAIN_API_SERVER

# Lance le build Vite (génère le dossier dist/)
RUN npm run build

# On garde une copie du build dans un dossier dédié pour l'étape suivante
RUN mkdir -p /app/dist-build && cp -r dist/* /app/dist-build/


# Étape 2 : Image minimale contenant juste les fichiers buildés
# Ce conteneur ne sert pas les fichiers directement : il remplit le volume partagé puis s'arrête
FROM alpine:3.20

# Crée un dossier de travail
WORKDIR /app

# Copie uniquement le dossier dist généré depuis l’étape précédente
COPY --from=build /app/dist-build /app/dist-build

# Ce conteneur est utilisé uniquement pour partager le dossier dist avec Nginx via un volume
# - Au démarrage, on vide le volume /app/dist (s'il existe) puis on copie le build
# - Le conteneur s'arrête ensuite (exit 0). Nginx sert les fichiers depuis le volume.
CMD sh -c '\
    mkdir -p /app/dist && rm -rf /app/dist/* && \
    cp -r /app/dist-build/* /app/dist/ \
    '

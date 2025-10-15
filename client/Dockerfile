# syntax=docker/dockerfile:1.4

# ------------------------------------------------------------
# Étape 1 : Build du front (Node + Alpine)
# ------------------------------------------------------------
FROM node:22-alpine AS build

# Crée un dossier de travail
WORKDIR /app

# Copie uniquement les fichiers nécessaires à l'installation (cache-friendly)
COPY package*.json ./

# Installe les dépendances exactement selon le package-lock.json
# (Sur certains NAS, BuildKit + seccomp bloque les RUN -> on assouplit)
RUN --security=insecure npm ci

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
RUN --security=insecure npm run build


# ------------------------------------------------------------
# Étape 2 : Runner minimal qui COPIE vers /app/dist (bind-mount NAS)
#  - Dans docker-compose, /app/dist est monté sur :
#    /volume1/docker/ExpressPowerFlow/client-dist
# ------------------------------------------------------------
FROM alpine:3.20

# Chemin de destination dans le conteneur (monté par docker-compose)
ENV EPF_FRONT_ABS_DEST=/app/dist

WORKDIR /runner

# On n’embarque que le résultat du build produit à l’étape précédente
COPY --from=build /app/dist /tmp/dist

# Au démarrage :
# - crée le dossier de destination (bind-mount),
# - vide le contenu existant,
# - copie le build (y compris fichiers cachés),
# - puis termine (Exit 0).
CMD sh -lc '\
    set -euxo pipefail; \
    echo "[client] Destination: ${EPF_FRONT_ABS_DEST}"; \
    mkdir -p "${EPF_FRONT_ABS_DEST}"; \
    echo "[client] Nettoyage de ${EPF_FRONT_ABS_DEST}"; \
    rm -rf "${EPF_FRONT_ABS_DEST:?}/"* || true; \
    echo "[client] Copie du build vers ${EPF_FRONT_ABS_DEST}"; \
    cp -rv /tmp/dist/. "${EPF_FRONT_ABS_DEST}/"; \
    echo "✅ Build copié dans ${EPF_FRONT_ABS_DEST}"; \
    exit 0 \
    '

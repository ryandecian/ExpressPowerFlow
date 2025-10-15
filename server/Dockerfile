# syntax=docker/dockerfile:1.4

# ------------------------------------------------------------
# Étape 1 : Build TypeScript (Node + Alpine)
# ------------------------------------------------------------
FROM node:22-alpine AS build

# Dossier de travail
WORKDIR /app

# Copie des fichiers nécessaires
COPY package*.json ./
COPY tsconfig.json ./

# Installe les dépendances EXACTES du lockfile
# (Sur NAS Synology, BuildKit + seccomp peuvent bloquer -> on assouplit)
RUN --security=insecure npm ci

# Copie du code source
COPY ./src ./src

# Compile TypeScript en JavaScript
RUN --security=insecure npm run build

# Retire devDependencies pour alléger l'image finale
RUN --security=insecure npm prune --production


# ------------------------------------------------------------
# Étape 2 : Runtime minimal
# ------------------------------------------------------------
FROM node:22-alpine AS runtime

WORKDIR /app

# Copie uniquement le nécessaire depuis l’étape de build
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

# Dossier pour les fichiers uploadés
RUN mkdir -p /app/uploads

# Déclare le port utilisé par le serveur
EXPOSE 7080

# Commande de démarrage
CMD ["node", "dist/index.js"]

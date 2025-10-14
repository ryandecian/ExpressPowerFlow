# Étape 1 : Build des fichiers TypeScript
FROM node:22-alpine AS build

# Crée un dossier de travail
WORKDIR /app

# Copie les fichiers nécessaires
COPY package*.json ./
COPY tsconfig.json ./

# Installe les dépendances uniquement  ce qui est dans le package-lock.json (plus rapide que npm install)
RUN npm ci

# Copie le code source
COPY ./src ./src

# Compile TypeScript en JavaScript
RUN npm run build

# Retire devDependencies pour alléger l'image finale
RUN npm prune --production

# Étape 2 : Exécution avec Node uniquement (image minimaliste)
FROM node:22-alpine AS runtime

WORKDIR /app

# Copie uniquement le nécessaire depuis le build
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

# Dossier pour les fichiers uploadés
RUN mkdir -p /app/uploads

# Déclare le port utilisé par le serveur
EXPOSE 7080

# Commande de démarrage
CMD ["node", "dist/index.js"]

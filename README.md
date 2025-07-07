# SkillSwap

<p align="center">
<img src="https://i.ibb.co/hR0MxGqk/logo.webp" alt="logo" border="0">
</p>

## 📋 Table des matières

- [Technologies utilisées](#-technologies-utilisées)
- [Prérequis](#-prérequis)
- [Installation et configuration](#-installation-et-configuration)
- [Utilisation](#-utilisation)
- [Structure du projet](#-structure-du-projet)
- [API Documentation](#-api-documentation)
- [Contribution](#-contribution)
- [Équipe](#-équipe)


## 🛠 Technologies utilisées

### Frontend
- **Framework** : Next.js 15 (React 19)
- **Styling** : Tailwind CSS 4
- **Composants UI** : Shadcn/UI + Radix UI
- **Gestion d'état** : Zustand
- **Formulaires** : React Hook Form + Zod
- **Tests** : Jest + Cypress
- **Langage** : TypeScript

### Backend
- **Framework** : NestJS
- **Base de données** : PostgreSQL
- **ORM** : Prisma
- **Authentification** : JWT + Bcrypt
- **Documentation API** : Swagger/OpenAPI
- **Sécurité** : Helmet, Throttler
- **Langage** : TypeScript

### DevOps & Outils
- **Conteneurisation** : Docker + Docker Compose
- **CI/CD** : GitHub Actions
- **Base de données Admin** : Adminer
- **Linting** : ESLint + Prettier
- **Tests de charge** : Artillery

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- [Docker](https://docs.docker.com/get-docker/) (version 20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 2.0+)
- [Git](https://git-scm.com/)

**Optionnel (pour le développement local sans Docker) :**
- [Node.js](https://nodejs.org/) (version 18+)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

## 🚀 Installation et configuration

### 1. Cloner le repository

```bash
git clone <url-du-repository>
cd projet-skillswap
```

### 2. Configuration des variables d'environnement

#### Configuration principale (.env)

Copiez le fichier d'exemple et configurez les variables :

```bash
cp .env.example .env
```

Éditez le fichier `.env` avec vos valeurs :

```env
# Configuration PostgreSQL
POSTGRES_USER=skillswap_user
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=skillswap_db

# JWT Secret (générez une clé sécurisée)
JWT_SECRET=your_jwt_secret_key_minimum_32_characters

```

#### Configuration Frontend

```bash
cp frontend/.env.example frontend/.env
```

Configurez les variables frontend :

```env
# URL de l'API Backend
NEXT_PUBLIC_API_URL=http://localhost:4000/api

# Configuration ImageKit (pour la gestion d'images)
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=your_imagekit_endpoint
NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
```

#### Configuration Backend

```bash
cp skillswap-api/.env.example skillswap-api/.env
```

Le backend utilise automatiquement la variable `DATABASE_URL` construite par Docker Compose.

### 3. Démarrage avec Docker (Recommandé)

```bash
# Démarrer tous les services
docker-compose watch

# Suivre les logs en temps réel
docker-compose logs -f
```

### 4. Initialisation de la base de données

La base de données est automatiquement initialisée avec :
- Les migrations Prisma
- Les données de seed (catégories et compétences de base)

Si nécessaire, vous pouvez relancer manuellement :

```bash
# Redémarrer uniquement l'API (qui relance les migrations)
docker-compose restart skill-swap-api
```

## 📖 Utilisation

### Accès aux services

Une fois le projet démarré, vous pouvez accéder à :

- **Frontend** : [http://localhost:3000](http://localhost:3000)
- **API Backend** : [http://localhost:4000](http://localhost:4000)
- **Documentation API** : [http://localhost:4000/api](http://localhost:4000/api)
- **Adminer (DB Admin)** : [http://localhost:8081](http://localhost:8081)

### Connexion à Adminer

Pour administrer la base de données via Adminer :
- **Système** : PostgreSQL
- **Serveur** : database
- **Utilisateur** : Valeur de `POSTGRES_USER`
- **Mot de passe** : Valeur de `POSTGRES_PASSWORD`
- **Base de données** : Valeur de `POSTGRES_DB`

### Commandes utiles

```bash
# Arrêter tous les services
docker-compose down

# Redémarrer un service spécifique
docker-compose restart frontend
docker-compose restart skill-swap-api

# Voir les logs d'un service
docker-compose logs -f frontend
docker-compose logs -f skill-swap-api

# Reconstruire les images
docker-compose build

# Supprimer volumes et reconstruire
docker-compose down -v
docker-compose watch -d --build
```

## 🏗 Structure du projet

```
projet-skillswap/
├── frontend/                 # Application Next.js
│   ├── app/                 # Pages et routing (App Router)
│   ├── components/          # Composants React réutilisables
│   ├── lib/                # Utilitaires et configurations
│   ├── @types/             # Types TypeScript générés
│   └── public/             # Assets statiques
├── skillswap-api/           # API NestJS
│   ├── src/                # Code source de l'API
│   ├── prisma/             # Schéma et migrations DB
│   └── test/               # Tests backend
├── docker-compose.yml       # Configuration Docker
├── .env                    # Variables d'environnement
└── README.md               # Ce fichier
```

## 📚 API Documentation

L'API est documentée avec Swagger/OpenAPI et accessible à l'adresse :
[http://localhost:4000/api](http://localhost:4000/api)

## 🤝 Contribution

### Convention de code

Le projet utilise :
- **ESLint** : Pour la qualité du code
- **Prettier** : Pour le formatage automatique

```bash
# Formatter le code
docker-compose exec frontend npm run format
docker-compose exec skill-swap-api npm run format
```

### Workflow Git

1. Créer une branche feature
2. Développer la fonctionnalité
3. Tester localement
4. Créer une Pull Request
5. Review et merge

## 👥 Équipe

### Rôles

- **Product Owner** : Ludovic Agesilas
- **Scrum Master** : Edrick Troupe
- **Lead Dev Frontend** : Quentin Joanon
- **Lead Dev Backend** : Ludovic Agesilas

### Développeurs

**Frontend** :
- Quentin Joanon
- Edrick Troupe

**Backend** :
- Ludovic Agesilas
- Arnaud DELANNOY

---

## 📞 Support

Pour toute question ou problème :
1. Consulter la documentation API : [http://localhost:4000/api](http://localhost:4000/api)
2. Vérifier les logs : `docker-compose logs`
3. Créer une issue dans le repository

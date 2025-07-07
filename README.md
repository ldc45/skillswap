# SkillSwap

<p align="center">
  <img src="https://via.placeholder.com/200x150/005884/FFFFFF?text=SkillSwap" alt="SkillSwap Logo">
</p>

**SkillSwap** est une plateforme innovante conçue pour faciliter l'échange de compétences et de connaissances au sein d'une communauté diversifiée. Le projet repose sur le principe que chaque individu possède des compétences uniques à partager, qu'il s'agisse de compétences professionnelles, de talents artistiques, de connaissances linguistiques, ou de passe-temps.

## 📋 Table des matières

- [À propos du projet](#-à-propos-du-projet)
- [Technologies utilisées](#-technologies-utilisées)
- [Prérequis](#-prérequis)
- [Installation et configuration](#-installation-et-configuration)
- [Utilisation](#-utilisation)
- [Structure du projet](#-structure-du-projet)
- [API Documentation](#-api-documentation)
- [Tests](#-tests)
- [Contribution](#-contribution)
- [Équipe](#-équipe)

## 🎯 À propos du projet

### Objectifs principaux

- **Promouvoir l'apprentissage mutuel** : Faciliter l'échange de compétences entre particuliers
- **Créer une communauté** : Mettre en relation des personnes aux compétences complémentaires
- **Système d'évaluation** : Garantir la qualité des interactions et la fiabilité de la communauté
- **Gratuité** : Faciliter la continuité de l'échange grâce à la gratuité des services

### Fonctionnalités principales

#### MVP (Version 1.0)
- 🏠 **Landing Page** : Présentation de SkillSwap avec profils aléatoires
- 🔐 **Système d'authentification** : Inscription/Connexion sécurisée
- 👤 **Gestion de profil** : Création et modification de profil utilisateur
- 🔍 **Moteur de recherche** : Recherche par compétences
- 💬 **Système de contact** : Communication entre utilisateurs

#### Évolutions futures
- ⭐ **Système d'évaluation** : Noter les partenaires après échange
- 📱 **Messagerie instantanée** : Communication en temps réel
- 🔍 **Recherche avancée** : Filtres par localisation, disponibilités
- 🔔 **Notifications** : Alertes pour messages, évaluations
- 🚫 **Système de blocage** : Contrôle des interactions
- 👮 **Back-office administrateur** : Modération de la plateforme

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

Les variables d'environnement sont utilisées pour :
- **Sécurité** : Stocker les secrets (JWT, clés API) de manière sécurisée
- **Configuration** : Adapter l'application selon l'environnement (dev/prod)
- **Base de données** : Paramètres de connexion PostgreSQL
- **Services externes** : Clés d'API pour les services tiers

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

# Clé API Resend (pour l'envoi d'emails)
RESEND_API_KEY=your_resend_api_key
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
docker-compose up -d

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
docker-compose up -d --build
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

### Principales routes

#### Authentification
- `POST /api/auth/register` - Création de compte
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion

#### Utilisateurs
- `GET /api/users` - Liste des utilisateurs
- `GET /api/users/me` - Profil utilisateur connecté
- `PATCH /api/users/:id` - Mise à jour du profil

#### Compétences
- `GET /api/skills` - Liste des compétences
- `GET /api/categories` - Liste des catégories

#### Conversations
- `GET /api/conversations` - Conversations de l'utilisateur
- `POST /api/conversations` - Créer une conversation
- `PATCH /api/conversations/:id` - Ajouter un message

## 🧪 Tests

### Tests Frontend

```bash
# Entrer dans le container frontend
docker-compose exec frontend bash

# Tests unitaires
npm test

# Tests en mode watch
npm run test:watch

# Tests e2e avec Cypress
npx cypress open
```

### Tests Backend

```bash
# Entrer dans le container API
docker-compose exec skill-swap-api bash

# Tests unitaires
npm test

# Tests avec coverage
npm run test:cov

# Tests e2e
npm run test:e2e

# Tests de charge avec Artillery
npm run artillery
```

## 🤝 Contribution

### Convention de code

Le projet utilise :
- **ESLint** : Pour la qualité du code
- **Prettier** : Pour le formatage automatique
- **Husky** : Pour les hooks Git (si configuré)

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

## 📄 Licence

Ce projet est sous licence privée - voir le fichier [LICENSE](LICENSE) pour plus de détails.

# 🛍️ E-Commerce Frontend - Application Mobile

Application frontend moderne développée avec Angular 18+ et Tailwind CSS pour une plateforme de vente en ligne avec capture photo obligatoire.

## 🚀 Fonctionnalités

### Pour tous les utilisateurs
- ✅ **Authentification** : Inscription et connexion sécurisées
- 📱 **Navigation responsive** : Interface adaptée mobile, tablette et desktop
- 🏠 **Liste des annonces** : Affichage des produits avec tri VIP prioritaire
- 👁️ **Détail d'annonce** : Vue complète avec informations vendeur
- 🔔 **Notifications** : Alertes d'expiration et de modération

### Pour les utilisateurs (USER/VIP)
- 📸 **Création d'annonce** : Capture photo obligatoire via caméra
- 📋 **Mes annonces** : Gestion de ses propres annonces
- ⭐ **Statut VIP** : Visibilité prioritaire des annonces

### Pour les modérateurs
- 🛡️ **Modération** : Approbation ou rejet des annonces
- 📊 **Dashboard** : Vue d'ensemble des annonces en attente

## 🛠️ Technologies

- **Framework** : Angular 18+ (Standalone Components)
- **Styling** : Tailwind CSS 4
- **State Management** : RxJS + Signals
- **HTTP Client** : Angular HttpClient avec intercepteurs
- **Routing** : Angular Router avec guards
- **Icons** : SVG inline

## 📦 Installation

```bash
cd front
npm install
```

## 🚀 Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## 📁 Structure du projet

```
front/
├── src/
│   ├── app/
│   │   ├── core/                    # Services, guards, interceptors
│   │   │   ├── guards/              # Route guards (auth, moderator, user)
│   │   │   ├── interceptors/        # HTTP interceptors (auth)
│   │   │   ├── models/              # Interfaces TypeScript
│   │   │   └── services/            # Services (auth, annonce, notification)
│   │   ├── features/                # Composants de fonctionnalités
│   │   │   ├── auth/                # Login, Register
│   │   │   ├── home/                # Liste des annonces
│   │   │   ├── annonce/             # Détail, Création
│   │   │   ├── profile/             # Profil utilisateur
│   │   │   ├── notifications/       # Notifications
│   │   │   └── moderation/          # Modération (moderators only)
│   │   ├── shared/                  # Composants partagés
│   │   │   ├── components/          # Navbar, etc.
│   │   │   └── pipes/               # Pipes (timeAgo)
│   │   ├── app.routes.ts            # Configuration des routes
│   │   └── app.config.ts            # Configuration de l'application
│   ├── environments/                # Variables d'environnement
│   └── styles.css                   # Styles globaux + Tailwind
├── tailwind.config.js               # Configuration Tailwind
└── package.json
```

## 🎨 Design System

### Couleurs
- **Primary** : Bleu moderne (#2563eb)
- **Secondary** : Vert succès (#10b981)
- **VIP** : Or (#f59e0b)
- **Danger** : Rouge (#ef4444)

### Composants réutilisables
- Cards
- Buttons (primary, secondary, danger)
- Input fields
- Badges (VIP, status)
- Loading spinners

## 🔐 Authentification

L'application utilise JWT Bearer Token pour l'authentification :
- **Access Token** : Stocké dans localStorage
- **Refresh Token** : Utilisé pour renouveler l'access token
- **Intercepteur HTTP** : Ajoute automatiquement le token aux requêtes
- **Guards** : Protègent les routes selon le rôle utilisateur

## 📱 Fonctionnalités spécifiques

### Capture photo obligatoire
- Utilise l'API native de capture photo du navigateur
- Compression automatique des images
- Conversion en base64 pour l'envoi au backend
- Pas d'import de fichiers (garantie de transparence)

### Système VIP
- Badge doré visible sur les annonces
- Tri prioritaire dans la liste
- Visibilité accrue

### Notifications
- Alertes d'expiration (2 jours avant)
- Notifications de modération (approuvée/rejetée)
- Badge avec compteur de non-lues
- Marquage comme lu

### Expiration automatique
- Les annonces expirent après 7 jours
- Notification envoyée 2 jours avant expiration
- Suppression automatique après expiration

## 📊 Routes de l'application

| Route | Accès | Description |
|-------|-------|-------------|
| `/` | Public | Liste des annonces |
| `/login` | Public | Connexion |
| `/register` | Public | Inscription |
| `/annonce/:id` | Public | Détail d'une annonce |
| `/annonce/create` | USER/VIP | Créer une annonce |
| `/profile` | Authentifié | Profil utilisateur |
| `/profile/annonces` | Authentifié | Mes annonces |
| `/notifications` | Authentifié | Notifications |
| `/moderation` | MODERATOR | Modération |

## 🌐 API Backend

L'application communique avec le backend sur `http://localhost:3000`

Endpoints principaux :
- `POST /auth/register` - Inscription
- `POST /auth/login` - Connexion
- `GET /annonce/list` - Liste des annonces
- `POST /annonce/create` - Créer une annonce
- `GET /notification` - Notifications
- `GET /annonce/pending` - Annonces en attente (moderator)
- `PATCH /annonce/moderate/:id` - Modérer une annonce (moderator)

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
# 🏗️ Architecture de l'application

## 📐 Vue d'ensemble

L'application est construite avec Angular 18+ en utilisant les **Standalone Components** (pas de modules NgModule). Elle suit une architecture en couches avec séparation claire des responsabilités.

## 🗂️ Structure des dossiers

```
src/app/
├── core/                           # Couche métier centrale
│   ├── guards/                     # Protection des routes
│   │   ├── auth.guard.ts          # Vérifie l'authentification
│   │   ├── moderator.guard.ts     # Vérifie le rôle modérateur
│   │   └── user.guard.ts          # Vérifie le rôle utilisateur
│   ├── interceptors/               # Intercepteurs HTTP
│   │   └── auth.interceptor.ts    # Ajoute le token JWT
│   ├── models/                     # Interfaces TypeScript
│   │   ├── user.model.ts          # User, Role, Auth
│   │   ├── annonce.model.ts       # Annonce, CreateAnnonce
│   │   └── notification.model.ts  # Notification
│   └── services/                   # Services métier
│       ├── auth.service.ts        # Authentification
│       ├── annonce.service.ts     # Gestion des annonces
│       ├── notification.service.ts # Notifications
│       └── camera.service.ts      # Capture photo
├── features/                       # Fonctionnalités par domaine
│   ├── auth/                      # Authentification
│   │   ├── login/                 # Page de connexion
│   │   └── register/              # Page d'inscription
│   ├── home/                      # Page d'accueil
│   │   └── home.component.*       # Liste des annonces
│   ├── annonce/                   # Gestion des annonces
│   │   ├── annonce-detail/        # Détail d'une annonce
│   │   └── annonce-create/        # Création d'annonce
│   ├── profile/                   # Profil utilisateur
│   │   └── profile.component.*    # Profil et mes annonces
│   ├── notifications/             # Notifications
│   │   └── notifications.component.*
│   └── moderation/                # Modération
│       └── moderation.component.* # Page de modération
├── shared/                        # Composants partagés
│   ├── components/                # Composants réutilisables
│   │   └── navbar/                # Barre de navigation
│   └── pipes/                     # Pipes personnalisés
│       └── time-ago.pipe.ts       # Format de date relatif
├── app.routes.ts                  # Configuration des routes
├── app.config.ts                  # Configuration de l'app
├── app.ts                         # Composant racine
└── app.html                       # Template racine
```

## 🔐 Flux d'authentification

```
1. Utilisateur → LoginComponent
2. LoginComponent → AuthService.login()
3. AuthService → Backend API (/auth/login)
4. Backend → Retourne { accessToken, refreshToken }
5. AuthService → Stocke les tokens dans localStorage
6. AuthService → Charge le profil utilisateur
7. AuthService → Met à jour currentUser$ (Observable)
8. Navigation → Route protégée
```

## 🛡️ Protection des routes

### Guards disponibles

1. **authGuard** : Vérifie que l'utilisateur est connecté
2. **moderatorGuard** : Vérifie que l'utilisateur est modérateur
3. **userGuard** : Vérifie que l'utilisateur n'est PAS modérateur

### Exemple d'utilisation

```typescript
{
  path: 'annonce/create',
  canActivate: [authGuard, userGuard],
  loadComponent: () => import('./features/annonce/annonce-create/...')
}
```

## 🔄 Gestion de l'état

L'application utilise une combinaison de :

### 1. RxJS Observables
- `AuthService.currentUser$` : Observable du user connecté
- Communication entre composants
- Gestion des requêtes HTTP

### 2. Angular Signals
- `loading = signal(false)` : États de chargement
- `error = signal<string | null>(null)` : Gestion des erreurs
- `notifications = signal<Notification[]>([])` : Données réactives

### Avantages
- **Observables** : Asynchrone, composable, puissant
- **Signals** : Réactif, performant, simple

## 📡 Communication avec l'API

### Intercepteur HTTP

Toutes les requêtes HTTP passent par `authInterceptor` qui :
1. Ajoute le token JWT dans le header `Authorization`
2. Gère le refresh du token en cas d'expiration (401)
3. Redirige vers `/login` si le refresh échoue

### Services API

Chaque service encapsule les appels API :

```typescript
// AnnonceService
getAll(): Observable<Annonce[]>
getById(id: string): Observable<Annonce>
create(data: CreateAnnonceRequest): Observable<CreateAnnonceResponse>
getPending(): Observable<Annonce[]>
moderate(id: string, action: 'approve' | 'reject'): Observable<{message: string}>
```

## 🎨 Système de design

### Tailwind CSS

Configuration dans `tailwind.config.js` :
- Couleurs personnalisées (primary, secondary, vip)
- Font family (Inter)
- Classes utilitaires

### Classes réutilisables

Définies dans `src/styles.css` :
```css
.btn-primary { /* ... */ }
.btn-secondary { /* ... */ }
.input-field { /* ... */ }
.card { /* ... */ }
.badge-vip { /* ... */ }
```

## 📸 Capture photo

### CameraService

```typescript
async capturePhoto(): Promise<string> {
  // 1. Ouvre le sélecteur de fichier avec capture="environment"
  // 2. Lit le fichier sélectionné
  // 3. Valide la taille (max 5MB)
  // 4. Compresse l'image (800x600, quality 0.8)
  // 5. Retourne le base64
}
```

### Utilisation

```typescript
const imageBase64 = await this.cameraService.capturePhoto();
this.annonceService.create({
  title: '...',
  description: '...',
  price: 100,
  imageBase64
});
```

## 🔔 Système de notifications

### NotificationService

- Charge les notifications depuis l'API
- Maintient un compteur de non-lues (Signal)
- Permet de marquer comme lu

### Affichage

- Badge dans la navbar avec compteur
- Page dédiée `/notifications`
- Mise à jour en temps réel via Signals

## 🚦 Routing

### Lazy Loading

Toutes les routes utilisent le lazy loading :

```typescript
{
  path: 'home',
  loadComponent: () => import('./features/home/home.component')
    .then(m => m.HomeComponent)
}
```

### Avantages
- Chargement initial plus rapide
- Meilleure performance
- Code splitting automatique

## 🎯 Bonnes pratiques appliquées

1. ✅ **Standalone Components** : Pas de NgModule
2. ✅ **Lazy Loading** : Toutes les routes
3. ✅ **Signals** : État réactif moderne
4. ✅ **TypeScript strict** : Typage fort
5. ✅ **Guards** : Protection des routes
6. ✅ **Interceptors** : Gestion centralisée HTTP
7. ✅ **Services** : Logique métier séparée
8. ✅ **Pipes** : Transformation de données
9. ✅ **Responsive** : Mobile-first avec Tailwind
10. ✅ **Accessibilité** : Sémantique HTML

## 🔧 Extension de l'application

### Ajouter une nouvelle fonctionnalité

1. Créer le composant dans `features/`
2. Créer le service dans `core/services/` si nécessaire
3. Ajouter le modèle dans `core/models/`
4. Configurer la route dans `app.routes.ts`
5. Ajouter le guard si nécessaire

### Exemple : Ajouter une page "Favoris"

```typescript
// 1. Créer le composant
features/favorites/favorites.component.ts

// 2. Créer le service
core/services/favorite.service.ts

// 3. Ajouter le modèle
core/models/favorite.model.ts

// 4. Ajouter la route
{
  path: 'favorites',
  canActivate: [authGuard],
  loadComponent: () => import('./features/favorites/...')
}
```

## 📊 Performance

### Optimisations appliquées

1. **Lazy Loading** : Chargement à la demande
2. **OnPush Change Detection** : Possible avec Signals
3. **TrackBy** : Dans les *ngFor
4. **Compression d'images** : Avant upload
5. **HTTP Caching** : Via intercepteurs (à implémenter)

## 🧪 Tests

### Structure des tests

```typescript
describe('AuthService', () => {
  it('should login successfully', () => {
    // Test
  });
});
```

### Commandes

```bash
npm test              # Tests unitaires
npm run test:coverage # Couverture de code
```

## 📝 Conventions de code

1. **Nommage** : camelCase pour variables, PascalCase pour classes
2. **Fichiers** : kebab-case (auth.service.ts)
3. **Composants** : Suffixe Component (LoginComponent)
4. **Services** : Suffixe Service (AuthService)
5. **Interfaces** : Préfixe I optionnel (User ou IUser)
6. **Types** : PascalCase (Role, Annonce)

## 🔮 Évolutions futures

- [ ] WebSocket pour notifications en temps réel
- [ ] PWA (Progressive Web App)
- [ ] Mode hors ligne
- [ ] Internationalisation (i18n)
- [ ] Tests E2E avec Playwright
- [ ] Storybook pour les composants
- [ ] Analytics et monitoring
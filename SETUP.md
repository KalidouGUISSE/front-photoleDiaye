# 🚀 Guide de démarrage rapide

## ✅ Prérequis

- Node.js 18+ installé
- Backend démarré sur `http://localhost:3000`

## 📦 Installation

```bash
cd front
npm install
```

## 🎯 Démarrage

```bash
npm start
```

L'application sera accessible sur `http://localhost:4200`

## 👥 Comptes de test

Pour tester l'application, vous devez créer des comptes via l'interface ou utiliser les comptes existants dans votre backend.

### Créer un compte utilisateur
1. Allez sur `/register`
2. Créez un compte avec email et mot de passe
3. Connectez-vous sur `/login`

### Créer un compte modérateur
Les modérateurs doivent être créés via le backend (voir documentation backend).

## 🎨 Fonctionnalités à tester

### En tant qu'utilisateur (USER/VIP)
1. ✅ Créer une annonce avec capture photo (`/annonce/create`)
2. ✅ Voir ses annonces (`/profile/annonces`)
3. ✅ Consulter les notifications (`/notifications`)
4. ✅ Voir le détail d'une annonce

### En tant que modérateur
1. ✅ Accéder à la page de modération (`/moderation`)
2. ✅ Approuver ou rejeter des annonces
3. ✅ Voir les annonces en attente

## 🔧 Configuration

L'URL du backend est configurée dans `src/environments/environment.ts` :

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'
};
```

## 📱 Navigation

- **Page d'accueil** : `/` - Liste des annonces
- **Connexion** : `/login`
- **Inscription** : `/register`
- **Créer une annonce** : `/annonce/create` (USER/VIP uniquement)
- **Mon profil** : `/profile`
- **Mes annonces** : `/profile/annonces`
- **Notifications** : `/notifications`
- **Modération** : `/moderation` (MODERATOR uniquement)

## 🐛 Dépannage

### Le backend n'est pas accessible
- Vérifiez que le backend est démarré sur le port 3000
- Vérifiez l'URL dans `environment.ts`

### Erreur de compilation
- Supprimez `node_modules` et `package-lock.json`
- Réinstallez : `npm install`

### Les styles ne s'appliquent pas
- Vérifiez que Tailwind CSS est bien installé
- Vérifiez que `@tailwind` est présent dans `src/styles.css`

## 📚 Documentation complète

Consultez le fichier `README.md` pour plus d'informations sur l'architecture et les fonctionnalités.
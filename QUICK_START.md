# ⚡ Démarrage Ultra-Rapide

## 🎯 En 3 étapes

### 1️⃣ Installation (2 minutes)
```bash
cd front
npm install
```

### 2️⃣ Démarrage (30 secondes)
```bash
npm start
```
➡️ Ouvrez `http://localhost:4200`

### 3️⃣ Test (5 minutes)
1. Créez un compte sur `/register`
2. Connectez-vous sur `/login`
3. Créez une annonce sur `/annonce/create`
4. Consultez vos annonces sur `/profile/annonces`

## ✅ Checklist de vérification

- [ ] Backend démarré sur `http://localhost:3000`
- [ ] Node.js 18+ installé
- [ ] `npm install` exécuté sans erreur
- [ ] Application accessible sur `http://localhost:4200`

## 🎨 Aperçu des pages

### Pages publiques
- **/** - Liste des annonces (tri VIP prioritaire)
- **/login** - Connexion
- **/register** - Inscription
- **/annonce/:id** - Détail d'une annonce

### Pages utilisateur (USER/VIP)
- **/annonce/create** - Créer une annonce avec photo
- **/profile** - Mon profil
- **/profile/annonces** - Mes annonces
- **/notifications** - Mes notifications

### Pages modérateur
- **/moderation** - Approuver/Rejeter les annonces

## 🔑 Comptes de test

### Créer un utilisateur normal
```
Email: user@test.com
Password: password123
```

### Créer un modérateur
Les modérateurs doivent être créés via le backend.
Consultez la documentation backend pour plus d'infos.

## 🚀 Fonctionnalités clés

### ✨ Capture photo obligatoire
- Cliquez sur "Prendre une photo" lors de la création d'annonce
- La photo est automatiquement compressée
- Pas d'import de fichiers (transparence garantie)

### ⭐ Système VIP
- Les annonces VIP apparaissent en premier
- Badge doré visible
- Visibilité accrue

### 🔔 Notifications
- Alertes d'expiration (2 jours avant)
- Notifications de modération
- Badge avec compteur dans la navbar

### ⏰ Expiration automatique
- Les annonces expirent après 7 jours
- Notification envoyée 2 jours avant
- Suppression automatique

## 🎯 Scénarios de test

### Scénario 1 : Utilisateur normal
1. Inscription → Login
2. Créer une annonce avec photo
3. Voir l'annonce en attente de modération
4. Consulter les notifications

### Scénario 2 : Modérateur
1. Login avec compte modérateur
2. Aller sur `/moderation`
3. Approuver ou rejeter des annonces
4. Vérifier que les annonces approuvées apparaissent sur la page d'accueil

### Scénario 3 : Navigation publique
1. Consulter la liste des annonces
2. Cliquer sur une annonce pour voir les détails
3. Voir les informations du vendeur
4. Contacter le vendeur par email

## 🐛 Problèmes courants

### Erreur "Cannot connect to backend"
➡️ Vérifiez que le backend est démarré sur le port 3000

### Les styles ne s'affichent pas
➡️ Vérifiez que Tailwind CSS est installé : `npm list tailwindcss`

### Erreur de compilation TypeScript
➡️ Supprimez `node_modules` et réinstallez : `rm -rf node_modules && npm install`

### La capture photo ne fonctionne pas
➡️ Utilisez HTTPS ou localhost (requis pour l'API caméra)

## 📚 Documentation

- **README.md** - Documentation complète
- **ARCHITECTURE.md** - Architecture technique
- **SETUP.md** - Guide d'installation détaillé

## 💡 Conseils

1. **Utilisez Chrome/Firefox** pour une meilleure compatibilité
2. **Activez les DevTools** pour voir les requêtes HTTP
3. **Consultez la console** en cas d'erreur
4. **Testez sur mobile** pour voir le responsive design

## 🎉 C'est parti !

Vous êtes prêt à utiliser l'application. Bon développement ! 🚀
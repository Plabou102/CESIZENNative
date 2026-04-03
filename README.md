# CESIZen — Application Mobile

> Application mobile du projet CESIZen — L'application de votre santé mentale  
> Bloc 2 — Titre Concepteur Développeur d'Applications (CESI)

## Stack technique

- **Framework** : React Native 0.81
- **Plateforme** : Expo SDK 54
- **Navigation** : Expo Router 6 (file-based routing)
- **HTTP** : Axios
- **Stockage sécurisé** : Expo SecureStore
- **Langage** : TypeScript

## Prérequis

- Node.js >= 18
- npm
- Expo Go installé sur votre téléphone (iOS ou Android)  
  ou un émulateur Android / simulateur iOS
- L'API CESIZen doit être accessible depuis le téléphone (voir [CESIZENAPI](https://github.com/Plabou102/CESIZENAPI))

## Installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/Plabou102/CESIZENNative
cd CESIZENNative

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env
# Remplir les valeurs dans .env
```

## Variables d'environnement

Créer un fichier `.env` à la racine :

```env
EXPO_PUBLIC_API_URL=http://VOTRE_IP_LOCALE:3001
```

> ⚠️ Remplacez `VOTRE_IP_LOCALE` par l'adresse IP de votre machine sur le réseau local (ex: `192.168.1.42`). `localhost` ne fonctionne pas depuis un téléphone physique.

Pour trouver votre IP sur Windows :
```bash
ipconfig
# Chercher "Adresse IPv4" sous votre carte réseau Wi-Fi
```

## Lancement

```bash
# Démarrer Expo
npm start

# Ou directement sur Android
npm run android

# Ou sur iOS
npm run ios
```

Scannez le QR code affiché avec l'application **Expo Go** sur votre téléphone.

## Fonctionnalités

### Authentification
- Connexion avec email et mot de passe
- Inscription d'un nouveau compte
- Token stocké de façon sécurisée (Expo SecureStore)
- Redirection automatique vers le login si non authentifié

### Accueil
- Présentation de l'application
- Accès rapide aux modules Informations et Exercices de respiration

### Informations
- Liste des articles de santé mentale publiés
- Détail complet d'un article avec catégorie et contenu

### Exercices de respiration
- Liste des exercices de cohérence cardiaque disponibles
- Affichage des durées par phase (inspiration, apnée, expiration)
- Exercice animé avec cercle respiratoire et chronomètre
- Phases enchaînées automatiquement selon la configuration admin
- Possibilité d'arrêter l'exercice à tout moment

### Mon compte
- Affichage du profil (prénom, nom, email)
- Modification des informations personnelles
- Déconnexion

## Structure du projet

```
app/
├── (auth)/
│   ├── login.tsx       # Page de connexion
│   ├── register.tsx    # Page d'inscription
│   └── _layout.tsx
├── (app)/
│   ├── index.tsx       # Accueil
│   ├── account.tsx     # Mon compte
│   ├── informations/
│   │   ├── index.tsx   # Liste des informations
│   │   └── [id].tsx    # Détail d'une information
│   ├── breathing/
│   │   ├── index.tsx   # Liste des exercices
│   │   └── [id].tsx    # Exercice animé
│   └── _layout.tsx     # Tab bar navigation
└── _layout.tsx         # Root layout + auth guard
assets/
├── images/
│   ├── logo1.png       # Icône CESIZen
│   └── logo2.png       # Nom CESIZen
constants/
└── theme.ts            # Système de design (couleurs, spacing, typo)
services/
└── api.ts              # Client Axios configuré
```

## Auteur

Adame Boussaida — Projet CDA CESI 2025/2026

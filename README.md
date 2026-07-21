# Snack Dyali

Application fullstack CRUD pour gérer le menu d'un snack (Hamid, Béni Mellal) : ajouter, modifier, supprimer des plats, avec synchronisation en arrière-plan côté mobile pour garder le menu à jour même hors ligne.

Projet réalisé dans le cadre du brief **"Snack Dyali"** (Node.js/Express/PostgreSQL + React Native/Expo).

## Stack technique

| Couche | Techno |
|---|---|
| Backend | Node.js (ESM), Express |
| Base de données | PostgreSQL (Sequelize ORM) |
| Doc API | OpenAPI + Scalar UI (`@scalar/express-api-reference`) |
| Mobile | React Native + Expo (SDK 54), Expo Router |
| Requêtes HTTP | Axios |
| Données serveur | TanStack Query (`@tanstack/react-query`) |
| Tâche de fond | `expo-task-manager` + `expo-background-task` |
| Cache local | `@react-native-async-storage/async-storage` |

## Structure du dépôt

```
Snack-Dyali/
├── backend/
│   ├── .env
│   ├── init.sql              # script de création + seed de la table `plats`
│   ├── openapi.json          # spécification OpenAPI (F7)
│   ├── package.json
│   └── src/
│       ├── config/db.js      # connexion Sequelize
│       ├── controllers/plats.controller.js
│       ├── models/plat.js
│       └── routes/plats.routes.js
│   └── server.js             # point d'entrée Express (+ /docs Scalar UI)
├── mobile/                   # app Expo (Expo Router)
│   ├── app/
│   │   ├── _layout.tsx       # QueryClientProvider + Stack
│   │   ├── index.tsx         # écran Liste
│   │   ├── form.tsx          # ajout/édition (?id=)
│   │   └── plat/[id].tsx     # écran Détail (optionnel)
│   ├── src/
│   │   ├── api/axios.js      # instance Axios
│   │   ├── api/plats.js      # getPlats, createPlat, updatePlat, deletePlat
│   │   └── hooks/usePlats.js # hooks TanStack Query (useQuery / useMutation)
│   └── package.json
└── docs/
    └── class-diagram.md      # diagramme de classes (architecture backend, Jour 1)
```

## Modèle de données

Une seule table : `plats`

| Colonne | Type | Contrainte |
|---|---|---|
| id | SERIAL | PRIMARY KEY |
| nom | VARCHAR(100) | NOT NULL |
| prix | NUMERIC(6,2) | NOT NULL |
| categorie | VARCHAR(50) | NOT NULL |
| disponible | BOOLEAN | DEFAULT true |
| created_at | TIMESTAMP | DEFAULT NOW() |

Script SQL complet : [`backend/init.sql`](backend/init.sql) (création de la table + 4 plats de seed : Tacos poulet, Panini viande, Jus avocat, Msemen).

Diagramme de classes de l'architecture backend : [`docs/class-diagram.md`](docs/class-diagram.md).

## Installation

### 1. Base de données

```bash
psql -U postgres -c "CREATE DATABASE snack_dyali;"
psql -U postgres -d snack_dyali -f backend/init.sql
```

Variables d'environnement (`backend/.env`) :

```
DATABASE_URL=postgres://snack:snack123@localhost:5432/snack_dyali
PORT=3000
```

### 2. Backend

```bash
cd backend
npm install
npm run dev   # node --watch server.js
```

Documentation interactive une fois lancé : **http://localhost:3000/docs**

### 3. Mobile (Expo)

```bash
cd mobile
npm install
npm run start   # expo start
```

## API — Endpoints

Base URL : `http://localhost:3000`

| Méthode | Route | Description | Succès | Erreurs |
|---|---|---|---|---|
| GET | `/api/plats` | Liste tous les plats | 200 | — |
| GET | `/api/plats/:id` | Détail d'un plat | 200 | 404 si introuvable |
| POST | `/api/plats` | Créer un plat | 201 | 400 si données invalides |
| PUT | `/api/plats/:id` | Modifier un plat | 200 | 400 / 404 |
| DELETE | `/api/plats/:id` | Supprimer un plat | 204 | 404 |
| GET | `/docs` | Documentation interactive Scalar UI | 200 | — |

Toutes les réponses sont en JSON. Spécification complète : [`backend/openapi.json`](backend/openapi.json).

## Synchronisation en arrière-plan (fonctionnalité principale ⭐)

Objectif : garder le menu à jour même quand le réseau du snack est instable ou coupé.

1. Une tâche est enregistrée avec `expo-task-manager` et planifiée avec `expo-background-task` (intervalle minimum autorisé par l'OS).
2. À chaque exécution, la tâche appelle `GET /api/plats` via Axios, puis sauvegarde le JSON reçu et un timestamp dans `AsyncStorage`.
3. Au démarrage de l'app : si le réseau échoue, l'écran Liste affiche les données du cache `AsyncStorage` avec un bandeau **"Mode hors-ligne"**.
4. L'écran Liste affiche toujours **"Dernière synchro : il y a X min"**, calculé à partir du timestamp stocké.
5. Un bouton **"Forcer la synchro"** permet de déclencher manuellement la même fonction de sync (les tâches de fond OS ne sont pas garanties à l'heure près).

*Pas encore implémenté — voir le statut d'avancement ci-dessous.*

## Écrans mobile

- **Liste** (`app/index.tsx`) — tous les plats (nom, prix, catégorie, badge disponible/indisponible), bouton flottant `+`, bandeau de synchro + bouton "Forcer la synchro" (à venir)
- **Formulaire** (`app/form.tsx`) — même composant pour ajout et modification (pré-rempli en mode édition via `?id=`)
- **Détail** (`app/plat/[id].tsx`, optionnel) — infos complètes + boutons Modifier / Supprimer

## Statut d'avancement

**Backend**
- [x] Connexion PostgreSQL via Docker (`docker-compose`, testée via Postman)
- [ ] `src/config/db.js` — connexion Sequelize (en cours, bug connu : `Sequelize` non importé correctement)
- [ ] `src/models/plat.js` — modèle Sequelize `Plat`
- [ ] `src/controllers/plats.controller.js` — 5 fonctions CRUD
- [ ] `src/routes/plats.routes.js` — 5 routes
- [x] `openapi.json` — spécification complète (F7)
- [x] `/docs` — Scalar UI exposé sur `server.js`

**Mobile**
- [x] Structure `app/` + `src/` en place (Expo Router, TanStack Query, Axios)
- [ ] F1 — Lister les plats
- [ ] F2 — Ajouter un plat
- [ ] F3 — Modifier un plat
- [ ] F4 — Supprimer un plat
- [ ] F5 — Toggle disponibilité
- [ ] F6 — Sync en arrière-plan ⭐

> ⚠️ Règle d'or du brief : ne pas commencer/finaliser le mobile avant que l'API (`/api/plats`) soit terminée, testée et documentée sur `/docs`.

## Auteur

Mohamed Harboulic

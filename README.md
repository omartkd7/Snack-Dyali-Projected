# Snack Dyali

Application fullstack CRUD pour gérer le menu d'un snack (Hamid, Béni Mellal) : ajouter, modifier, supprimer des plats, avec synchronisation en arrière-plan côté mobile pour garder le menu à jour même hors ligne.

Projet réalisé dans le cadre du brief **"Snack Dyali"** (Node.js/Express/PostgreSQL + React Native/Expo).

## Stack technique

| Couche | Techno |
|---|---|
| Backend | Node.js, Express |
| Base de données | PostgreSQL (Sequelize ORM) |
| Doc API | OpenAPI + Scalar UI (`@scalar/express-api-reference`) |
| Mobile | React Native + Expo, Expo Router |
| Requêtes HTTP | Axios |
| Données serveur | TanStack Query (`@tanstack/react-query`) |
| Tâche de fond | `expo-task-manager` + `expo-background-task` |
| Cache local | `@react-native-async-storage/async-storage` |

## Structure du dépôt

```
Snack-Dyali/
├── backend/           # API Express + PostgreSQL
│   ├── .env
│   ├── init.sql       # script de création + seed de la table `plats`
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── config/db.js
│       ├── controllers/plats.controller.js
│       ├── models/plat.js
│       └── routes/plats.routes.js
├── mobile/            # app Expo (à venir)
├── App.tsx            # scaffold Expo actuel (racine)
├── app.json
└── index.ts
```

> ⚠️ Le brief demande deux dossiers `backend/` et `mobile/` à la racine. Le scaffold Expo initial (`App.tsx`, `index.ts`, `app.json`) est pour l'instant à la racine du dépôt — à déplacer dans `mobile/` au fur et à mesure de la construction de l'app.

## Diagramme de classes — Backend (Jour 1)

Première version de l'architecture backend à construire aujourd'hui : connexion DB → modèle `Plat` → controller → routes → app Express.

Voir le diagramme : [`docs/class-diagram.md`](docs/class-diagram.md)

**Tâches du jour 1 (backend) :**

1. `backend/src/config/db.js` — instancier Sequelize avec `DATABASE_URL` (`.env`) et exporter la connexion
2. `backend/src/models/plat.js` — définir le modèle `Plat` (mêmes colonnes que [`init.sql`](backend/init.sql))
3. `backend/src/controllers/plats.controller.js` — 5 fonctions CRUD (`getAllPlats`, `getPlatById`, `createPlat`, `updatePlat`, `deletePlat`) avec gestion des codes 200/201/204/400/404
4. `backend/src/routes/plats.routes.js` — brancher les 5 routes sur le controller
5. `backend/src/app.js` — app Express (`cors`, `express.json()`, montage des routes, `app.listen(PORT)`)
6. `backend/package.json` — dépendances (`express`, `sequelize`, `pg`, `cors`, `dotenv`) + scripts (`start`, `dev` avec `nodemon`)

Objectif de fin de journée : `GET /api/plats` répond en JSON avec les 4 plats du seed.

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

Script SQL : [`backend/init.sql`](backend/init.sql) (création de la table + 4 plats de seed).

## Installation

### 1. Base de données

```bash
# créer la base et l'utilisateur (adapter selon ton installation locale de PostgreSQL)
psql -U postgres -c "CREATE DATABASE snack_dyali;"
psql -U postgres -d snack_dyali -f backend/init.sql
```

### 2. Backend

```bash
cd backend
npm install
```

Variables d'environnement (`backend/.env`) :

```
DATABASE_URL=postgres://snack:snack123@localhost:5432/snack_dyali
PORT=3000
```

Lancer le serveur :

```bash
npm run dev   # avec nodemon (à ajouter dans backend/package.json)
```

### 3. Mobile (Expo)

```bash
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

Toutes les réponses sont en JSON. Documentation interactive complète disponible sur : **`/docs`** une fois le backend lancé.

## Synchronisation en arrière-plan (fonctionnalité principale ⭐)

Objectif : garder le menu à jour même quand le réseau du snack est instable ou coupé.

1. Une tâche est enregistrée avec `expo-task-manager` et planifiée avec `expo-background-task` (intervalle minimum autorisé par l'OS).
2. À chaque exécution, la tâche appelle `GET /api/plats` via Axios, puis sauvegarde le JSON reçu et un timestamp dans `AsyncStorage`.
3. Au démarrage de l'app : si le réseau échoue, l'écran Liste affiche les données du cache `AsyncStorage` avec un bandeau **"Mode hors-ligne"**.
4. L'écran Liste affiche toujours **"Dernière synchro : il y a X min"**, calculé à partir du timestamp stocké.
5. Un bouton **"Forcer la synchro"** permet de déclencher manuellement la même fonction de sync (les tâches de fond OS ne sont pas garanties à l'heure près).

## Écrans mobile

- **Liste** — tous les plats (nom, prix, catégorie, badge disponible/indisponible), bouton flottant `+`, bandeau de synchro + bouton "Forcer la synchro"
- **Formulaire** — même composant pour ajout et modification (pré-rempli en mode édition)
- **Détail** (optionnel) — infos complètes + boutons Modifier / Supprimer

## Statut d'avancement

- [ ] F1 — Lister les plats
- [ ] F2 — Ajouter un plat
- [ ] F3 — Modifier un plat
- [ ] F4 — Supprimer un plat
- [ ] F5 — Toggle disponibilité
- [ ] F6 — Sync en arrière-plan ⭐
- [ ] F7 — Documentation `/docs` (Scalar UI)

## Auteur

Mohamed Harboulic.

<div align="center">

<img src="assets/banner.svg" alt="Snack Dyali" width="100%"/>

<br/><br/>

**Application fullstack CRUD pour gérer le menu d'un snack**
_Ajouter, modifier et supprimer des plats — avec synchronisation en arrière-plan pour rester à jour même hors ligne._

<br/>

![Node.js](https://img.shields.io/badge/Node.js-ESM-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

![Expo](https://img.shields.io/badge/Expo-SDK%2054-000020?style=for-the-badge&logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

</div>

---

> 🧾 Projet réalisé dans le cadre du brief **« Snack Dyali »** — Hamid, un snackeur de Béni Mellal, gère encore son menu sur un carnet. Cette app lui permet de le gérer depuis son téléphone, même avec une connexion instable.

## 📑 Sommaire

- [Stack technique](#-stack-technique)
- [Architecture](#-architecture)
- [Structure du dépôt](#-structure-du-dépôt)
- [Modèle de données](#-modèle-de-données)
- [Installation](#-installation)
- [API — Endpoints](#-api--endpoints)
- [Synchronisation en arrière-plan ⭐](#-synchronisation-en-arrière-plan-fonctionnalité-principale-)
- [Écrans mobile](#-écrans-mobile)
- [Aperçu / Screenshots](#-aperçu--screenshots)
- [Statut d'avancement](#-statut-davancement)
- [Auteur](#-auteur)

## 🛠️ Stack technique

| Couche | Techno |
|---|---|
| ⚙️ Backend | Node.js (ESM), Express |
| 🗄️ Base de données | PostgreSQL (Sequelize ORM), via Docker |
| 📖 Doc API | OpenAPI + Scalar UI (`@scalar/express-api-reference`) |
| 📱 Mobile | React Native + Expo (SDK 54), Expo Router |
| 🌐 Requêtes HTTP | Axios |
| 🔁 Données serveur | TanStack Query (`@tanstack/react-query`) |
| ⏱️ Tâche de fond | `expo-task-manager` + `expo-background-task` |
| 💾 Cache local | `@react-native-async-storage/async-storage` |

## 🏗️ Architecture

```mermaid
flowchart TB
    subgraph Mobile["📱 Mobile — React Native / Expo"]
        UI["Écrans (Expo Router)"] --> Hooks["Hooks TanStack Query"]
        Hooks --> AX["Instance Axios"]
        BG["⏱️ Background Task"] --> AX
        BG --> Cache["💾 AsyncStorage"]
    end
    AX -->|"HTTP JSON"| Server
    subgraph Backend["⚙️ Backend — Node / Express"]
        Server["server.js"] --> Routes["Routes"]
        Routes --> Ctrl["Controllers"]
        Ctrl --> Model["Modèle Sequelize"]
        Server --> Docs["📖 /docs (Scalar UI)"]
    end
    Model -->|"SQL"| DB[("🗄️ PostgreSQL")]
```

## 📂 Structure du dépôt

```
Snack-Dyali/
├── backend/
│   ├── .env
│   ├── init.sql              # script de création + seed de la table `plats`
│   ├── openapi.json          # spécification OpenAPI (F7)
│   ├── package.json
│   ├── server.js             # point d'entrée Express (+ /docs Scalar UI)
│   └── src/
│       ├── config/db.js      # connexion Sequelize
│       ├── controllers/plats.controller.js
│       ├── models/plat.js
│       └── routes/plats.routes.js
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

## 🧩 Modèle de données

Une seule table : **`plats`**

| Colonne | Type | Contrainte |
|---|---|---|
| `id` | `SERIAL` | 🔑 PRIMARY KEY |
| `nom` | `VARCHAR(100)` | NOT NULL |
| `prix` | `NUMERIC(6,2)` | NOT NULL |
| `categorie` | `VARCHAR(50)` | NOT NULL |
| `disponible` | `BOOLEAN` | DEFAULT `true` |
| `created_at` | `TIMESTAMP` | DEFAULT `NOW()` |

📜 Script SQL complet : [`backend/init.sql`](backend/init.sql) — création de la table + 4 plats de seed (Tacos poulet, Panini viande, Jus avocat, Msemen).
🗺️ Diagramme de classes de l'architecture backend : [`docs/class-diagram.md`](docs/class-diagram.md).

## 🚀 Installation

### 1️⃣ Base de données (Docker)

```bash
# Démarrer PostgreSQL dans un conteneur
docker run -d --name snack-db \
  -e POSTGRES_USER=snack \
  -e POSTGRES_PASSWORD=snack123 \
  -e POSTGRES_DB=snack_dyali \
  -p 5432:5432 \
  -v snack_pgdata:/var/lib/postgresql/data \
  postgres:16

# Créer la table + les données de seed
docker cp backend/init.sql snack-db:/init.sql
docker exec -it snack-db psql -U snack -d snack_dyali -f /init.sql
```

> 💡 Sans Docker ? `psql -U postgres -c "CREATE DATABASE snack_dyali;"` puis `psql -U postgres -d snack_dyali -f backend/init.sql`.

Variables d'environnement (`backend/.env`) :

```env
DATABASE_URL=postgres://snack:snack123@localhost:5432/snack_dyali
PORT=3000
```

### 2️⃣ Backend

```bash
cd backend
npm install
npm run dev   # node --watch server.js
```

📖 Documentation interactive une fois lancé : **http://localhost:3000/docs**

### 3️⃣ Mobile (Expo)

```bash
cd mobile
npm install
npm run start   # expo start
```

## 🔌 API — Endpoints

Base URL : `http://localhost:3000`

| Méthode | Route | Description | ✅ Succès | ⚠️ Erreurs |
|:---:|---|---|:---:|---|
| `GET` | `/api/plats` | Liste tous les plats | `200` | — |
| `GET` | `/api/plats/:id` | Détail d'un plat | `200` | `404` si introuvable |
| `POST` | `/api/plats` | Créer un plat | `201` | `400` si données invalides |
| `PUT` | `/api/plats/:id` | Modifier un plat | `200` | `400` / `404` |
| `DELETE` | `/api/plats/:id` | Supprimer un plat | `204` | `404` |
| `GET` | `/docs` | Documentation interactive Scalar UI | `200` | — |

Toutes les réponses sont en **JSON**. Spécification complète : [`backend/openapi.json`](backend/openapi.json).

## ⭐ Synchronisation en arrière-plan (fonctionnalité principale)

> 🎯 **Objectif :** garder le menu à jour même quand le réseau du snack est instable ou coupé.

```mermaid
flowchart LR
    T["⏱️ Tâche de fond<br/>(expo-background-task)"] -->|"GET /api/plats"| API["🖥️ API Express"]
    API -->|"JSON + timestamp"| AS["💾 AsyncStorage"]
    AS -->|"lecture du cache"| L["📱 Écran Liste"]
    L -.->|"réseau coupé"| OFF["🟠 Bandeau « Mode hors-ligne »"]
    BTN["🔄 Bouton « Forcer la synchro »"] -->|"même fonction sync"| API
```

1. Une tâche est enregistrée avec `expo-task-manager` et planifiée avec `expo-background-task` (intervalle minimum autorisé par l'OS).
2. À chaque exécution, la tâche appelle `GET /api/plats` via Axios, puis sauvegarde le JSON reçu et un timestamp dans `AsyncStorage`.
3. Au démarrage de l'app : si le réseau échoue, l'écran Liste affiche les données du cache avec un bandeau **« Mode hors-ligne »**.
4. L'écran Liste affiche toujours **« Dernière synchro : il y a X min »**, calculé à partir du timestamp stocké.
5. Un bouton **« Forcer la synchro »** déclenche manuellement la même fonction de sync (les tâches de fond OS ne sont pas garanties à l'heure près).

> _🚧 Pas encore implémenté — voir le [statut d'avancement](#-statut-davancement) ci-dessous._

## 📱 Écrans mobile

| Écran | Fichier | Contenu |
|---|---|---|
| 🧾 **Liste** | `app/index.tsx` | Tous les plats (nom, prix, catégorie, badge dispo/indispo), bouton flottant `+`, bandeau de synchro + bouton « Forcer la synchro » |
| ✏️ **Formulaire** | `app/form.tsx` | Même composant pour ajout et modification (pré-rempli en mode édition via `?id=`) |
| 🔍 **Détail** _(optionnel)_ | `app/plat/[id].tsx` | Infos complètes + boutons Modifier / Supprimer |

## 🖼️ Aperçu / Screenshots

> 📸 Ajoutez vos captures dans `assets/screenshots/` puis elles s'afficheront ici.

<div align="center">

| 🧾 Liste | ✏️ Formulaire | 🟠 Mode hors-ligne |
|:---:|:---:|:---:|
| <img src="assets/screenshots/liste.png" width="230" alt="Écran Liste"/> | <img src="assets/screenshots/form.png" width="230" alt="Écran Formulaire"/> | <img src="assets/screenshots/offline.png" width="230" alt="Mode hors-ligne"/> |

</div>

## 📊 Statut d'avancement

### ⚙️ Backend

- [x] Connexion PostgreSQL via Docker (`docker run`, testée via Postman)
- [ ] `src/config/db.js` — connexion Sequelize _(en cours, bug connu : `Sequelize` non importé correctement)_
- [ ] `src/models/plat.js` — modèle Sequelize `Plat`
- [ ] `src/controllers/plats.controller.js` — 5 fonctions CRUD
- [ ] `src/routes/plats.routes.js` — 5 routes
- [x] `openapi.json` — spécification complète (F7)
- [x] `/docs` — Scalar UI exposé sur `server.js`

### 📱 Mobile

- [x] Structure `app/` + `src/` en place (Expo Router, TanStack Query, Axios)
- [ ] F1 — Lister les plats
- [ ] F2 — Ajouter un plat
- [ ] F3 — Modifier un plat
- [ ] F4 — Supprimer un plat
- [ ] F5 — Toggle disponibilité
- [ ] F6 — Sync en arrière-plan ⭐

> ⚠️ **Règle d'or du brief :** ne pas finaliser le mobile avant que l'API (`/api/plats`) soit terminée, testée et documentée sur `/docs`.

## 👤 Auteur

**Mohamed Harboulic**

<div align="center">
<sub>Brief Snack Dyali — Développeur web et web mobile</sub>
</div>
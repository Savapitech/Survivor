# Installation

## Prérequis

- [Docker](https://docs.docker.com/get-docker/) et Docker Compose (chemin
  recommandé, ci-dessous), **ou** :
  - Node.js 22+ (les `Dockerfile` utilisent Node 26) et une instance
    PostgreSQL locale.

## Avec Docker (recommandé)

Depuis la racine du dépôt :

```bash
cp back/.env.example back/.env
docker compose up --build
```

Ceci démarre trois services (`docker-compose.yml`) :

| Service | Rôle | Port hôte |
| --- | --- | --- |
| `db` | PostgreSQL 16, initialisée avec le schéma et les données de démonstration (`db/init/`) | `5432` |
| `back` | API NestJS | `3000` |
| `front` | Interface React, servie par nginx, qui reverse-proxy `/api/` vers `back` | `8080` |

- Frontend : `http://localhost:8080`
- API : `http://localhost:3000`
- Documentation API interactive (Swagger) : `http://localhost:3000/docs`
- Vérification de l'état de l'API : `GET http://localhost:3000/health`

`back` attend que `db` réponde à son *healthcheck* avant de démarrer. Au
premier démarrage, PostgreSQL exécute les scripts de `db/init/` (schéma +
données de démonstration) ; au démarrage de l'API, les migrations en
attente sous `back/src/migrations/` sont appliquées automatiquement.

### Réinitialiser les données

Les données vivent dans les volumes Docker nommés `back_data` (stockage
des vidéos) et `db_data` (PostgreSQL). Pour repartir du jeu de
démonstration initial :

```bash
docker compose down -v
docker compose up --build
```

Ceci supprime toutes les données actuelles (comptes créés manuellement,
vidéos, etc.) et recharge le jeu de démonstration.

## Sans Docker

### Base de données

Une instance PostgreSQL locale, joignable via les variables `DB_*`
décrites ci-dessous. Le schéma et les données de démonstration ne sont
alors pas chargés automatiquement ; les migrations s'en chargent pour le
schéma (voir [`../back/README.md`](../back/README.md#migrations)) — pour
les données de démonstration, appliquez manuellement
`db/init/01-schema-demo.sql` sur votre base.

### Backend

```bash
cd back
cp .env.example .env   # adapter DB_HOST etc. si besoin
npm install
npm run start:dev
```

### Frontend

```bash
cd front
npm install
npm run dev
```

Le serveur de développement Vite tourne seul, sans le reverse-proxy
`/api/` fourni par nginx en Docker. Voir
[`../front/README.md`](../front/README.md#en-local-sans-docker) pour
joindre une API locale depuis ce mode.

## Variables d'environnement (`back/.env`)

Voir `back/.env.example`. Aucune valeur par défaut n'est adaptée à la
production, et aucun secret n'est commité dans le dépôt (`.env` est
gitignored).

| Variable | Rôle |
| --- | --- |
| `PORT` | Port d'écoute de l'API |
| `NODE_ENV` | `development` active `synchronize` (TypeORM régénère le schéma directement depuis les entités) ; toute autre valeur le désactive et s'appuie uniquement sur les migrations |
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | Connexion PostgreSQL |
| `JWT_SECRET` | Secret de signature des jetons d'authentification — à remplacer par une valeur propre à votre environnement, jamais celle fournie en exemple |
| `JWT_EXPIRES_IN` | Durée de validité d'un jeton, en secondes |

## Vérifier l'installation

```bash
curl http://localhost:3000/health
```

```jsonc
// base joignable
{ "status": "ok", "version": "0.0.1", "database": "up" }
```

Puis ouvrir `http://localhost:8080` et créer un compte via
« Commencer maintenant », ou se connecter avec un compte du jeu de
démonstration si vous êtes parti du flux Docker.

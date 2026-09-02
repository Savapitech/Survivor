# JibJob Backend

API du démonstrateur **JibJob**, développé pour le Ministère du Job
et Bonheur : mise en relation entre demandeurs d'emploi et recruteurs via
des profils vidéo courts et un questionnaire de certification
professionnelle.

## Stack

- [NestJS](https://nestjs.com) (TypeScript)
- [TypeORM](https://typeorm.io) + PostgreSQL
- Docker Compose pour l'environnement local — aucun compte ni service tiers
  requis pour faire tourner l'application

## Prérequis

- Node.js 22+ (le `Dockerfile` utilise Node 26)
- Docker, ou une instance PostgreSQL locale

## Démarrage

### Avec Docker (recommandé)

Depuis la racine du dépôt :

```bash
cp back/.env.example back/.env
docker compose up --build
```

L'API est disponible sur `http://localhost:3000`.

### En local, sans Docker

```bash
cd back
cp .env.example .env   # adapter DB_HOST etc. si besoin
npm install
npm run start:dev
```

Nécessite une base PostgreSQL joignable via les variables `DB_*` de `.env`.

## Variables d'environnement

Voir `.env.example`. Aucune valeur par défaut n'est adaptée à la
production, et aucun secret n'est commité dans le dépôt (`.env` est
gitignored).

| Variable | Rôle |
| --- | --- |
| `PORT` | Port d'écoute de l'API |
| `NODE_ENV` | `development` active `synchronize` (TypeORM régénère le schéma) ; `production` le désactive |
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | Connexion PostgreSQL |

## Structure

Un dossier par domaine métier sous `src/`, chacun avec ses
`*.controller.ts` / `*.service.ts` / `*.module.ts` / `entities/` :

- `users` — comptes (email, mot de passe haché, rôle)
- `seekers` — profils demandeurs d'emploi
- `recruiters` — profils recruteurs
- `competences`, `activity-sectors`, `localisations` — référentiels liés aux profils demandeurs
- `questionnaire` — questionnaire de certification (questions pondérées, tentatives, réponses)
- `interactions` — vues / contacts / favoris entre recruteurs et candidats
- `health` — supervision (voir ci-dessous)

## Health check

```
GET /health
```

Vérifie réellement l'état de la base (`SELECT 1`, timeout 2s) plutôt que de
toujours répondre 200 :

```jsonc
// base joignable — 200
{ "status": "ok", "version": "0.0.1", "database": "up" }

// base injoignable — 503
{ "status": "error", "version": "0.0.1", "database": "down" }
```

## Scripts

| Commande | Effet |
| --- | --- |
| `npm run start` | Démarre l'API |
| `npm run start:dev` | Démarre en watch mode |
| `npm run start:prod` | Démarre depuis `dist/` (après `npm run build`) |
| `npm run build` | Compile en TypeScript vers `dist/` |
| `npm run lint` | Lint via oxlint |
| `npm run format` | Formatte via Prettier |
| `npm test` | Tests unitaires (Jest) |
| `npm run test:e2e` | Tests end-to-end |

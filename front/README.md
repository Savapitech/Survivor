# Compétences+ Frontend

Interface web du démonstrateur **Compétences+**, développé pour le
Ministère du Job et Bonheur.

## Stack

- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vite.dev) (build et serveur de développement)
- [React Router](https://reactrouter.com) pour le routage
- Oxlint + Prettier pour le lint et le formatage

Aucune librairie de gestion d'état externe : l'état applicatif passe par
le contexte React (`src/context/`) et des hooks dédiés.

## Prérequis

- Node.js 22+ (le `Dockerfile` utilise Node 26)
- Une API backend joignable (voir [`../back/README.md`](../back/README.md))

## Démarrage

### Avec Docker (recommandé)

Depuis la racine du dépôt :

```bash
cp back/.env.example back/.env
docker compose up --build
```

Le frontend est servi sur `http://localhost:8080`. En production comme en
Docker, nginx sert les fichiers statiques et reverse-proxy `/api/` vers le
service backend (voir `nginx.conf`) : le frontend et l'API partagent donc
la même origine, ce que `src/api/http.ts` suppose (`window.location.host + '/api'`).

### En local, sans Docker

```bash
cd front
npm install
npm run dev
```

Le serveur de développement Vite tourne alors seul, sur son propre port
(par défaut `5173`), sans le reverse-proxy `/api/` de nginx. Pour qu'il
puisse joindre une API backend locale, ajoutez un proxy Vite vers
`http://localhost:3000` (option `server.proxy` dans `vite.config.ts`), ou
préférez le démarrage via Docker Compose ci-dessus pour tester
l'application dans son ensemble.

## Structure

```
src/
  api/          Client HTTP (fetch), un fichier par ressource (seekers, recruiters, interactions, ...)
  components/   Composants réutilisables (ui/, layout/, profile/, ...)
  context/      Contexte React : session utilisateur, annonces d'accessibilité
  hooks/        Hooks partagés (appels asynchrones, titre de page, compteurs non lus, ...)
  pages/        Une page par route, organisées par domaine (profile/, register/, admin/, questionnaire/)
  utils/        Fonctions utilitaires pures (formatage, validation)
  App.tsx       Déclaration des routes
```

### Client API (`src/api/`)

Toutes les requêtes passent par `apiFetch`/`apiUpload` (`src/api/http.ts`),
qui centralisent l'ajout du jeton d'authentification et la levée d'une
`ApiError` typée en cas d'échec. Chaque fichier de `src/api/` (`seekers.ts`,
`recruiters.ts`, `interactions.ts`, ...) expose des fonctions typées pour
une ressource donnée plutôt que d'appeler `fetch` directement depuis les
pages.

### Session (`src/context/SessionContext.tsx`)

La session (jeton, identifiant utilisateur, rôle) est conservée dans
`localStorage` sous la clé `SESSION_STORAGE_KEY` (`src/api/token.ts`) et
exposée via `useSession()` : `session`, `isSeeker`, `isRecruiter`,
`isAdmin`, `establishSession`, `logout`.

## Scripts

| Commande | Effet |
| --- | --- |
| `npm run dev` | Démarre le serveur de développement Vite |
| `npm run build` | Vérifie les types (`tsc -b`) puis build vers `dist/` |
| `npm run preview` | Sert le build de production localement |
| `npm run lint` | Lint via Oxlint |
| `npm run format` | Formatte via Prettier |

Il n'y a pas de suite de tests automatisés côté frontend à ce jour ; la
non-régression fonctionnelle est vérifiée manuellement dans le navigateur.

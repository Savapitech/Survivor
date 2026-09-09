# Contribuer

## Organisation du dépôt

`main` est la seule branche de référence. Le travail peut se faire
directement dessus pour une modification ciblée, ou sur une branche
dédiée suivie d'une pull request pour un changement plus large — dans
les deux cas, gardez un historique de commits lisible plutôt qu'un unique
gros commit.

## Messages de commit

Ce dépôt suit [Conventional Commits](https://www.conventionalcommits.org/) :

```
<type>(<scope>): <résumé>
```

Types utilisés dans l'historique de ce projet :

- `feat` — nouvelle fonctionnalité
- `fix` — correction de bug
- `perf` — amélioration de performance
- `refactor` — changement de structure sans changement de comportement
- `style` — changement qui n'affecte pas le sens du code (formatage, …)
- `test` — ajout ou correction de tests
- `docs` — documentation
- `chore` — tâche d'outillage/configuration sans impact fonctionnel
- `build` — changement affectant le build ou les dépendances
- `revert` — annulation d'un commit précédent

Scope : `back`, `front`, `db`, `compose`, `ci`, ou `back,front` quand un
même commit touche les deux services. Le scope peut être omis pour un
changement transverse au dépôt (ex. `chore: ...`).

Règles de forme :

- le résumé ne commence pas par une majuscule et ne se termine pas par un
  point ;
- il décrit ce que fait le commit, pas ce que vous avez « essayé de
  faire » ;
- un commit = un changement cohérent. Séparez un renommage, une
  correction de bug et l'ajout d'une fonctionnalité en plusieurs commits
  plutôt que de tout mélanger.

Exemples tirés de l'historique du dépôt :

```
feat(back): implement seekers module with filterable paginated feed
fix(back): harden video provider lookup against legacy/unknown providers
fix(back,front): enforce ownership on recruiter profile update/delete, add nav link
perf(back): add index on seeker(updatedAt, id)
```

Aucun hook ne rejette automatiquement un message mal formé à ce jour :
c'est une convention à respecter, pas un contrôle imposé par l'outillage.

## Avant de committer

Il n'y a pas de vérification automatique en CI sur le lint ou les tests à
ce jour (voir `.github/workflows/ci.yml`) : c'est donc à vous de les
lancer localement avant de pousser.

Backend (`back/`) :

```bash
npm run lint
npm test
npm run build
```

Frontend (`front/`) :

```bash
npm run lint
npm run build   # inclut la vérification des types (tsc -b)
```

Si votre changement touche une migration TypeORM, vérifiez qu'elle
s'applique proprement sur une base vide (`npm run migration:run` contre
une instance PostgreSQL neuve) avant de la committer — voir
[`../back/README.md`](../back/README.md#migrations).

## Pull requests

- Gardez une pull request centrée sur un seul sujet.
- Décrivez le *pourquoi* du changement, pas seulement le *quoi* — le
  diff montre déjà le quoi.
- Si le changement touche le jeu de données de démonstration
  (`db/init/01-schema-demo.sql`), vérifiez-le en relançant la stack à
  vide (`docker compose down -v && docker compose up --build`) avant de
  proposer la pull request.

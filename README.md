# Compétences+

Démonstrateur technique développé pour le Ministère du Job et Bonheur :
mise en relation entre demandeurs d'emploi et recruteurs via des profils
vidéo courts et un questionnaire de certification professionnelle.

Ce dépôt ne constitue pas un service public en exploitation.

## Stack

| Composant | Technologies |
| --- | --- |
| Backend (`back/`) | NestJS, TypeORM, PostgreSQL |
| Frontend (`front/`) | React, Vite, TypeScript, React Router |
| Environnement local | Docker Compose (backend, frontend, base de données) |

## Démarrage rapide

Prérequis : Docker.

```bash
cp back/.env.example back/.env
docker compose up --build
```

- Frontend : `http://localhost:8080`
- API : `http://localhost:3000`
- Documentation API (Swagger) : `http://localhost:3000/docs`

La base de données est initialisée avec un jeu de démonstration
(`db/init/01-schema-demo.sql`) : quelques profils candidats, un
recruteur, un compte administrateur, ainsi que le référentiel de
compétences, secteurs d'activité, localisations et questions de
certification.

Pour une installation détaillée (avec ou sans Docker, variables
d'environnement, réinitialisation des données) : voir
[`docs/INSTALLATION.md`](docs/INSTALLATION.md).

## Documentation

| Document | Contenu |
| --- | --- |
| [`docs/INSTALLATION.md`](docs/INSTALLATION.md) | Installation locale, avec ou sans Docker, variables d'environnement |
| [`docs/USAGE.md`](docs/USAGE.md) | Parcours fonctionnels : candidat, recruteur, administrateur |
| [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md) | Convention de commit, workflow de contribution |
| [`back/README.md`](back/README.md) | Détail du backend : structure, scripts, migrations |
| [`front/README.md`](front/README.md) | Détail du frontend : structure, scripts |
| `http://localhost:3000/docs` | Référence de l'API (Swagger), une fois l'API démarrée |

## Structure du dépôt

```
back/     API NestJS (voir back/README.md)
front/    Interface React (voir front/README.md)
db/init/  Schéma et données de démonstration chargés au premier démarrage de PostgreSQL
docs/     Documentation d'installation, d'utilisation et de contribution
```

## Fonctionnalités principales

- Inscription et authentification par rôle (candidat, recruteur,
  administrateur).
- Profil candidat avec vidéo de présentation (fichier hébergé ou lien
  YouTube/Vimeo), modérée avant publication.
- Questionnaire de certification pondéré, avec badge de certification
  affiché sur le profil.
- Catalogue de profils filtrable (compétences, secteurs d'activité,
  localisations) côté recruteur, avec favoris et prise de contact.
- Messagerie et notifications entre recruteurs et candidats.
- Retrait réversible d'un profil du catalogue et journal des
  consultations, à la main du candidat (conformité RGPD).
- Back-office administrateur : modération des vidéos, gestion des
  référentiels (compétences, secteurs, localisations), gestion du
  questionnaire et des comptes.

Le détail de ces parcours est décrit dans
[`docs/USAGE.md`](docs/USAGE.md).

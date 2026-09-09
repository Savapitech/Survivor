# Guide d'utilisation

Ce document décrit les parcours fonctionnels de Compétences+, par rôle.
Il suppose l'application démarrée (voir
[`INSTALLATION.md`](INSTALLATION.md)), accessible sur
`http://localhost:8080`.

Il existe trois rôles, fixés à l'inscription et déterminant la
navigation et les droits d'accès côté API : `seeker` (candidat),
`recruiter` (recruteur) et `admin`.

## Candidat (`seeker`)

1. **Inscription** (`/inscription/compte`) : email, mot de passe, date de
   naissance, puis choix du rôle candidat. L'inscription se poursuit par
   la sélection de compétences/secteurs/localisations, puis un dépôt de
   vidéo de présentation optionnel (fichier hébergé, ou lien
   YouTube/Vimeo).
2. **Vidéo** : une vidéo déposée passe par un statut `pending` jusqu'à sa
   modération par un administrateur (`approved` ou `rejected`, avec motif
   dans ce dernier cas). Elle n'est visible des recruteurs et du public
   qu'une fois approuvée.
3. **Certification** (`/questionnaire`) : questionnaire pondéré ; le
   score obtenu détermine l'attribution d'un badge de certification,
   affiché sur le profil (`/profils/:id`). Ce badge ne confère aucun
   droit ni avantage réglementaire.
4. **Profil** (`/profils/:id`) : modification (`/profils/:id/modifier`),
   suppression du compte, et retrait réversible du catalogue — le profil
   n'est alors plus visible des recruteurs (catalogue, recherche, lien
   direct) mais reste consultable et modifiable par son propriétaire, qui
   peut le republier à tout moment.
5. **Notifications** (`/notifications`) : vues, contacts et mises en
   favori reçus d'un recruteur, ainsi qu'un journal dédié des
   consultations de son profil (organisation et date, jamais l'identité
   de la personne physique côté recruteur ; les consultations sans compte
   recruteur connecté ne sont pas comptabilisées).
6. **Messagerie** (`/messagerie`) : échange avec les recruteurs l'ayant
   contacté.

## Recruteur (`recruiter`)

1. **Inscription** : identique au parcours candidat jusqu'au choix du
   rôle, suivi de la saisie du nom de l'entreprise.
2. **Catalogue** (`/flux`) : liste paginée des profils candidats
   certifiés et publiés, filtrable par compétences, secteurs d'activité
   et localisations. Chaque consultation d'un profil (`/profils/:id`) est
   journalisée (voir ci-dessus).
3. **Mise en relation** : mise en favori, contact direct (ouvre la
   messagerie), consultation de l'historique des candidats déjà
   consultés/contactés (`/candidats`).
4. **Entreprise** (`/mon-entreprise`) : modification de la fiche
   entreprise.

## Administrateur (`admin`)

Espace dédié sous `/admin`, protégé par le rôle `admin` côté API
(`@Roles(UserRole.ADMIN)`) :

- `/admin` — tableau de bord.
- `/admin/moderation` — validation ou rejet des vidéos déposées par les
  candidats (avec motif de rejet).
- `/admin/questionnaire` — gestion des questions de certification (ajout,
  pondération, activation).
- `/admin/competences`, `/admin/secteurs`, `/admin/localisations` —
  gestion des référentiels utilisés par les filtres et le profil
  candidat.
- `/admin/utilisateurs` — gestion des comptes.

Un compte administrateur ne peut pas être créé depuis le formulaire
d'inscription public ; il doit exister en base au préalable (le jeu de
démonstration Docker en fournit un, voir
[`INSTALLATION.md`](INSTALLATION.md)).

## Accessibilité

La page `/accessibilite` documente l'état de conformité de l'interface
(non conforme à ce stade).

# Francisation compatible et modernisation du bot Discord

## Objectif

Transformer Le Friturier en bot Discord francophone sans casser les usages existants. Les textes visibles par les utilisateurs, les logs, les embeds, le README et les descriptions Discord seront traduits en francais. Les noms de commandes slash, sous-commandes et options resteront stables dans cette premiere passe pour eviter une migration cassante.

## Contraintes

- Conserver les noms techniques actuels des commandes, sous-commandes et options.
- Corriger les textes mal encodes avant ou pendant la traduction.
- Garder les changements compatibles avec `discord.js` v14.
- Ne pas melanger grosse refonte et changements fonctionnels non necessaires.
- Respecter l'architecture existante tant que le decoupage n'est pas introduit fichier par fichier.

## Approche retenue

### 1. Stabilisation

- Corriger les bugs evidents reperes dans `messageCreate.js`, dont la reference a `cmdx` dans le bloc de custom command simple et la casse incorrecte `client.config.Discord`.
- Passer l'enregistrement REST des commandes en version v10.
- Corriger les messages/logs communs les plus centraux dans les helpers d'embed.
- Eviter les changements de schema ou de donnees MongoDB.

### 2. Francisation compatible

- Traduire les descriptions de slash commands dans `src/interactions/Command`.
- Traduire les messages utilisateur dans `src/commands`, `src/events`, `src/handlers` et les helpers communs.
- Conserver les noms slash existants comme `/moderation ban user`.
- Corriger les caracteres abimes dans les textes visibles, les embeds et les logs.
- Traduire le README et les metadonnees utilisateur de `package.json` sans changer les scripts.

### 3. Architecture bot Discord

- Extraire progressivement la logique de `interactionCreate.js` vers des routeurs specialises:
  - commandes slash et context menu;
  - boutons;
  - menus de selection;
  - verification;
  - tickets;
  - evenements planifies et rappels.
- Centraliser les messages recurrents dans un module de textes francais, par exemple `src/config/messages.fr.js`, lorsque cela reduit vraiment la duplication.
- Centraliser la creation des webhooks de logs pour eviter les `new WebhookClient` disperses.
- Simplifier les helpers comme `buttonReactions` avec des boucles/chunks au lieu de blocs repetes.

## Donnees et compatibilite

Aucune migration MongoDB n'est prevue. Les noms de champs existants, y compris les fautes historiques comme `Responce`, restent inchanges dans cette passe pour ne pas casser les donnees existantes.

## Gestion des erreurs

Les messages d'erreur generiques passent par les helpers `client.errNormal`, `client.errUsage`, `client.errMissingPerms`, `client.errNoPerms` et `client.errWait`. Les erreurs specifiques restent localisees dans les commandes, sauf lorsqu'une centralisation reduit une duplication claire.

## Verification

- Lancer au minimum `node --check` sur les fichiers modifies.
- Lancer un chargement local sans connexion Discord si possible pour detecter les erreurs de syntaxe.
- Verifier que les descriptions des slash commands serialisent encore avec `SlashCommandBuilder`.
- Ne pas lancer le bot en production depuis cette passe sans confirmation explicite.

## Hors perimetre

- Renommer les commandes slash, sous-commandes ou options.
- Changer les schemas MongoDB.
- Migrer le projet en TypeScript.
- Remplacer completement le systeme audio/Lavalink.
- Refaire toute la structure du projet en une seule passe.

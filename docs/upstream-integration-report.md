# Rapport d’intégration upstream

## Intégré sélectivement

- Passage de Discord.js vers `14.27.x`, sans fusion de la migration V11.
- Remplacement des réponses `fetchReply` par `withResponse` lorsque le résultat est réellement utilisé.
- Utilisation de `MessageFlags.Ephemeral` pour les réponses différées concernées.
- Correctifs musique : saut de piste, durée et progression.
- Suppression du comportement obsolète lié au message de vérification.
- Mises à jour ciblées de `axios`, `dotenv`, `moment-timezone`, `dompurify` et `libsodium-wrappers`.
- Durcissement des options numériques, des appels HTTP et des opérations économiques atomiques.

## Non intégré volontairement

- Fusion complète de `upstream/main`.
- Migration V11 des centaines de fichiers, car elle remplace ou renomme des fonctionnalités locales.
- Réécriture globale de toutes les commandes avant stabilisation du socle i18n.
- `npm audit fix --force`, car il impose des changements cassants dans des dépendances historiques (`sourcebin`, giveaways et puppeteer).

## Points à vérifier avant fusion

- Comparer les commits upstream restants avec les fichiers locaux `interactionCreate.js`, `embed.js`, musique et vérification.
- Relancer `npm test` et le chargement de toutes les commandes.
- Tester manuellement `withResponse`, les réponses éphémères et `/config language`.
- Revoir les vulnérabilités transitives restantes et décider lesquelles nécessitent une migration indépendante.

## Audit npm au 25 octobre 2026

`npm audit --omit=dev --audit-level=high` signale encore 69 vulnérabilités (5 faibles, 28 modérées, 29 hautes et 7 critiques). Les dépendances directes ciblées ont été mises à jour, mais plusieurs alertes proviennent de dépendances historiques imbriquées (`request`, `weather-js`, `sourcebin`, les plugins `erela`, `puppeteer` et `discord-giveaways`). `npm audit fix --force` est volontairement exclu car il propose des changements cassants.

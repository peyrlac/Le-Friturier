# Rapport d’intégration upstream

## Intégré sélectivement

- Passage de Discord.js vers `14.27.x`, sans fusion de la migration V11.
- Support `pinned channel` de la branche `upgrade` confirmé déjà présent dans `src/handlers/functions/channelSorter.js` et `src/events/client/clientReady.js`, y compris les threads et les forums.
- `package-lock.json` resynchronisé avec les dépendances sélectionnées de la branche d’intégration ; `npm ci --dry-run` confirme sa cohérence.
- Remplacement des réponses `fetchReply` par `withResponse` lorsque le résultat est réellement utilisé.
- Utilisation de `MessageFlags.Ephemeral` pour les réponses différées concernées.
- Correctifs musique : saut de piste, durée et progression.
- Suppression du comportement obsolète lié au message de vérification.
- Mises à jour ciblées de `axios`, `dotenv`, `moment-timezone`, `dompurify` et `libsodium-wrappers`.
- Durcissement des options numériques, des appels HTTP et des opérations économiques atomiques.

## Non intégré volontairement

- Fusion complète de `upstream/main`.
- Fusion complète de `upgrade`, car elle supprime le socle i18n et les modules async/localisés déjà intégrés ; les parties pinned channel utiles sont déjà identiques localement.
- Migration V11 des centaines de fichiers, car elle remplace ou renomme des fonctionnalités locales.
- Réécriture globale de toutes les commandes avant stabilisation du socle i18n.
- `npm audit fix --force`, car il impose des changements cassants dans des dépendances historiques (`sourcebin`, giveaways et puppeteer).

## Points à vérifier avant fusion

- Comparer les commits upstream restants avec les fichiers locaux `interactionCreate.js`, `embed.js`, musique et vérification.
- `npm test` passe actuellement avec 31 tests verts, dont le chargement des commandes classiques et des 45 commandes natives.
- Les scans statiques confirment `0` callback Mongoose legacy et `0` occurrence `.catch({})`.
- Les deux fichiers `pinned channel` ont le même blob Git que `upgrade` : `channelSorter.js` et `clientReady.js`.
- Les arbres Git de `main` et `upgrade` sont également identiques ; aucune modification supplémentaire de `upgrade` ne peut être intégrée sélectivement pour cette feature.
- Tester manuellement `withResponse`, les réponses éphémères et `/config language`.
- Revoir les vulnérabilités transitives restantes et décider lesquelles nécessitent une migration indépendante.

`main` et `upgrade` n'ont pas de merge-base commun avec cette branche ; la comparaison finale doit donc rester une comparaison directe des arbres et des fichiers ciblés, sans fusion automatique.

## Audit npm au 25 octobre 2026

`npm audit --omit=dev --audit-level=high` signale actuellement 39 vulnérabilités de production (12 modérées, 22 hautes et 5 critiques). Les dépendances directes ciblées ont été mises à jour, mais plusieurs alertes proviennent de dépendances historiques imbriquées (`request`, `weather-js`, `sourcebin`, les plugins `erela`, `puppeteer` et `discord-giveaways`). `npm audit fix --force` est volontairement exclu car il propose des changements cassants ; les correctifs sans migration seront traités séparément lorsque leur impact applicatif sera vérifié.

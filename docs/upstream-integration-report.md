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
- Suppression des dépendances directes inutilisées `request` et `src`, puis régénération de `package-lock.json` ; `src` et sa branche `underscore` vulnérable ne sont plus installés.
- Suppression de `puppeteer`, également non utilisé par le code local, et passage de `sourcebin` à `6.0.1` ; le chargement des commandes reste valide avec l’API `create`.
- Durcissement des options numériques, des appels HTTP et des opérations économiques atomiques.

## Non intégré volontairement

- Fusion complète de `upstream/main`.
- Fusion complète de `upgrade`, car elle supprime le socle i18n et les modules async/localisés déjà intégrés ; les parties pinned channel utiles sont déjà identiques localement.
- Migration V11 des centaines de fichiers, car elle remplace ou renomme des fonctionnalités locales.
- Réécriture globale de toutes les commandes avant stabilisation du socle i18n.
- `npm audit fix --force`, car il impose des changements cassants dans des dépendances historiques (`sourcebin`, giveaways et puppeteer).

## Points à vérifier avant fusion

- Comparer les commits upstream restants avec les fichiers locaux `interactionCreate.js`, `embed.js`, musique et vérification.
- `npm test` passe actuellement avec 40 tests verts, dont le chargement des commandes classiques et des 45 commandes natives.
- Les tests i18n couvrent également les titres/libellés des helpers centraux, le rejet des langues non supportées et le contrat `withResponse`/`MessageFlags.Ephemeral`.
- Les catalogues fr/en sont structurellement alignés ; l’unique clé française absente de l’anglais (`common.onlyFrench`) est volontaire et couvre le fallback.
- La vague giveaways (`start` et `drop`) utilise désormais les clés fr/en pour tous les messages du manager et sa confirmation de lancement.
- La vague radio (`play`, `playing`, `stop`) utilise désormais les clés fr/en et gère l’absence de canal vocal sans accès nul.
- Les scans statiques confirment `0` callback Mongoose legacy et `0` occurrence `.catch({})`.
- Les deux fichiers `pinned channel` ont le même blob Git que `upgrade` : `channelSorter.js` et `clientReady.js`.
- Les arbres Git de `main` et `upgrade` sont également identiques ; aucune modification supplémentaire de `upgrade` ne peut être intégrée sélectivement pour cette feature.
- Tester manuellement `withResponse`, les réponses éphémères et `/config language`.
- Revoir les vulnérabilités transitives restantes et décider lesquelles nécessitent une migration indépendante.

## Validation runtime du bot de test

- Node 20.20.2 charge `canvas@2.11.2` et `sourcebin.create` sans erreur ; `sourcebin@6.0.1` déclare toutefois Node >=22.13 dans ses engines, ce qui reste à arbitrer avec la contrainte native de canvas.
- Le Gateway Discord répond ; le bot voit 2 serveurs de laboratoire.
- 51 commandes ont été publiées globalement et sur les 2 serveurs de test, dont `/config language`.
- Le loader ignore désormais les modules utilitaires non-factories (`http/index.js` et `serverstats/createStatsChannel.js`) ; le healthcheck utilise un chemin temporaire portable.
- Le démarrage complet reste bloqué par la résolution DNS de MongoDB Atlas (`cluster0.omsiudb.mongodb.net` → `ENOTFOUND`) ; les interactions Discord nécessitant la persistance ne sont donc pas encore validées manuellement.

`main` et `upgrade` n'ont pas de merge-base commun avec cette branche ; la comparaison finale doit donc rester une comparaison directe des arbres et des fichiers ciblés, sans fusion automatique.

La comparaison avec `upstream/main` porte sur 634 fichiers ; les divergences de `interactionCreate.js`, `embed.js` et musique sont conservées volontairement, tandis que les fonctionnalités locales absentes d'upstream (`verification/delete.js`, `channelSorter.js`) restent intactes.

## Audit npm au 25 octobre 2026

`npm audit --omit=dev --audit-level=high` signale actuellement 26 vulnérabilités de production (12 modérées, 11 hautes et 3 critiques). Les dépendances directes ciblées ont été mises à jour et les correctifs non cassants ont été appliqués ; `sourcebin` et `puppeteer` ne sont plus les sources de leurs alertes respectives. Les alertes restantes proviennent surtout de dépendances historiques imbriquées (`request` via `weather-js`, les plugins `erela`, `discord-giveaways` et les dépendances natives de `canvas`). `npm audit fix --force` est volontairement exclu car il propose des changements cassants ; les trois alertes critiques restantes nécessitent une migration ou le remplacement de ces dépendances historiques.

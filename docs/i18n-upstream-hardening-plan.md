# Plan d’intégration i18n, upstream et durcissement

## Objectif

Permettre à chaque serveur de choisir `fr` ou `en`, avec `fr` comme valeur par défaut, tout en intégrant sélectivement les correctifs upstream utiles sans importer la migration V11 complète.

## 1. Préparation et garde-fous

- Travailler sur `feat/i18n-upstream-hardening`.
- Conserver `backup/pre-i18n-upstream-hardening` comme point de retour.
- Vérifier un worktree propre avant chaque vague.
- Garder `7e3a72a` comme référence locale avant intégration.
- Utiliser `npm test` comme commande de test officielle (`node --test test`).

## 2. Comparaison upstream sélective

- Comparer les commits upstream à l’architecture locale, sans fusionner `upstream/main`.
- Intégrer séparément : suppression du message de vérification, correctifs musique, `withResponse`/éphémère, et mises à jour de dépendances.
- Vérifier Discord.js `14.16.2` puis tester `14.27.0` avant de modifier les helpers centraux.
- Valider `withResponse: true` et `MessageFlags.Ephemeral` sur les interactions différées.
- Documenter explicitement les changements upstream volontairement non intégrés, notamment la migration V11.

## 3. Socle i18n

- Ajouter `src/locales/fr.json` et `src/locales/en.json`.
- Ajouter `src/handlers/i18n/index.js` avec `t(locale, key, variables)`.
- Supporter le fallback `en → fr`, l’interpolation `{user}`, `{amount}`, `{channel}` et les avertissements de clé absente en développement.
- Exposer `client.t(interaction, key, variables)`.
- Ne jamais traduire automatiquement à l’exécution.

## 4. Préférence serveur

- Ajouter `Functions.Language` avec l’enum `['fr', 'en']` et le défaut `fr`.
- Ajouter `/config language language:fr|en`.
- Vérifier `ManageGuild`, enregistrer le choix et répondre dans la nouvelle langue.
- S’appuyer sur la valeur par défaut pour les serveurs existants, sans migration manuelle.

## 5. Helpers et réponses communes

- Faire accepter aux helpers un texte existant ou `{ key, variables }`.
- Migrer `client.errNormal`, `client.succNormal`, `client.embed` et `client.simpleEmbed`.
- Couvrir les erreurs globales du routeur, les permissions et les messages d’aide.
- Vérifier les réponses normales, différées, éphémères, `editReply` et `followUp`.

## 6. Migration des commandes par vagues

1. Commun, permissions et erreurs.
2. `/config`, `/setup` et `/bot`.
3. Modération.
4. Économie et casino.
5. Tickets et giveaways.
6. Musique et radio.
7. Fun, images, jeux et outils.
8. Profils, niveaux, invitations et statistiques.

Pour chaque vague : remplacer les textes par des clés, traduire les descriptions et panneaux d’aide, contrôler les variables dynamiques, puis tester `fr` et `en`. Les localisations de builders Discord (`setNameLocalizations`, `setDescriptionLocalizations`) seront ajoutées après stabilisation des clés.

## 7. Durcissement technique transversal

- Remplacer tous les `.catch({})` invalides.
- Utiliser le helper HTTP commun avec timeout, `res.ok` et erreurs contextualisées.
- Supprimer les `fetchReply` inutiles et remplacer les réponses via `channel.send` dans les commandes d’interaction par `reply`, `editReply` ou `followUp`.
- Initialiser les managers hors des handlers d’événements.
- Remplacer progressivement les callbacks Mongoose par `async/await`.
- Maintenir `eval` dans une sandbox limitée avec timeout.
- Corriger `editReply`, bornes numériques, opérations Mongo atomiques et progression musique.
- Vérifier `clear` (`amount + 1`) et les builders `EmbedBuilder`.

## 8. Tests et validation par vague

- Tests Node natifs : résolution fr/en, fallback, interpolation, clé absente, enum de langues, sérialisation des localisations et locale serveur.
- Suivre le cycle rouge → implémentation minimale → vert → refactor.
- Charger toutes les commandes et tous les builders sans erreur.
- Tester `/config language` manuellement et une commande par catégorie dans les deux langues.
- Vérifier les réponses différées et éphémères.
- Exécuter `npm test` avant chaque fusion de vague.

## 9. Critères de fusion

- `npm test` entièrement vert.
- Aucun chargement de commande ou builder en erreur.
- Worktree propre et commits découpés par vague.
- Comparaison finale avec `upstream/main` effectuée.
- Rapport des changements upstream non intégrés et des limites d’environnement restantes.
- Fusion uniquement après revue des conflits dans `interactionCreate.js`, `embed.js`, musique et vérification.

## État actuel

- Branche et points de retour préparés.
- Socle i18n, préférence serveur et premières vagues communes/config/setup/bot/modération en place.
- Dépendances upstream principales et correctifs musique/interaction intégrés sélectivement.
- Helper HTTP et migrations des commandes HTTP avancés.
- Vague économie/casino commencée avec `balance`, `deposit` et `slots`, et catalogues UTF-8 corrigés.
- Les vagues giveaways et radio utilisent désormais les clés fr/en pour leurs réponses ; les catalogues fr/en sont alignés et les validations runtime ainsi que les vagues restantes restent à clôturer.
- Le runtime de référence est Node 20 : `canvas@2.11.2` y dispose d’un binaire Windows précompilé ; Node 24/22 n’en disposent pas dans cette version.
- Le bot de test atteint Discord et ses commandes ont été publiées sur les deux serveurs de laboratoire ; les scénarios d’interaction restent à exécuter manuellement.
- Le démarrage complet fonctionne avec `MONGO_DNS_SERVERS=1.1.1.1,8.8.8.8` lorsque le résolveur système ne résout pas le SRV Atlas ; les interactions manuelles restent à exécuter.
- La comparaison finale avec `upstream/main` couvre 634 fichiers ; la migration V11 complète reste volontairement non fusionnée.

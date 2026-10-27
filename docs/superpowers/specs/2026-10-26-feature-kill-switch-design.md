# Feature kill switch — design

## Objectif

Permettre de désactiver proprement une fonctionnalité du bot sans redéploiement :

- un réglage par serveur pour les administrateurs ;
- un arrêt global réservé au propriétaire du bot ;
- une prise en charge homogène des commandes, événements, triggers et tâches associées ;
- une réactivation sans migration manuelle ni redémarrage.

Le système bloque l’exécution au point d’entrée. Il ne décharge pas les modules à chaud, afin d’éviter les listeners Discord orphelins et les effets de bord.

## Décisions d’architecture

### Registre central

`src/handlers/features/registry.js` décrira chaque fonctionnalité avec une clé stable :

```js
{
  key: 'music',
  labelKey: 'features.music.label',
  category: 'commands',
  defaultEnabled: true,
  surfaces: ['command', 'event']
}
```

Les clés seront orientées fonctionnalité (`music`, `tickets`, `welcome`, `antiSpam`) plutôt que liées à un fichier. Une fonctionnalité peut donc couvrir plusieurs commandes et handlers. Les fonctionnalités très indépendantes pourront utiliser une clé plus fine (`command.casino`, `event.voiceCleanup`).

Le registre sera la source de vérité pour :

- les choix des commandes de configuration ;
- la validation des clés ;
- l’affichage des états ;
- les tests de couverture ;
- les messages localisés.

### Résolution d’état

`src/handlers/features/index.js` exposera :

- `client.isFeatureEnabled(feature, guildId)` ;
- `client.getFeatureState(feature, guildId)` ;
- `client.requireFeature(interaction, feature)` ;
- une API serveur utilisable par les events et triggers qui n’ont pas d’interaction.

La priorité sera :

1. arrêt global ;
2. désactivation serveur ;
3. activation serveur explicite ;
4. `defaultEnabled` du registre.

L’état effectif renverra aussi sa source (`global`, `guild`, `default`) afin que les logs et les diagnostics expliquent pourquoi une fonctionnalité est bloquée.

### Persistance

Le modèle `Functions` conservera les overrides par serveur dans un champ `Features`, avec uniquement les valeurs explicitement modifiées. Les serveurs existants resteront compatibles grâce à un objet absent équivalent à `{}`.

Un modèle séparé `GlobalFeatures` contiendra un document singleton pour les overrides globaux. Cette séparation évite de mélanger une configuration serveur avec un contrôle propriétaire et permet d’auditer les deux niveaux distinctement.

Les valeurs inconnues ne seront jamais exécutées : elles seront ignorées à la lecture et rejetées à l’écriture. Les écritures utiliseront `findOneAndUpdate` avec `upsert` et des opérations atomiques.

## Commandes et permissions

### Administrateurs de serveur

Ajouter :

- `/config feature list` : affiche les fonctionnalités disponibles, leur état effectif et leur source ;
- `/config feature set feature:<clé> enabled:<bool>` : modifie l’override du serveur ;
- `/config feature reset feature:<clé>` : revient au comportement par défaut.

Les clés seront proposées par des choix Discord générés depuis le registre. Les commandes `/config`, `/help` et le diagnostic des fonctionnalités resteront toujours disponibles.

### Propriétaire du bot

Ajouter une commande propriétaire, par exemple `/bot feature`, pour :

- lister les arrêts globaux ;
- activer ou désactiver globalement une fonctionnalité ;
- réinitialiser un override global ;
- afficher les serveurs concernés par un état serveur particulier, sans exposer de secrets.

Une désactivation globale sera prioritaire et un administrateur serveur ne pourra pas la contourner. Toutes les opérations enregistreront l’utilisateur, le niveau, le serveur éventuel, l’ancienne valeur, la nouvelle valeur et la date.

## Points d’intégration

### Commandes

Le routeur vérifiera le registre après avoir identifié la commande mais avant `cmd.run`. Une commande désactivée recevra une réponse localisée et ne devra pas effectuer de `deferReply`, d’écriture MongoDB ou d’effet externe.

Les sous-commandes pourront être couvertes par la clé de leur commande parent dans la V1. Une clé dédiée ne sera ajoutée que lorsqu’une sous-fonction doit être arrêtée indépendamment.

### Events, triggers et tâches

Les handlers déclareront explicitement leur clé au début de leur traitement :

- `messageCreate` : triggers, auto-réponses, anti-spam et récompenses ;
- events guild/voice/stats : fonctionnalité correspondante ;
- tâches périodiques : vérification avant chaque cycle ;
- interactions boutons/modales : même clé que la fonctionnalité qui les a créées.

Les événements sans serveur, comme certains événements client, seront contrôlés uniquement par l’arrêt global. Les actions de nettoyage indispensables au fonctionnement du bot ne seront pas désactivables dans la V1.

## Cache et cohérence

Un cache mémoire par `guildId + feature` réduira les lectures MongoDB. Toute modification de configuration invalidera immédiatement l’entrée concernée. En cas d’échec de lecture, le système utilisera le `defaultEnabled` du registre et journalisera l’erreur ; il ne considérera pas un override inconnu comme une permission d’exécuter une action sensible.

La V1 n’aura pas besoin de pub/sub : le bot fonctionne dans un processus principal et l’invalidation locale est immédiate. Une synchronisation inter-processus pourra être ajoutée si le déploiement devient multi-shard avec des processus indépendants.

## Localisation et UX

Ajouter dans `fr.json` et `en.json` les clés pour :

- fonctionnalité activée, désactivée ou réinitialisée ;
- fonctionnalité bloquée globalement ou par le serveur ;
- liste et source de l’état ;
- clé inconnue et permission insuffisante ;
- journalisation lisible.

Les libellés du registre ne seront jamais des chaînes en dur dans les commandes.

## Tests

Tests unitaires minimum :

- défaut activé ;
- désactivation serveur ;
- activation serveur explicite ;
- priorité de l’arrêt global ;
- reset vers le défaut ;
- rejet d’une clé inconnue ;
- cache invalidé après modification ;
- fallback sûr en cas d’erreur de lecture ;
- permission administrateur/propriétaire ;
- blocage avant l’exécution d’une commande ;
- blocage d’un event et d’un trigger ;
- réponses françaises et anglaises ;
- sérialisation des choix Discord.

Tests runtime sur le bot de laboratoire :

1. désactiver une commande par serveur et vérifier le refus ;
2. réactiver la commande et vérifier son exécution ;
3. désactiver une fonctionnalité globale et vérifier le refus sur deux serveurs ;
4. réinitialiser l’override ;
5. vérifier qu’un event/trigger désactivé ne produit plus d’action ;
6. vérifier que `/config feature` et le diagnostic restent disponibles.

## Hors périmètre V1

- déchargement dynamique des fichiers JavaScript ;
- planification automatique d’activation/désactivation ;
- règles par rôle ou par canal ;
- interface web ;
- synchronisation pub/sub entre plusieurs processus ;
- désactivation des mécanismes de sécurité ou du nettoyage critique.

## Critères d’acceptation

- une clé du registre correspond à chaque fonctionnalité contrôlable ;
- les commandes, events et triggers déclarés passent par le même résolveur ;
- les arrêts globaux sont réservés au propriétaire et prioritaires ;
- les overrides serveur survivent au redémarrage ;
- les états par défaut restent compatibles avec les serveurs existants ;
- aucune fonctionnalité désactivée ne déclenche d’effet secondaire ;
- toutes les réponses sont localisées ;
- `npm test` est entièrement vert et le bot de test valide les scénarios principaux.

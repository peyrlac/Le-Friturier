# Plan d’implémentation — feature kill switch

## Étape 1 — registre et résolution

- créer le registre de fonctionnalités ;
- ajouter le modèle d’état global ;
- étendre `Functions` avec les overrides serveur ;
- implémenter la résolution globale/serveur/défaut et le cache ;
- couvrir les erreurs de lecture et les clés inconnues.

## Étape 2 — intégration client et localisation

- exposer les méthodes sur `client` ;
- ajouter les clés fr/en pour les états et refus ;
- tester l’interpolation et la source de l’état.

## Étape 3 — commandes de contrôle

- ajouter `/config feature list|set|reset` ;
- ajouter le contrôle propriétaire global dans `/bot feature` ;
- valider les permissions, choix Discord et écritures atomiques ;
- journaliser chaque changement.

## Étape 4 — points d’exécution

- bloquer les commandes dans `interactionCreate` avant `deferReply` ;
- protéger les events/triggers prioritaires ;
- protéger les composants interactifs avec leur fonctionnalité parent ;
- conserver les commandes de configuration et les opérations critiques.

## Étape 5 — validation

- tests unitaires et statiques complets ;
- chargement de tous les builders ;
- smoke test dans le bot Docker de laboratoire ;
- vérifier la propreté Git et documenter les limites.

# Test Cypress : Connexion (`login.cy.ts`) — Mode Headless

Ce test vérifie le bon fonctionnement du formulaire de connexion de l’application en mode headless (ligne de commande, sans interface graphique).

## Fonctionnement

- Avant chaque test, les cookies et le localStorage sont supprimés pour garantir qu’aucune session précédente ne persiste.
- Le test visite la page d’accueil, ouvre le menu burger, puis remplit le formulaire de connexion.
- Les requêtes API de login et de récupération du profil utilisateur sont interceptées et mockées.
- Deux scénarios sont testés :
  1. **Connexion réussie** : Vérifie que l’utilisateur peut se connecter avec des identifiants valides.
  2. **Échec de connexion** : Vérifie qu’un message d’erreur s’affiche avec des identifiants invalides.

## Lancer le test en mode headless

Dans un terminal PowerShell, exécute :

```powershell
cd frontend
npx cypress run --spec cypress/e2e/login.cy.ts
```

Le résultat s’affichera directement dans le terminal.

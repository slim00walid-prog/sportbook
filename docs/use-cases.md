# Diagramme des cas d'utilisation (MVP)

```mermaid
flowchart LR
  U[Utilisateur] --> UC1((S'inscrire / Se connecter))
  U --> UC2((Rechercher un terrain))
  U --> UC3((Reserver un creneau))
  U --> UC4((Payer en ligne))
  U --> UC5((Consulter mes reservations))
  U --> UC6((Annuler une reservation))
  U --> UC7((Laisser un avis))

  M[Gestionnaire] --> UC8((Ajouter / modifier un terrain))
  M --> UC9((Bloquer creneaux maintenance))
  M --> UC10((Consulter reservations du complexe))
  M --> UC11((Valider / refuser reservation))
  M --> UC12((Voir stats de frequentation))

  A[Administrateur] --> UC13((Gerer utilisateurs))
  A --> UC14((Gerer complexes))
  A --> UC15((Moderer avis))
  A --> UC16((Suivre paiements et commissions))
  A --> UC17((Dashboard analytique global))

  UC3 --> UC4
  UC3 --> UC5
  UC3 --> UC6
```

## Priorisation MVP implemente dans ce repo

- Authentification utilisateur (inscription, connexion, deconnexion)
- Recherche terrains par sport, ville, prix
- Reservation avec controle de disponibilite
- Paiement simule (mock provider)
- Dashboard reservations + annulation
- Avis utilisateur apres reservation

# État des Lieux du Projet - CreatelistCOP

Ce document récapitule les fonctionnalités de chaque fichier présent dans le dépôt. Le projet est une application web simple permettant d'assigner des catégories (pays, organisations, médias) à une liste d'élèves importée depuis un fichier Excel.

## Architecture des Fichiers

### Racine du Projet
- **[index.html](file:///c:/Users/alano/OneDrive/Documents/GitHub/CreatelistCOP/CreatelistCOP/index.html)** : Point d'entrée principal de l'application. 
    - Contient la structure HTML de la page.
    - Inclut une zone de chargement de fichier (input type file).
    - Contient un tableau masqué par défaut pour l'affichage des résultats.
    - Charge la bibliothèque SheetJS via CDN pour le traitement des fichiers Excel.

### Dossier `css/`
- **[styles.css](file:///c:/Users/alano/OneDrive/Documents/GitHub/CreatelistCOP/CreatelistCOP/css/styles.css)** : Définit l'apparence visuelle de l'application.
    - Mise en page centrée avec un conteneur stylisé.
    - Styles pour le bouton de téléchargement personnalisé.
    - Mise en forme du tableau de résultats.
    - Gestion de la classe `.hidden` pour l'affichage dynamique des sections.

### Dossier `js/`
- **[script.js](file:///c:/Users/alano/OneDrive/Documents/GitHub/CreatelistCOP/CreatelistCOP/js/script.js)** : Logique applicative de l'outil.
    - Définit la liste des catégories à assigner (pays et organisations spéciales).
    - **`assignCategories(data)`** : Fonction qui boucle sur les noms d'élèves et leur assigne une catégorie de manière cyclique (en ignorant le premier élève).
    - Gestionnaire d'événement sur l'input de fichier :
        - Lit le fichier Excel chargé par l'utilisateur.
        - Extrait les noms des élèves depuis la première colonne.
        - Appelle la fonction d'assignation.
        - Génère dynamiquement les lignes du tableau de résultats dans le DOM.
        - Affiche la section des résultats.

## Fonctionnement Global
L'utilisateur charge un fichier `.xlsx`. L'application traite le fichier localement dans le navigateur (pas de serveur impliqué), puis affiche immédiatement un tableau faisant correspondre chaque élève à une catégorie spécifique pour la simulation COP.

# M2GI Projet développement mobile : Draw

Notre application est un jeu inspiré du jeu **Draw Something** proposé par Facebook avec son application Messenger.

Le principe est simple, c'est un jeu de collaboration entre les joueurs. 
Lorsqu'un joueur lance une partie avec l'un de ses amis, le premier choisi un mot parmis une liste de 3 tirés alléatoirement. 
Une fois le mot choisi, le joueur doit dessiner quelque chose qui permettra à son ami de le deviner. 
Une fois le dessin envoyé, l'autre joueur doit simplement deviner le mot. 
Une fois deviné, les 2 joueurs récoltent 5 étoiles supplémentaires (score sur l'application).

Notre application fonctionne totalement côté client (avec accès au firestore de Firebase) puisque le jeu n'est pas en temps réel mais que les joueurs jouent chacun leur tour.
Il n'y a donc pas d'architecture particulière mise en place. 


## Fonctionnalités mises en place

### Connexion email/mot de passe

Il est possible de créer un compte et de se connecter avec un email/mot de passe.


### Connexion SSO avec Google

Il est possible de créer un compte et de se connecter en utilisant son compte google. Sur un smartphone, l'application native google est ouverte pour choisir son compte.


### Liste d'amis

L'application met à disposition une liste d'amis avec la possibilité d'ajouter des amis en recherchant leur nom parmis la liste des utilisateurs. Il est possible de supprimer un amis de sa liste.


### QR Code

Un QR Code est généré à la création de chaque compte et il est possible d'ajouter un amis en scannant son QR Code.

### Vibration

Une vibration est lancée lors de la victoire d'une partie.


### Historique des parties

Un historiques des anciennes parties déjà jouées est gardé avec pour chaque partie, le mot qu'il fallait deviner.


### Tirage aléatoire d'un mot

Nous avons choisi de rentrer une liste de mots nous même dans un document Firebase. 3 indexs sont tirés aléatoirement coté client et une requête est lancée.
Cette méthode nécessite néanmoins d'avoir une base conséquente et d'ajouter à la main (ou par un script) tout les mots dans la base de donnée. Nous n'en n'avons ajouté que 8 pour pouvoir réaliser les tests, à terme il faudrait ajouter les 300 que nous avons séléctionnés. 

D'autant plus que pour un tel jeu, chaque mot doit avoir au préalable été séléctionné et validé pour être certain qu'il soit judicieux de le proposé aux joueurs. 


## Fonctionnalités abandonnées

### Monétisation / Pub

Après l'ajout du plugin Ionic native AdMobPro et sa mise en place pour ouvrir une pub lorsqu'un joueur lance une partie, nous avions des soucis de dépendances pour le build android et nous n'avons pas réussi à trouver de solutions assez rapidement pour garder cette fonctionnalité.


### Notifications

Nous voulions ajouter l'envoi de notification lorsqu'un utilisateur fait une demande d'amis ou lance une partie, mais après avoir regardé la démarche à suivre, nous navions plus assez de temps pour être certain de finaliser cette fonctionnalité avant le rendu.


## Règles de sécurité Firebase

```
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=\} {
      allow read, write: if request.auth.uid != null;
    }
  }
}
```


## Getting Started

Pour lancer ce projet sur on ordinateur, vous avez juste à cloner ce git et lancer la commande :
```
ionic serve
```

## Déploiement

Pour déployer cette application sur un mobile, branchez un smartphone android sur votre ordinateur, activez le mode développeur et lancez la commande :
```
ionic cordova run android
```
Ou déployez l'apk situé dans le chemin \draw\app-debug.apk

## Built avec 

* [Ionic](https://ionicframework.com/) - Cross-Platform Mobile App Development
* [Firebase](https://firebase.google.com) - Data hosting

## Authors

* **Quentin Rozand** (https://github.com/rozandq)
* **Baptiste Marion** (https://github.com/MegaBaobab)

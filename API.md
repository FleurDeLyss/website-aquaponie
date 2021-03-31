[post]: https://img.shields.io/badge/-POST-green?style=flat-square
[get]: https://img.shields.io/badge/-GET-blue?style=flat-square
[del]: https://img.shields.io/badge/-DELETE-red?style=flat-square
[put]: https://img.shields.io/badge/-PUT-orange?style=flat-square

[pXX]: https://img.shields.io/badge/PERM-XX-77f?style=flat-square
[p10]: https://img.shields.io/badge/PERM-10-77f?style=flat-square
[p50]: https://img.shields.io/badge/PERM-50-77f?style=flat-square

# Aquaponie API

## Sécurité
Toutes les requêtes nécéssitant une authentification seront identifié par un badge: ![pXX]
Pour cela, il faut utiliser une header d'authentification:
##### Headers
```
Authorization: User <access-token>
```

## Authentification

### ![post] /register
Permet de s'inscrire
##### Request
```json
{
    "email": "<email>",
    "password": "<mot de passe>",
    "firstname": "<prénom>",
    "lastname": "<nom>"
}
```

### ![post] /login
Permet de s'authentifier et récupérer un "Refresh token"
##### Request
```json
{
    "email": "<email>",
    "password": "<mot de passe>",
}
```
##### Response
```json
{
    "token": "<refresh-token>",
    "userID": "<id>"
}
```

### ![get] /token
Récupérer le token permettant l'accès à l'API
Nécéssite une "refresh-token"
##### Headers
```
Authorization: Refresh <refresh-token>
```
##### Response
```json
{
    "token": "<access-token>",
    "userID": "<id>",
    "firstname": "<prénom>",
    "lastname": "<nom>"
}
```
## Aquariums

### ![get] /aquariums
Liste des aquariums
##### Response
```json
[
    {
        "id": 0,
        "name": "<nom>"
    }
]
```

### ![post] /aquariums ![p50]
Liste des aquariums
##### Request
```json
{
    "name": "<nom>"
}
```
##### Response
```json
{
    "id": 0
}
```

### ![get] /aquariums/:id
Récupère un aquarium
##### Response
```json
{
    "id": 0,
    "name": "<nom>"
}
```

### ![del] /aquariums/:id ![p50]
Suprime un aquarium

### ![get] /aquariums/:id/data
Récupère toutes les données d'un aquarium
##### Query
```
?limit=50&offset=0&sort=desc
```
##### Response
```json
[
     {
        "id": 0,
        "aquariumID": 0,
        "manual": true,
        "modified": "<dernière date de modification>",
        "start": "<date de début>",
        "end": "<date de fin>",
        "data": {
            "<clé>": "<valeur>",
        }
    }
]
```

### ![post] /aquariums/:id/data ![p10]
Rajoute une donnée pour un aquarium
##### Request
```json
{
    "start": "<date de début>",
    "end": "<date de fin>",
    "data": {
        "<clé>": "<valeur>",
    }
}
```
##### Response
```json
{
    "id": 0
}
```
### ![get] /aquariums/:id/data/:dataid
Récupère une donnée d'un aquarium
##### Response
```json
{
    "id": 0,
    "aquariumID": 0,
    "manual": true,
    "modified": "<dernière date de modification>",
    "start": "<date de début>",
    "end": "<date de fin>",
    "data": {
        "<clé>": "<valeur>",
    }
}
```
### ![put] /aquariums/:id/data/:dataid ![p10]
Modifie une donnée pour un aquarium
##### Request
```json
{
    "start": "<date de début>",
    "end": "<date de fin>",
    "data": {
        "<clé>": "<valeur>",
    }
}
```
## Type de données

### ![get] /datatypes
Récupère les types de données
##### Response
```json
[
    {
        "key": "<clé>",
        "numeric": true,
        "name": "<nom de la variable>",
        "units": "<unité>"
    }
]
```

## Utilisateurs

### ![get] /users  ![p50]
Récupère les utilisateurs
##### Response
```json
[
    {
        "id": 0,
        "email": "<courriel>",
        "fistname": "<prénom>",
        "lastname": "<nom>",
        "permissions": 0
    }
]
```

### ![get] /users/:id ![p50]
Récupère un utilisateur
##### Response
```json
{
    "id": 0,
    "email": "<courriel>",
    "fistname": "<prénom>",
    "lastname": "<nom>",
    "permissions": 0
}
```

### ![put] /users/:id ![p50]
Change la permission d'un utilisateurs
##### Request
```json
{
    "permissions": 0
}
```
## Textes

Toutes les requêtes nécéssite un access-token
##### Headers
```
Authorization: User <access-token>
```

### ![get] /texts
Récupère tous les textes
##### Response
```json
[
    {
        "id": 0,
        "key": "<clé>",
        "text": "<texte>"
    }
]
```

### ![get] /texts/:key
Récupère un texte
##### Response
```json
{
    "id": 0,
    "key": "<clé>",
    "text": "<texte>"
}
```

### ![put] /texts/:key ![p50]
Change le texte
##### Request
```json
{
    "text": 0
}
```
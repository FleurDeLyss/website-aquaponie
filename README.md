# Aquaponie Application Web
## Description
Le projet à comme objectif de créer un application web ayant pour utilisation la visualisation des données enregistrers par les capteurs, la saisi de données manuellement et leur visualisation.

## Installation facile: Docker
```
docker build -t aquaponie .
docker run --rm -v "$(pwd)/data:/app/server/data" -p "3000:3000" aquaponie
```
## Installation

### Installer nodejs
```
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install nodejs
```

### Installer le projet
```
git clone https://github.com/nico14916/aquaponie.git
cd aquaponie/client
npm install
cd ../server
npm install
```

## Configuration
### Démarer le serveur pour la base de données
```
npm run start
```

### Démarer le serveur pour l'application web
```
npm run serve
```

## Annexe
Voir les requêtes possibles: [API docs](./API.md)
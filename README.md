# Projektmanagement Game

## Docker

### Build

```
docker build Projektmanagement-Game/ -t pm-game
```

### Deploy

```
docker run -d -p 80:5000 pm-game
```

### Check if it works

Open `http://127.0.0.1` in your Browser

## Without docker

### Run

```
node Webservice/server.js
```

### Check if it works

Open `http://127.0.0.1:5000` in your Browser
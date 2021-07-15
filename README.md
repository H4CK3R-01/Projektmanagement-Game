# Wer wird Projektmanager 2021?

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
### Install dependencies
```
npm install
```

### (Optional) Use credentials for monitoring
Set environment variables `WEBSOCKET_MONITOR_USERNAME` and `WEBSOCKET_MONITOR_PASSWORD`

`WEBSOCKET_MONITOR_USERNAME`: Username

`WEBSOCKET_MONITOR_PASDSWORD`: bcrypt hashed password. Generate with 
```
node
> require("bcrypt").hashSync("<your-password>", 10)
```

Linux & MacOS: `export NAME="VALUE"`

Windows: `set NAME="VALUE"`


### Run
```
node Webservice/server.js
```

### Check if it works
Open `http://127.0.0.1:5000` in your Browser

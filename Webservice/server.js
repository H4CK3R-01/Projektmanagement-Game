const express = require('express');
const fs = require('fs');
const {instrument} = require("@socket.io/admin-ui");
const app = express();
const server = require('http').createServer(app);
const {Server} = require("socket.io");
const io = new Server(server);
let cards = JSON.parse(fs.readFileSync(__dirname + '/../data/fragen_10_06_21_final_new_format.json'));

class Player {
    constructor(socketUsername) {
        this.socketUsername = socketUsername;
        this.position = 0;
        this.isAlive = true;
    }

    move(amount) {
        this.position += amount;
        if (this.position === 15) {
            // todo: win
        }
    }
}

class Hunter {
    constructor() {
        this.position = 0;
    }

    move(amount) {
        this.position += amount;
    }

    hunt(playerArray) {
        for (let i = 0; i < playerArray.length; i++) {
            if (playerArray[i].position <= this.position) {
                playerArray[i].isAlive = false;
            }
        }
    }
}

class Game {
    constructor() {
        this.players = [];
        this.whosNext = 0;
        this.started = false;
        this.round = 0;
        this.hunter = new Hunter()
    }

    finish_turn() {
        // move on to next player; skip dead players
        do {
            this.whosNext++;
            if (this.whosNext === this.players.length) {
                this.whosNext = 0;
                this.round++;
            }
        } while (!gameState.players[gameState.whosNext].isAlive);
        // kill players with hunter
        if (this.round >= 5) {
            this.hunter.move(1);
            this.hunter.hunt(this.players);
        }
        // check if all players are dead
        if (!this.players.some(player => player.isAlive === true)) {
            // todo: end game (all players are dead)
        }
    }
}
// todo: instantiate this for individual rooms
let gameState = new Game();

let port = 5000;
server.listen(port, function () {
    generate_log_message("MAIN", "Server", 'RUNNING', "PORT " + port);
});

// Monitor websockets
if (process.env.WEBSOCKET_MONITOR_USERNAME && process.env.WEBSOCKET_MONITOR_PASSWORD) {
    instrument(io, {
        auth: {
            type: "basic",
            username: process.env.WEBSOCKET_MONITOR_USERNAME,
            password: process.env.WEBSOCKET_MONITOR_PASSWORD
        },
        serverId: `${require("os").hostname()}#${process.pid}`
    });
} else {
    instrument(io, {
        auth: false,
        serverId: `${require("os").hostname()}#${process.pid}`
    });
}

// Serve static files (html, css, js)
app.use(express.static(__dirname + '/../public'));

// Websockets
io.on('connection', socket => {
    let addedUser = false;

    socket.on('add user', function (data) {
        if (gameState.players.length < 4 && !gameState.started) {
            socket.username = data.username;
            socket.room = data.room_name;

            gameState.players.push(new Player(socket.username));
            addedUser = true;

            socket.emit('login');
            socket.join(socket.room);

            socket.broadcast.to(socket.room).emit('user joined', socket.username);

            generate_log_message(socket.room, socket.username, "JOINED", "");
        } else {
            // TODO
        }
    });

    socket.on('new message', function (data) {
        socket.broadcast.to(socket.room).emit('new message', {
            username: socket.username,
            message: data
        });

        generate_log_message(socket.room, socket.username, "MESSAGE", data);
    });

    socket.on('disconnect', function () {
        if (addedUser) {
            socket.broadcast.to(socket.room).emit('user left', socket.username);
            let index = -1;
            for (let i = 0; i < gameState.players.length; i++) {
                if (gameState.players[i].socketUsername === socket.username) {
                    index = i;
                    break;
                }
            }

            if (index > -1) {
                gameState.players.splice(index, 1);
            }

            socket.leave(socket.room);

            if (gameState.players.length === 0) {
                gameState.players = [];
                gameState.whosNext = 0;
                gameState.started = false;
            }
        }

        generate_log_message(socket.room, socket.username, "LEFT", "");
    });

    // Game
    socket.on('roll dice', function () {

        if (gameState.players[gameState.whosNext].socketUsername === socket.username) {
            gameState.started = true;
            let sides = 3;
            let randomNumber = Math.floor(Math.random() * sides) + 1;

            io.in(socket.room).emit('dice', randomNumber);

            generate_log_message(socket.room, socket.username, "DICE", randomNumber);
        } else {
            // TODO
        }
    });

    socket.on('get card', function (difficulty) {
        if (gameState.players[gameState.whosNext].socketUsername === socket.username) {
            io.in(socket.room).emit('card', {'username': socket.username, 'card': getRandomCard(difficulty)});

            generate_log_message(socket.room, socket.username, "CARD", difficulty);
        } else {
            // TODO
        }
    });

    socket.on('card finished', function (difficulty, answerIsCorrect) {
        if (answerIsCorrect) gameState.players[gameState.whosNext].move(difficulty);
        io.in(socket.room).emit('card destroyed');
        gameState.finish_turn();
    });
});

function generate_log_message(room, user, type, message) {
    let color;
    switch (type) {
        case 'LEFT':
            color = '\x1b[31m';
            break;
        case 'JOINED':
            color = '\x1b[32m';
            break;
        case 'MESSAGE':
            color = '\x1b[36m';
            break;
        case 'RUNNING':
            color = '\x1b[35m';
            break;
        case 'DICE':
            color = '\x1b[34m';
            break;
        default:
            color = '\x1b[0m';
    }
    room = pad(10, room, ' ').substr(0, 10);
    user = pad(10, user, ' ').substr(0, 10);
    type = pad(10, type, ' ').substr(0, 10);

    let reset_color = '\x1b[0m';
    console.info("%s[%s] [%s] [%s]\x1b[0m %s", color, room, user, type, reset_color, message);
}

function getRandomCard(difficulty) {
    let filtered_cards = cards.filter(card => {
        return card.difficulty === difficulty;
    });
    return shuffleAnswers(filtered_cards[Math.floor(Math.random() * filtered_cards.length)]);
}

function shuffleAnswers(card) {
    for (let i = card.answers.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [card.answers[i], card.answers[j]] = [card.answers[j], card.answers[i]];
    }
    return card;
}


function pad(width, string, padding) {
    if (string === undefined || string === null) return pad(width, " ", " ");
    return (width <= string.length) ? string : pad(width, string + padding, padding);
}
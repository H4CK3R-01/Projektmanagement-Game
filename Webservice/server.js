const Game = require('./Game');

const express = require('express');
const fs = require('fs');
const {instrument} = require("@socket.io/admin-ui");
const app = express();
const server = require('http').createServer(app);
const {Server} = require("socket.io");
const io = new Server(server);
let cards = JSON.parse(fs.readFileSync(__dirname + '/../data/fragen_10_06_21_final_new_format.json'));

let gameState = {};

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
        socket.username = data.username;
        socket.room = data.room_name;

        if (gameState[socket.room] === undefined) {
            gameState[socket.room] = new Game();
        }

        if (gameState[socket.room].players.length < 4 && !gameState[socket.room].started) {
            gameState[socket.room].add_player(socket.username);
            addedUser = true;

            socket.emit('login');
            socket.join(socket.room);

            socket.broadcast.to(socket.room).emit('user joined', socket.username);

            generate_log_message(socket.room, socket.username, "JOINED", "");
        } else {
            io.to(socket.id).emit('error', 'Game started already or room has two many members');
        }
    });

    socket.on('new message', function (data) {
        if (gameState[socket.room] !== undefined && addedUser) {
            socket.broadcast.to(socket.room).emit('new message', {
                username: socket.username,
                message: data
            });

            generate_log_message(socket.room, socket.username, "MESSAGE", data);
        }
    });

    socket.on('disconnect', function () {
        if (gameState[socket.room] !== undefined && addedUser) {
            socket.broadcast.to(socket.room).emit('user left', socket.username);
            gameState[socket.room].remove_player(socket.username);

            // TODO Close card if card is opened and active player left

            socket.leave(socket.room);

            if (gameState[socket.room].players.length === 0) delete gameState[socket.room];
        }

        generate_log_message(socket.room, socket.username, "LEFT", "");
    });

    // Game
    socket.on('roll dice', function () {
        if (gameState[socket.room] !== undefined && addedUser) {
            if (gameState[socket.room].current_player_is(socket.username)) {
                gameState[socket.room].started = true;
                let sides = 3;
                let randomNumber = Math.floor(Math.random() * sides) + 1;

                io.in(socket.room).emit('dice', randomNumber);

                generate_log_message(socket.room, socket.username, "DICE", randomNumber);
            } else {
                io.to(socket.id).emit('error', 'It\'s not your turn');
            }
        }
    });

    socket.on('get card', function (difficulty) {
        if (gameState[socket.room] !== undefined && addedUser) {
            if (gameState[socket.room].current_player_is(socket.username)) {
                io.in(socket.room).emit('card', {'username': socket.username, 'card': getRandomCard(difficulty)});

                generate_log_message(socket.room, socket.username, "CARD", difficulty);
            } else {
                io.to(socket.id).emit('error', 'It\'s not your turn');
            }
        }
    });

    socket.on('card finished', function (difficulty, answerIsCorrect) {
        if (gameState[socket.room] !== undefined && addedUser) {
            if (answerIsCorrect) {
                gameState[socket.room].move_player(socket.username, difficulty);
                generate_log_message(socket.room, socket.username, "MOVE", difficulty);
            }
            io.in(socket.room).emit('card destroyed');
            gameState[socket.room].finish_turn();

            let index = gameState[socket.room].get_player_index(socket.username);
            let next_player = gameState[socket.room].players[gameState[socket.room].currentPlayerIndex].name;

            io.in(socket.room).emit('player moved', {
                "next_player": next_player,
                "player": index,
                "position": gameState[socket.room].players[index].position
            });
        }
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
        case 'MOVE':
            color = '\x1b[30m';
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

const Game = require('./Game');

const express = require('express');
const fs = require('fs');
const {instrument} = require("@socket.io/admin-ui");
const app = express();
const server = require('http').createServer(app);
const {Server} = require("socket.io");
const io = new Server(server);
let cards = JSON.parse(fs.readFileSync(__dirname + '/../data/fragen_10_06_21_final_new_format.json'));

let game = {};

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

        if (game[socket.room] === undefined) {
            game[socket.room] = new Game();
        }

        if (game[socket.room].get_player_index(socket.username) === -1) {
            if (game[socket.room].add_player(socket.username)) {

                game[socket.room].addPlayerName(data.username);
                addedUser = true;

                socket.emit('login', game[socket.room].get_player_index(socket.username));
                socket.join(socket.room);
                io.in(socket.room).emit('updatePlayerNames', game[socket.room].getPlayerNames());

                if (game[socket.room].players.length === 1) io.to(socket.id).emit('first player');

                socket.broadcast.to(socket.room).emit('user joined', socket.username);

                generate_log_message(socket.room, socket.username, "JOINED", "");
            } else {
                io.to(socket.id).emit('error', 'Game started already or room has too many members');
            }
        } else {
            io.to(socket.id).emit('error', 'Username already exists');
        }
    });

    socket.on('new message', function (data) {
        if (game[socket.room] !== undefined && addedUser) {
            socket.broadcast.to(socket.room).emit('new message', {
                username: socket.username,
                message: data
            });

            generate_log_message(socket.room, socket.username, "MESSAGE", data);
        }
    });

    socket.on('disconnect', function () {
        if (game[socket.room] !== undefined && addedUser) {
            if (game[socket.room].current_player_is(socket.username)) socket.broadcast.to(socket.room).emit('card destroyed');

            game[socket.room].removePlayerName(socket.username);
            io.in(socket.room).emit('updatePlayerNames', game[socket.room].getPlayerNames());

            socket.broadcast.to(socket.room).emit('user left', socket.username);
            game[socket.room].remove_player(socket.username);

            socket.leave(socket.room);

            if (game[socket.room].players.length === 0) delete game[socket.room];
        }

        generate_log_message(socket.room, socket.username, "LEFT", "");
    });

    // Game
    socket.on('roll dice', function () {
        if (game[socket.room] === undefined || !addedUser) return;

        if (game[socket.room].current_player_is(socket.username)) {
            game[socket.room].currentStatus = Game.STATUS.ONGOING;
            let sides = 3;
            let randomNumber = Math.floor(Math.random() * sides) + 1;

            io.in(socket.room).emit('dice', randomNumber);

            generate_log_message(socket.room, socket.username, "DICE", randomNumber);
        } else {
            io.to(socket.id).emit('error', 'It\'s not your turn');
        }
    });

    socket.on('get card', function (difficulty) {
        if (game[socket.room] === undefined || !addedUser) return;
        if (game[socket.room].currentStatus !== Game.STATUS.ONGOING) return;

        if (game[socket.room].current_player_is(socket.username)) {
            io.in(socket.room).emit('card', {
                'username': socket.username,
                'card': getRandomCard(difficulty, socket.room)
            });

            generate_log_message(socket.room, socket.username, "CARD", difficulty);
        } else {
            io.to(socket.id).emit('error', 'It\'s not your turn');
        }

    });

    socket.on('card finished', function (difficulty, answerIsCorrect) {
        if (game[socket.room] === undefined || !addedUser) return;
        if (game[socket.room].currentStatus !== Game.STATUS.ONGOING) return;

        io.in(socket.room).emit('card destroyed');

        if (answerIsCorrect) {
            game[socket.room].move_player(socket.username, difficulty);
            generate_log_message(socket.room, socket.username, "MOVE", difficulty);
        }

        let index = game[socket.room].get_player_index(socket.username);
        let position = game[socket.room].players[index].position;

        game[socket.room].finish_turn();

        io.in(socket.room).emit('player moved', {
            "next_player": game[socket.room].players[game[socket.room].currentPlayerIndex].name,
            "player": index,
            "position": position,
            "state": game[socket.room].currentStatus,
        });

        io.in(socket.room).emit('update Hunter', game[socket.room].hunter.getPosition());
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

function getRandomCard(difficulty, room) {
    let filtered_cards = cards.filter(card => {
        return card.difficulty === difficulty;
    });

    let tmp = filtered_cards[Math.floor(Math.random() * filtered_cards.length)];
    while (game[room].used_cards.indexOf(tmp.id) !== -1) {
        tmp = filtered_cards[Math.floor(Math.random() * filtered_cards.length)];
    }

    game[room].used_cards.push(tmp.id);
    return shuffleAnswers(tmp);
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

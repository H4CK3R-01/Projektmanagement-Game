let express = require('express');
let fs = require('fs');
let app = express();
let server = require('http').createServer(app);
let {Server} = require("socket.io");
let io = new Server(server);
let cards = JSON.parse(fs.readFileSync(__dirname + '/../data/cards.json'));

let port = 5000;
server.listen(port, function () {
    generate_log_message("MAIN", "Server", 'RUNNING', "PORT " + port);
});


app.use(express.static(__dirname + '/../public'));


io.on('connection', socket => {
    let addedUser = false;

    socket.on('add user', function (data) {
        socket.username = data.username;
        socket.room = data.room_name;

        addedUser = true;

        socket.emit('login');
        socket.join(socket.room);

        socket.broadcast.to(socket.room).emit('user joined', socket.username);

        generate_log_message(socket.room, socket.username, "JOINED", "");
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
        }

        generate_log_message(socket.room, socket.username, "LEFT", "");
    });


    // Game
    socket.on('roll dice', function () {
        let sides = 3;
        let randomNumber = Math.floor(Math.random() * sides) + 1;

        io.in(socket.room).emit('dice', randomNumber);

        generate_log_message(socket.room, socket.username, "DICE", randomNumber);
    });

    socket.on('get card', function (difficulty) {
        io.in(socket.room).emit('card', getRandomCard(difficulty));

        generate_log_message(socket.room, socket.username, "CARD", difficulty);
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
        return card.diffuculty === difficulty;
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
    return (width <= string.length) ? string : pad(width, string + padding, padding)
}
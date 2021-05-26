let express = require('express');
let app = express();
let server = require('http').createServer(app);

let io = require('socket.io')(server);

let port = parseInt(process.env.PORT) || 5000;
server.listen(port, function () {
    console.info('Webserver running');
    console.info('Port %d', port);
});


app.use(express.static(__dirname + '/../public'));


io.on('connection', function (socket) {
    let addedUser = false;

    socket.on('add user', function (username) {
        socket.username = username;
        addedUser = true;

        socket.emit('login');

        socket.broadcast.emit('user joined', socket.username);

        console.info("[JOINED ] " + socket.username);
    });

    socket.on('new message', function (data) {
        socket.broadcast.emit('new message', {
            username: socket.username,
            message: data
        });

        console.info("[MESSAGE] " + socket.username + ": " + data);
    });

    socket.on('disconnect', function () {
        if (addedUser) {
            socket.broadcast.emit('user left', socket.username);
        }

        console.info("[LEFT   ] " + socket.username);
    });
});

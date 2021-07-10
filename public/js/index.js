let username;
let room_name;

window.addEventListener('beforeunload', function (e) {
    // Prevent user from exiting page
    e.preventDefault();
});

document.getElementById('ok').addEventListener('click', function () {
    username = document.getElementById('username').value;
    room_name = document.getElementById('room').value;

    socket = io("/", {
        closeOnBeforeunload: false
    });

    // Login
    socket.emit('add user', {'username': username, 'room_name': room_name});


    socket.on('login', function () {
        connected = true;

        document.getElementById('login').style.display = 'none';
        document.getElementById('game').style.display = 'flex';
        document.getElementById('chat').style.display = 'flex';
        start_game();
        resize();

        addLogMessage("Welcome " + username + "!");
    });

    socket.on('error', function (data) {
        if (data === 'Game started already or room has two many members') {
            document.getElementById('login').style.display = 'flex';
            document.getElementById('game').style.display = 'none';
            document.getElementById('chat').style.display = 'none';
            document.getElementById('error').innerText = data;
        }
        console.log(data);
    });

    socket.on('new message', function (data) {
        addChatMessage(data);
    });

    socket.on('user joined', function (data) {
        addLogMessage(data + ' joined');
    });

    socket.on('user left', function (data) {
        addLogMessage(data + ' left');
    });
});

function open_manual() {
    let frame = document.createElement('iframe');
    frame.src = 'data/Spielanleitung.pdf';
    frame.id = 'spielanleitung';

    document.getElementById('manual').innerHTML = '';
    document.getElementById('manual').appendChild(frame);
    document.getElementById('modal').style.display = 'block';
}
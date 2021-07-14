let username;
let room_name;

window.addEventListener('beforeunload', function (e) {
    e.preventDefault(); // Prevent user from exiting page
});

window.addEventListener('keydown', function (event) {
    if (event.code === 'Enter' && app == null) document.getElementById('ok').click();
});

document.getElementById('ok').addEventListener('click', function () {
    username = document.getElementById('username').value;
    room_name = document.getElementById('room').value;

    if (username !== "" && room_name !== "") {
        socket = io("/", {
            closeOnBeforeunload: false
        });

        // Login
        socket.emit('add user', {'username': username, 'room_name': room_name});


        socket.on('login', function (data) {
            connected = true;

            document.getElementById('login').style.display = 'none';
            document.getElementById('game').style.display = 'flex';
            document.getElementById('chat').style.display = 'flex';
            start_game();
            resize();

            addLogMessage("Welcome " + username + "!");

            switch (parseInt(data)) {
                case 0:
                    document.getElementsByTagName('header')[0].classList.add('yellow');
                    break;
                case 1:
                    document.getElementsByTagName('header')[0].classList.add('blue');
                    break;
                case 2:
                    document.getElementsByTagName('header')[0].classList.add('green');
                    break;
                case 3:
                    document.getElementsByTagName('header')[0].classList.add('red');
                    break;
            }
        });

        socket.on('error', function (data) {
            if (data === 'Game started already or room has too many members' || data === 'Username already exists') {
                document.getElementById('login').style.display = 'flex';
                document.getElementById('game').style.display = 'none';
                document.getElementById('chat').style.display = 'none';
                document.getElementById('error').innerText = data;
            }
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
    } else {
        document.getElementById('error').innerText = 'Username and/or room name cannot be empty!';
    }
});

function open_manual() {
    let frame = document.createElement('iframe');
    frame.src = 'data/Spielanleitung.pdf';
    frame.id = 'spielanleitung';

    document.getElementById('manual').innerHTML = '';
    document.getElementById('manual').appendChild(frame);
    document.getElementById('modal').style.display = 'block';
}
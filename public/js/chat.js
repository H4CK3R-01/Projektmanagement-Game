let socket;
let username = prompt("Please enter your name");
//let room_name = prompt("Please enter room name", "1234");
let connected = false;

window.addEventListener('load', function () {
    socket = io();

    socket.on('login', function (data) {
        connected = true;
        log("Welcome " + username + "!");
    });

    socket.on('new message', function (data) {
        addChatMessage(data);
    });

    socket.on('user joined', function (data) {
        log(data + ' joined');
    });

    socket.on('user left', function (data) {
        log(data + ' left');
    });

    // Login
    socket.emit('add user', username);
});

function sendMessage() {
    let message = document.getElementById('message').value;

    if (message && connected) {
        document.getElementById('message').value = '';

        addChatMessage({ username: username, message: message });

        socket.emit('new message', message);
    }
}

function log(message) {
    let li = document.createElement('div');
    li.classList.add('log');
    li.innerText = message;

    document.getElementById("messages").appendChild(li);
}

function addChatMessage(data) {
    let user = document.createElement('span');
    user.classList.add('username');
    user.innerText = data.username;

    let messageBody = document.createElement('span');
    messageBody.classList.add('messageBody');
    messageBody.innerText = data.message;

    let messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    if(data.username === username) {
        messageDiv.classList.add('me');
    } else {
        messageDiv.classList.add('others');
    }
    messageDiv.appendChild(user);
    messageDiv.appendChild(messageBody);

    document.getElementById('messages').append(messageDiv);
}
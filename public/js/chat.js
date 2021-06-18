let socket;
let connected = false;

function sendMessage() {
    let message = document.getElementById('message_input').value;

    if (message && connected) {
        document.getElementById('message_input').value = '';

        addChatMessage({username: username, message: message});

        socket.emit('new message', message);
    }
}

function addLogMessage(message) {
    let li = document.createElement('div');
    li.classList.add('log_message');
    li.innerText = message;

    document.getElementById("messages_received").appendChild(li);
    document.getElementById("messages_received").scrollTop = document.getElementById("messages_received").scrollHeight;
}

function addChatMessage(data) {
    let user = document.createElement('span');
    user.classList.add('username');
    user.innerText = data.username;

    let messageBody = document.createElement('span');
    messageBody.classList.add('messageBody');
    messageBody.innerText = data.message;

    let messageDiv = document.createElement('div');
    messageDiv.classList.add('chat_message');
    if (data.username === username) {
        messageDiv.classList.add('me');
    } else {
        messageDiv.classList.add('others');
    }
    messageDiv.appendChild(user);
    messageDiv.appendChild(messageBody);

    document.getElementById('messages_received').append(messageDiv);
    document.getElementById("messages_received").scrollTop = document.getElementById("messages_received").scrollHeight;
}

document.getElementById('message_input').onkeydown = function (e) {
    if (e.key === "Enter") {
        sendMessage();
        e.preventDefault();
    }
};
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

    start_chat();

    // Login
    socket.emit('add user', {'username': username, 'room_name': room_name});
});
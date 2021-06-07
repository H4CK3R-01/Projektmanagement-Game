let username;
let room_name;

window.addEventListener('beforeunload', function (e) {
    // Prevent user from exiting page
    e.preventDefault();
});

document.getElementById('ok').addEventListener('click', function () {
    username = document.getElementById('username').value;
    room_name = document.getElementById('room').value;

    document.getElementById('login').style.display = 'none';
    document.getElementById('game').style.display = 'flex';
    document.getElementById('chat').style.display = 'flex';
    start_chat();
    resize();
})
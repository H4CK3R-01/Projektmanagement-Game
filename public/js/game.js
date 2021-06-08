function start_game() {
    socket.on('dice', function (data) {
        console.log(data);
    });

    socket.on('card', function (data) {
        console.log(data);
    });
}
let app;

window.addEventListener('resize', resize);
window.addEventListener('load', function () {
    app = new PIXI.Application({
        autoResize: true,
        resolution: devicePixelRatio,
        backgroundColor: 0x0073db
    });
    document.getElementById('game').appendChild(app.view);


    socket.on('dice', function (data) {
        console.log(data);
    });

    socket.on('card', function (data) {
        console.log(data);
    });

    resize();
});

function resize() {
    let game = document.getElementById('game');
    app.renderer.resize(game.offsetWidth, game.offsetHeight);
}
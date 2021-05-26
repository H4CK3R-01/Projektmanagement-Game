const app = new PIXI.Application({
    autoResize: true,
    resolution: devicePixelRatio,
    backgroundColor: 0xffff00
});
document.getElementById('game').appendChild(app.view);


// -------------------------------------- code --------------------------------------

// ------------------------------------ end code ------------------------------------


// Resize (Do Not modify)
window.addEventListener('resize', resize);
function resize() {
    let game = document.getElementById('game');
    app.renderer.resize(game.offsetWidth, game.offsetHeight);
}
resize();
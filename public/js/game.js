let game = document.getElementById('game');

let size;
if (game.offsetWidth > game.offsetHeight) {
    size = game.offsetHeight;
} else {
    size = game.offsetWidth;
}

const app = new PIXI.Application({
    autoResize: true,
    resolution: devicePixelRatio,
    width: size,
    height: size
});

let img = new PIXI.Sprite.from("/img/background.jpg");
img.width = size;
img.height = size;
app.stage.addChild(img);


document.getElementById('game').appendChild(app.view);


// -------------------------------------- code --------------------------------------
function Sprite(x, y) {
    this.x = x;
    this.y = y;
}

let sprite_size = Math.floor(size / 11);
let sprites = {
    0: new Sprite(sprite_size, sprite_size),
    1: new Sprite(sprite_size * 3, sprite_size),
    2: new Sprite(sprite_size * 5, sprite_size),
    3: new Sprite(sprite_size * 7, sprite_size),
    4: new Sprite(sprite_size * 9, sprite_size),

    5: new Sprite(sprite_size, sprite_size * 3),
    6: new Sprite(sprite_size * 9, sprite_size * 3),

    7: new Sprite(sprite_size, sprite_size * 5),
    8: new Sprite(sprite_size * 9, sprite_size * 5),

    9: new Sprite(sprite_size, sprite_size * 7),
    10: new Sprite(sprite_size * 9, sprite_size * 7),

    11: new Sprite(sprite_size, sprite_size * 9),
    12: new Sprite(sprite_size * 3, sprite_size * 9),
    13: new Sprite(sprite_size * 5, sprite_size * 9),
    14: new Sprite(sprite_size * 7, sprite_size * 9),
    15: new Sprite(sprite_size * 9, sprite_size * 9),
}

for (let i = 0; i < 16; i++) {
    const sprite = PIXI.Sprite.from('/img/sprite.jpg');

    sprite.x = sprites[i].x - sprite_size * 0.2;
    sprite.y = sprites[i].y - sprite_size * 0.2;
    sprite.width = sprite_size * 1.5;
    sprite.height = sprite_size * 1.5;

    app.stage.addChild(sprite);
}

const graphics = new PIXI.Graphics();
graphics.lineStyle(10, 0x862323, 1);
graphics.drawRect(sprite_size * 9 - sprite_size * 0.2, sprite_size * 9 - sprite_size * 0.2, sprite_size * 1.5, sprite_size * 1.5);
app.stage.addChild(graphics);

graphics.lineStyle(0);
graphics.beginFill(0xffffff, 1);
graphics.drawCircle(sprite_size * 3 - sprite_size * 0.2 + sprite_size * 0.75, sprite_size * 9 - sprite_size * 0.2 + sprite_size * 0.75, sprite_size/4);
graphics.endFill();

graphics.lineStyle(0);
graphics.beginFill(0xffffff, 1);
graphics.drawCircle(sprite_size * 5 - sprite_size * 0.2 + sprite_size * 0.75, sprite_size * 9 - sprite_size * 0.2 + sprite_size * 0.75, sprite_size/4);
graphics.endFill();

graphics.lineStyle(0);
graphics.beginFill(0xffffff, 1);
graphics.drawCircle(sprite_size * 7 - sprite_size * 0.2 + sprite_size * 0.75, sprite_size * 9 - sprite_size * 0.2 + sprite_size * 0.75, sprite_size/4);
graphics.endFill();

generate_card("Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores.");


function generate_card(s) {
    let start_x = size / 2 - 110;
    let start_y = size / 2 - 150;
    graphics.lineStyle(5, 0x000000, 1);
    graphics.beginFill(0x650A5A);
    graphics.drawRoundedRect(start_x, start_y, 220, 300, 10);
    graphics.endFill();

    const style = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 15,
        wordWrap: true,
        wordWrapWidth: 200,
    });
    const basicText = new PIXI.Text(s, style);
    basicText.x = start_x + 10;
    basicText.y = start_y + 10;

    app.stage.addChild(basicText);
}
// ------------------------------------ end code ------------------------------------


// Resize
// window.addEventListener('resize', resize);
//
// function resize() {
//     let game = document.getElementById('game');
//     app.renderer.resize(game.offsetWidth, game.offsetHeight);
// }
//
// resize();
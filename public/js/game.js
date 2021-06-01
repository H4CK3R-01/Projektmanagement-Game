let game = document.getElementById('game');

let game_board_size = calculate_size();
let sprite_size = Math.floor(game_board_size / 11);

const app = new PIXI.Application({
    autoResize: true,
    resolution: devicePixelRatio,
    transparent: true,
    width: game_board_size,
    height: game_board_size
});

document.getElementById('game').appendChild(app.view);


function Sprite(x, y) {
    this.sprite = PIXI.Sprite.from('/img/sprite.jpg');
    this.coord_x = x;
    this.coord_y = y;

    this.getSprite = function () {
        this.setSize(this.sprite, sprite_size);
        return this.sprite;
    }

    this.resize = function (sprite_size) {
        this.setSize(this.sprite, sprite_size);
    }

    this.setSize = function (sprite, size) {
        sprite.x = this.coord_x * size - size * 0.2;
        sprite.y = this.coord_y * size - size * 0.2;
        sprite.width = size * 1.5;
        sprite.height = size * 1.5;
    }
}


let sprites = {
    0: new Sprite(1, 1),
    1: new Sprite(3, 1),
    2: new Sprite(5, 1),
    3: new Sprite(7, 1),
    4: new Sprite(9, 1),

    5: new Sprite(1, 3),
    6: new Sprite(9, 3),

    7: new Sprite(1, 5),
    8: new Sprite(9, 5),

    9: new Sprite(1, 7),
    10: new Sprite(9, 7),

    11: new Sprite(1, 9),
    12: new Sprite(3, 9),
    13: new Sprite(5, 9),
    14: new Sprite(7, 9),
    15: new Sprite(9, 9),
}

for (let i = 0; i < 16; i++) {
    app.stage.addChild(sprites[i].getSprite());
}

const red_border = new PIXI.Graphics();
red_border.lineStyle(10, 0x862323, 1);
red_border.drawRect(sprite_size * 9 - sprite_size * 0.2, sprite_size * 9 - sprite_size * 0.2, sprite_size * 1.5, sprite_size * 1.5);
app.stage.addChild(red_border);

const first_circle = new PIXI.Graphics();
first_circle.lineStyle(0);
first_circle.beginFill(0xffffff, 1);
first_circle.drawCircle(sprite_size * 3 - sprite_size * 0.2 + sprite_size * 0.75, sprite_size * 9 - sprite_size * 0.2 + sprite_size * 0.75, sprite_size/4);
first_circle.endFill();
app.stage.addChild(first_circle);

const second_circle = new PIXI.Graphics();
second_circle.lineStyle(0);
second_circle.beginFill(0xffffff, 1);
second_circle.drawCircle(sprite_size * 5 - sprite_size * 0.2 + sprite_size * 0.75, sprite_size * 9 - sprite_size * 0.2 + sprite_size * 0.75, sprite_size/4);
second_circle.endFill();
app.stage.addChild(second_circle);

const third_circle = new PIXI.Graphics();
third_circle.lineStyle(0);
third_circle.beginFill(0xffffff, 1);
third_circle.drawCircle(sprite_size * 7 - sprite_size * 0.2 + sprite_size * 0.75, sprite_size * 9 - sprite_size * 0.2 + sprite_size * 0.75, sprite_size/4);
third_circle.endFill();
app.stage.addChild(third_circle);


generate_card("Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores.");


function generate_card(s) {
    const card = new PIXI.Graphics();
    let start_x = game_board_size / 2 - 110;
    let start_y = game_board_size / 2 - 150;
    card.lineStyle(5, 0x000000, 1);
    card.beginFill(0x650A5A);
    card.drawRoundedRect(start_x, start_y, 220, 300, 10);
    card.endFill();

    const style = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 15,
        wordWrap: true,
        wordWrapWidth: 200,
    });
    const basicText = new PIXI.Text(s, style);
    basicText.x = start_x + 10;
    basicText.y = start_y + 10;

    card.addChild(basicText);
    app.stage.addChild(card);
}

function calculate_size() {
    if (game.offsetWidth > game.offsetHeight) {
        return game.offsetHeight;
    } else {
        return game.offsetWidth;
    }
}
// ------------------------------------ end code ------------------------------------


// Resize
window.addEventListener('resize', resize);

function resize() {
    game_board_size = calculate_size();

    // Resize container
    app.renderer.resize(game_board_size, game_board_size);

    // Resize fields
    for (let i = 0; i < 16; i++) {
        sprites[i].resize(Math.floor(game_board_size / 11));
    }

    // Resize red border
    // TODO

    // Resize first circle
    // TODO
}

resize();
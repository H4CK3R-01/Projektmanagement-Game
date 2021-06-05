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


let game = document.getElementById('game');

let game_board_size = calculate_size();
let sprite_size = Math.floor(game_board_size / 11);

const app = new PIXI.Application({
    autoResize: true,
    resolution: devicePixelRatio,
    backgroundAlpha: 0,
    width: game_board_size,
    height: game_board_size
});
document.getElementById('game').appendChild(app.view);


// fields
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

for (let i = 0; i < 16; i++) app.stage.addChild(sprites[i].getSprite());


// Red border
let red_border = generate_red_border(new PIXI.Graphics());
app.stage.addChild(red_border);


// White circles
let first_circle = generate_circle(new PIXI.Graphics(), 3, 9);
app.stage.addChild(first_circle);

let second_circle = generate_circle(new PIXI.Graphics(), 5, 9);
app.stage.addChild(second_circle);

let third_circle = generate_circle(new PIXI.Graphics(), 7, 9);
app.stage.addChild(third_circle);


// Card stacks
let cards_1 = generate_card_stack(PIXI.Sprite.from('/img/card_stack.png'), 3, 3, function () {
    console.log("1");
    generate_card("Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores.");
});
app.stage.addChild(cards_1);

let cards_2 = generate_card_stack(PIXI.Sprite.from('/img/card_stack.png'), 5, 3, function () {
    console.log("2");
    generate_card("Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores.");
});
app.stage.addChild(cards_2);

let cards_3 = generate_card_stack(PIXI.Sprite.from('/img/card_stack.png'), 7, 3, function () {
    console.log("3");
    generate_card("Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores.");
});
app.stage.addChild(cards_3);


function generate_card_stack(sprite, x, y, onclick) {
    sprite.x = sprite_size * x - sprite_size * 0.2;
    sprite.y = sprite_size * y - sprite_size * 0.2;
    sprite.width = sprite_size * 1.5;
    sprite.height = sprite_size * 3 * 0.72;
    sprite.interactive = true;
    sprite.on('click', onclick);
    return sprite
}

function generate_red_border(graphics) {
    graphics.lineStyle(sprite_size * 0.10, 0x862323, 1);
    graphics.drawRect(sprite_size * 9 - sprite_size * 0.2, sprite_size * 9 - sprite_size * 0.2, sprite_size * 1.5, sprite_size * 1.5);
    return graphics;
}

function generate_circle(graphics, x, y) {
    graphics.lineStyle(0);
    graphics.beginFill(0xffffff, 1);
    graphics.drawCircle(sprite_size * x - sprite_size * 0.2 + sprite_size * 0.75, sprite_size * y - sprite_size * 0.2 + sprite_size * 0.75, sprite_size / 4);
    graphics.endFill();
    return graphics;
}

function generate_card(s) {
    const card = new PIXI.Graphics();
    let start_x = game_board_size * 0.25 + 2.5;
    let start_y = game_board_size / 2 - game_board_size * 0.72 / 2 + 2.5;
    card.lineStyle(5, 0x000000, 1);
    card.beginFill(0xffffff);
    card.drawRoundedRect(start_x, start_y, game_board_size * 0.5, game_board_size * 0.72, 10);
    card.endFill();

    const style = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 15,
        wordWrap: true,
        wordWrapWidth: game_board_size * 0.5 - 10,
    });
    const basicText = new PIXI.Text(s, style);
    basicText.x = start_x + 10;
    basicText.y = start_y + 10;
    card.addChild(basicText);


    // const answer_1 = new PIXI.Text(s, style);
    // answer_1.x = start_x + 10;
    // answer_1.y = start_y + 100;
    // card.addChild(answer_1);

    // OK-Button
    const ok = new PIXI.Graphics();
    ok.lineStyle(2, 0x000000, 1);
    ok.beginFill(0xffffff);
    ok.drawRect(start_x, start_y, game_board_size * 0.5 - 20, 50);
    ok.endFill();
    ok.x = 10;
    ok.y = game_board_size * 0.72 - 60;

    card.addChild(ok);

    const ok_text = new PIXI.Text('OK', style);
    ok_text.x = start_x + ok.x + ok.width / 2 - ok_text.width / 2;
    ok_text.y = start_y + ok.y + ok.height / 2 - ok_text.height / 2;
    card.addChild(ok_text);

    ok.interactive = true;
    ok.on('click', function () {
        console.log("OK");
    });

    app.stage.addChild(card);
}


function calculate_size() {
    if (game.offsetWidth > game.offsetHeight) {
        return game.offsetHeight;
    } else {
        return game.offsetWidth;
    }
}

// Resize
window.addEventListener('resize', resize);

function resize() {
    game_board_size = calculate_size();
    sprite_size = Math.floor(game_board_size / 11);


    // Resize container
    app.renderer.resize(game_board_size, game_board_size);

    // Resize fields
    for (let i = 0; i < 16; i++) {
        sprites[i].resize(Math.floor(game_board_size / 11));
    }

    // Resize red border
    red_border.clear();
    red_border = generate_red_border(new PIXI.Graphics());
    app.stage.addChild(red_border);

    // Resize circles
    first_circle.clear();
    first_circle = generate_circle(new PIXI.Graphics(), 3, 9);
    app.stage.addChild(first_circle);

    second_circle.clear();
    second_circle = generate_circle(new PIXI.Graphics(), 5, 9);
    app.stage.addChild(second_circle);

    third_circle.clear();
    third_circle = generate_circle(new PIXI.Graphics(), 7, 9);
    app.stage.addChild(third_circle);

    // TODO card and card stacks
}

resize();
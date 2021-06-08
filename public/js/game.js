let answer = null;
let show_card = false;

let game = document.getElementById('game');
let app;

let game_board_size = 2000;
let max_size = calculate_size();
let sprite_size = Math.floor(game_board_size / 11);

function start_game() {
    app = new PIXI.Application({
        autoResize: true,
        resolution: devicePixelRatio,
        backgroundAlpha: 0,
        width: max_size / game_board_size,
        height: max_size / game_board_size
    });
    document.getElementById('game').appendChild(app.view);


    // fields
    let sprites = [
        // First row
        new Sprite(1, 1),
        new Sprite(3, 1),
        new Sprite(5, 1),
        new Sprite(7, 1),
        new Sprite(9, 1),

        // Second row
        new Sprite(1, 3),
        new Sprite(9, 3),

        // Third row
        new Sprite(1, 5),
        new Sprite(9, 5),

        // Fourth row
        new Sprite(1, 7),
        new Sprite(9, 7),

        // Fifth row
        new Sprite(1, 9),
        new Sprite(3, 9),
        new Sprite(5, 9),
        new Sprite(7, 9),
        new Sprite(9, 9),
    ]

    sprites.forEach(sprite => app.stage.addChild(sprite.getSprite()));


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
        if (!show_card) {
            console.log("1");
            new Card(game_board_size, "Ein Bäcker möchte eine neue Filiale eröffnen. Wie sollte er das Budget einteilen?", "a1", "a2", "a3", "a4", 1, 1).showCard();
            show_card = true;
        }
    });
    app.stage.addChild(cards_1);

    let cards_2 = generate_card_stack(PIXI.Sprite.from('/img/card_stack.png'), 5, 3, function () {
        if (!show_card) {
            console.log("2");
            new Card(game_board_size, "Ein Bäcker möchte eine neue Filiale eröffnen. Wie sollte er das Budget einteilen?", "a1", "a2", "a3", "a4", 1, 1).showCard();
            show_card = true;
        }
    });
    app.stage.addChild(cards_2);

    let cards_3 = generate_card_stack(PIXI.Sprite.from('/img/card_stack.png'), 7, 3, function () {
        if (!show_card) {
            console.log("3");
            new Card(game_board_size, "Ein Bäcker möchte eine neue Filiale eröffnen. Wie sollte er das Budget einteilen?", "a1", "a2", "a3", "a4", 1, 1).showCard();
            show_card = true;
        }
    });
    app.stage.addChild(cards_3);

    resize();
}

function generate_card_stack(sprite, x, y, onclick) {
    sprite.x = sprite_size * x - sprite_size * 0.2;
    sprite.y = sprite_size * y - sprite_size * 0.2;
    sprite.width = sprite_size * 1.5;
    sprite.height = sprite_size * 3 * 0.72;
    sprite.interactive = true;
    sprite.buttonMode = true;
    sprite.defaultCursor = 'pointer';
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
    let size = calculate_size();
    app.stage.scale.set(size / game_board_size, size / game_board_size);

    app.renderer.resize(size, size)
}